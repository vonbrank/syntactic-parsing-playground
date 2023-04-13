import {
    Box,
    BoxProps,
    Stack,
    StackProps,
    Typography,
    useTheme
} from "@mui/material";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
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
        itemSets: ["S' → ·S", "S → ·BB", "B → ·aB", "B → ·b"]
    },
    {
        id: "1",
        transfers: [],
        itemSets: ["S' →S·"]
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
        itemSets: ["S→B·B", "B→·aB", "B→·b"]
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
        itemSets: ["B → a·B", "B → ·aB", "B → ·b"]
    },
    {
        id: "4",
        transfers: [],
        itemSets: ["B → b·"]
    },
    {
        id: "5",
        transfers: [],
        itemSets: ["S → BB·"]
    },
    {
        id: "6",
        transfers: [],
        itemSets: ["B → aB·"]
    }
];

interface AutomatonGraphProps {
    automatonStates: AutomatonState[];
}

interface AutomatonGraphInfo {
    graph: d3Graph;
    simulation: d3.Simulation<d3Node, any>;
    svgTransform: {
        x: number;
        y: number;
        k: number;
    };
}

const NODE_MAX_DISTANCE = 500;
const NODE_DISTANCE = 400;
const NODE_COLLISION_RADIUS = 200;

const AutomatonGraph = (props: AutomatonGraphProps) => {
    const { automatonStates } = props;

    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    const automatonContainerRef = useRef<HTMLDivElement>(null);
    const automatonSvgRef = useRef<SVGSVGElement>(null);
    const automatonSvgGRef = useRef<SVGGElement>(null);

    const theme = useTheme();

    const automatonGraphInfoRef = useRef<AutomatonGraphInfo>({
        graph: {
            nodes: automatonStates.map(state => ({
                id: state.id,
                itemSets: [...state.itemSets]
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
            .force(
                "charge",
                d3.forceManyBody().strength(-50).distanceMax(NODE_MAX_DISTANCE)
            )
            .force("collide", d3.forceCollide().radius(NODE_COLLISION_RADIUS)),
        svgTransform: {
            x: 0,
            y: 0,
            k: 1
        }
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

    const runSimulation = () => {
        console.log("running simulation...");

        const currentAutomatonSvgRef = automatonSvgRef.current;
        const currentAutomatonSvgGRef = automatonSvgGRef.current;
        if (currentAutomatonSvgRef === null || currentAutomatonSvgGRef === null)
            return;

        const context = d3.select(currentAutomatonSvgRef);
        const g = d3.select(currentAutomatonSvgGRef);

        const currentAutomatonGraphInfoRef = automatonGraphInfoRef.current;

        const data = currentAutomatonGraphInfoRef.graph;

        const simulation = currentAutomatonGraphInfoRef.simulation;
        simulation.force("center", d3.forceCenter(width / 2, height / 2));

        const links: d3.Selection<
            SVGLineElement,
            d3Link,
            SVGSVGElement,
            unknown
        > = context.selectAll(".links line");
        const texts: d3.Selection<
            SVGTextElement,
            d3Node,
            SVGSVGElement,
            unknown
        > = context.selectAll("text.node-text");
        const nodes: d3.Selection<
            SVGForeignObjectElement,
            d3Node,
            SVGSVGElement,
            unknown
        > = context.selectAll(".nodes .automaton-state-class");

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

            nodes.attr("transform", d => {
                return (
                    d &&
                    `translate(${d.x ? d.x - 64 : 0}, ${d.y ? d.y - 96 : 0})`
                );
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
                .distance(NODE_DISTANCE)
        );
        simulation.on("tick", ticked);

        const zoom = d3
            .zoom<SVGSVGElement, unknown>()
            .scaleExtent([0, 40])
            .on("zoom", event => {
                const { transform } = event;
                g.attr("transform", transform);
                automatonGraphInfoRef.current.svgTransform = transform;
                // console.log("current transform = ", transform);
            })
            .filter(function (event) {
                // 滚动缩放须同时按住`Alt`键，拖拽不需要
                return (
                    (event.altKey && event.type === "wheel") ||
                    event.type === "mousedown"
                );
            });
        const currentTransform = automatonGraphInfoRef.current.svgTransform;
        context
            .call(zoom)
            .call(
                zoom.transform,
                d3.zoomIdentity
                    .translate(currentTransform.x, currentTransform.y)
                    .scale(currentTransform.k)
            );
    };

    useEffect(() => {
        const updateSize = () => {
            const currentAutomatonContainerRef = automatonContainerRef.current;
            if (currentAutomatonContainerRef === null) return;

            const clientWidth = currentAutomatonContainerRef.clientWidth;
            const clientHeight = currentAutomatonContainerRef.clientHeight;
            setWidth(clientWidth);
            setHeight(clientHeight);
        };

        updateSize();
        runSimulation();

        window.addEventListener("resize", updateSize);

        return () => {
            window.removeEventListener("resize", updateSize);
        };
    }, []);

    useEffect(() => {
        const simulation = automatonGraphInfoRef.current.simulation;
        simulation.force("center", d3.forceCenter(width / 2, height / 2));
        simulation.alpha(1).restart();
    }, [width, height]);

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
                <g ref={automatonSvgGRef}>
                    <Links ref={linksRef} />
                    <Nodes ref={nodesRef} />
                </g>
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
        const currentGRef = gRef.current;
        if (currentRef === null || currentGRef === null) return;

        const context = d3.select(currentGRef);
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
            .selectAll(".automaton-state-class")
            .data(currentRef.nodes)
            .join(
                enter =>
                    enter
                        .append("foreignObject")
                        .call(drag)
                        .attr(
                            "class",
                            d =>
                                `automaton-state-class-${d.id} automaton-state-class`
                        )
                        .attr("width", "12.8rem")
                        .attr("height", "19.2rem")
                        .attr("overflow", "visible")
                        .style("outline", "none")
                        .attr("id", d => `foreign_${d.id}`),
                update => update,
                exit => exit.remove()
            );

        currentRef.nodes.forEach(node => {
            const className = `automaton-state-class-${node.id}`;
            const [rootElement] = currentGRef.getElementsByClassName(className);

            ReactDOM.createRoot(rootElement).render(
                <AutomatonState
                    sx={{
                        background: theme => theme.palette.background.paper,
                        width: 128,
                        height: 192,
                        boxSizing: "border-box",
                        boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)"
                    }}
                    className="automaton-state-container"
                    id={node.id}
                    itemSets={node.itemSets}
                />
            );
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

interface AutomatonStateProps extends StackProps {
    id: string;
    itemSets: string[];
}

const AutomatonState = (props: AutomatonStateProps) => {
    const { id, itemSets, sx, ...others } = props;
    return (
        <Stack
            sx={{
                padding: "1.6rem",
                ...sx
            }}
            {...others}>
            <Typography
                variant="body1"
                sx={{ fontSize: "2.4rem" }}>{`I${id}:`}</Typography>
            <Stack>
                {itemSets.map((item, index) => (
                    <Typography
                        variant="body1"
                        key={index}
                        sx={{ fontSize: "2rem" }}>
                        {item}
                    </Typography>
                ))}
            </Stack>
        </Stack>
    );
};
