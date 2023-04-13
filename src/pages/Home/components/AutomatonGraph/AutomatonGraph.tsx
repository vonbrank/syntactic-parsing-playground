import { Box, useTheme } from "@mui/material";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface AutomatonState {
    id: string;
    transfers: AutomatonTransfer[];
    itemSets: string[];
}

interface AutomatonTransfer {
    character: string;
    targetId: string;
}

export const exampleAutomaton: AutomatonState[] = [
    {
        id: "0",
        transfers: [
            {
                character: "S",
                targetId: "1"
            },
            {
                character: "B",
                targetId: "2"
            },
            {
                character: "a",
                targetId: "3"
            },
            {
                character: "b",
                targetId: "4"
            }
        ],
        itemSets: []
    },
    {
        id: "1",
        transfers: [],
        itemSets: []
    },
    {
        id: "2",
        transfers: [
            {
                character: "B",
                targetId: "5"
            },
            {
                character: "a",
                targetId: "3"
            },
            {
                character: "b",
                targetId: "4"
            }
        ],
        itemSets: []
    },
    {
        id: "3",
        transfers: [
            {
                character: "B",
                targetId: "6"
            },
            {
                character: "a",
                targetId: "3"
            },
            {
                character: "b",
                targetId: "4"
            }
        ],
        itemSets: []
    },
    {
        id: "4",
        transfers: [],
        itemSets: []
    },
    {
        id: "5",
        transfers: [],
        itemSets: []
    },
    {
        id: "6",
        transfers: [],
        itemSets: []
    }
];

interface AutomatonGraphProps {
    automatonStates: AutomatonState[];
}

interface AutomatonGraphInfo {
    graph: d3Graph;
    simulation: d3.Simulation<d3Node, any>;
}

const AutomatonGraph = (props: AutomatonGraphProps) => {
    const { automatonStates } = props;

    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    const automatonContainerRef = useRef<HTMLDivElement>(null);
    const automatonSvgRef = useRef<SVGSVGElement>(null);

    const theme = useTheme();

    const automatonGraphInfoRef = useRef<AutomatonGraphInfo>({
        graph: {
            nodes: automatonStates.map(state => ({
                id: state.id,
                itemSets: []
            })),
            links: automatonStates.reduce((acc, state) => {
                const currentLinks: d3Link[] = state.transfers.map(
                    transfer => ({
                        target: transfer.targetId,
                        source: state.id,
                        character: transfer.character
                    })
                );
                return [...acc, ...currentLinks];
            }, [] as d3Link[])
        },
        simulation: d3
            .forceSimulation<d3Node>()
            .force("charge", d3.forceManyBody().strength(-50).distanceMax(2000))
            .force("collide", d3.forceCollide().radius(100))
    });

    const linksRef = useRef<{
        links: d3Link[];
    }>({
        links: automatonGraphInfoRef.current
            ? automatonGraphInfoRef.current.graph.links
            : []
    });
    const nodesRef = useRef<{
        nodes: d3Node[];
        simulation: d3.Simulation<d3Node, any>;
    }>({
        nodes: automatonGraphInfoRef.current
            ? automatonGraphInfoRef.current.graph.nodes
            : [],
        simulation: automatonGraphInfoRef.current.simulation
    });

    useEffect(() => {
        const currentAutomatonContainerRef = automatonContainerRef.current;
        const currentAutomatonSvgRef = automatonSvgRef.current;
        if (
            currentAutomatonContainerRef === null ||
            currentAutomatonSvgRef === null
        )
            return;

        const clientWidth = currentAutomatonContainerRef.clientWidth;
        const clientHeight = currentAutomatonContainerRef.clientHeight;
        setWidth(clientWidth);
        setHeight(clientHeight);

        const context = d3.select(currentAutomatonSvgRef);

        const currentAutomatonGraphInfoRef = automatonGraphInfoRef.current;

        const data = currentAutomatonGraphInfoRef.graph;

        const simulation = currentAutomatonGraphInfoRef.simulation;
        simulation.force(
            "center",
            d3.forceCenter(clientWidth / 2, clientHeight / 2)
        );

        const links: d3.Selection<
            SVGLineElement,
            d3Link,
            SVGSVGElement,
            unknown
        > = context.selectAll("line");
        const texts: d3.Selection<
            SVGTextElement,
            d3Node,
            SVGSVGElement,
            unknown
        > = context.selectAll("text.node-text");
        const nodes: d3.Selection<
            SVGCircleElement,
            d3Node,
            SVGSVGElement,
            unknown
        > = context.selectAll("circle");

        const ticked = () => {
            const getNodeById = (nodes: d3Node[], id: string) => {
                return nodes.find(node => node.id === id)!;
            };

            links
                .attr("x1", function (d: d3Link) {
                    return getNodeById(data.nodes, d.source).x || 0;
                })
                .attr("y1", function (d: d3Link) {
                    return getNodeById(data.nodes, d.source).y || 0;
                })
                .attr("x2", function (d: d3Link) {
                    return getNodeById(data.nodes, d.target).x || 0;
                })
                .attr("y2", function (d: d3Link) {
                    return getNodeById(data.nodes, d.target).y || 0;
                });

            nodes
                .attr("cx", function (d: d3Node) {
                    return d.x || 0;
                })
                .attr("cy", function (d: d3Node) {
                    return d.y || 0;
                });

            texts
                .attr("x", function (d: d3Node) {
                    return d.x || 0;
                })
                .attr("y", function (d: d3Node) {
                    return d.y || 0;
                });
        };
        simulation.nodes(data.nodes);
        simulation.force(
            "link",
            d3
                .forceLink<d3Node, d3Link>(
                    data.links.map(link => ({ ...link }))
                )
                .id(d => d.id)
                .distance(200)
        );
        simulation.on("tick", ticked);
    }, []);

    return (
        <Box
            width={"100vw"}
            height="100vh"
            sx={{
                position: "fixed",
                top: 0,
                left: 0
            }}
            ref={automatonContainerRef}>
            <svg ref={automatonSvgRef} width={width} height={height}>
                <Links ref={linksRef} />
                <Nodes ref={nodesRef} />
            </svg>
        </Box>
    );
};

export default AutomatonGraph;

interface d3Node extends d3.SimulationNodeDatum {
    id: string;
    itemSets: string[];
}

interface d3Link extends d3.SimulationLinkDatum<d3Node> {
    source: string;
    target: string;
    character: string;
}

interface d3Graph {
    nodes: d3Node[];
    links: d3Link[];
}

const Nodes = forwardRef<{
    nodes: d3Node[];
    simulation: d3.Simulation<d3Node, any>;
}>((props: {}, ref) => {
    const gRef = useRef<SVGGElement>(null);

    const theme = useTheme();

    useEffect(() => {
        if (ref === null || typeof ref === "function") return;

        const currentRef = ref.current;
        if (currentRef === null) return;

        const context = d3.select(gRef.current);
        const color = d3.scaleOrdinal(d3.schemeCategory10);
        const simulation = currentRef.simulation;

        context.selectChildren("g").remove();

        function dragstarted(event: any, node: d3Node) {
            node.fx = event.x;
            node.fy = event.y;
        }

        function dragged(event: any, data: d3Node) {
            data.fx = event.x;
            data.fy = event.y;
            simulation.alpha(1).restart();
        }

        function dragended(event: any, data: d3Node) {
            data.fx = null;
            data.fy = null;
        }

        const drag = d3
            .drag<any, d3Node>()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);

        const nodes = context
            .selectAll("circle")
            .data(currentRef.nodes)
            .enter()
            .append("circle")
            .attr("r", 15)
            .attr("fill", theme.palette.primary.main)
            .style("overflow", "visible")
            .call(drag);

        context
            .selectAll("text")
            .data(currentRef.nodes)
            .enter()
            .append("text")
            .attr("class", "node-text")
            .style("pointer-events", "none")
            .text(function (d: d3Node) {
                return d.id;
            });
    }, []);

    return <g className="nodes" ref={gRef} />;
});

const Links = forwardRef<{
    links: d3Link[];
}>((props: {}, ref) => {
    const gRef = useRef<SVGGElement>(null);

    useEffect(() => {
        if (ref === null || typeof ref === "function") return;

        const currentRef = ref.current;
        if (currentRef === null) return;

        const context = d3.select(gRef.current);
        context.selectChildren("line").remove();

        context
            .selectAll("line")
            .data(currentRef.links)
            .enter()
            .append("line")
            .attr("stroke", "lightgrey")
            .attr("stroke-width", 2);
    }, []);

    return <g className="links" ref={gRef} />;
});
