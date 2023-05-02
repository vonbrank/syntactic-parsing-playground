import React, { useEffect } from "react";
import { LR0Automaton, LR0Production } from "@/modules/automatons/lr0/LR0";
import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    MiniMap,
    Controls,
    Background,
    Edge
} from "reactflow";
import { Box } from "@mui/material";
import "reactflow/dist/style.css";

interface AutomatonGraphProps {
    automaton: LR0Automaton | null;
}

const paddingLeft = `${32 + 9}rem`;
const paddingRight = `${32}rem`;
const paddingTop = `${6.4}rem`;

interface AutomatonNodeData {
    label: string;
    productions: LR0Production[];
}

interface AutomatonEdgeData {}

const AutomatonGraph = (props: AutomatonGraphProps) => {
    const { automaton } = props;

    const [nodes, setNodes, onNodesChange] = useNodesState<AutomatonNodeData>(
        []
    );
    const [edges, setEdges, onEdgesChange] = useEdgesState<AutomatonEdgeData>(
        []
    );

    useEffect(() => {
        if (automaton === null) {
            setNodes([]);
            setEdges([]);
            return;
        }

        const { states } = automaton;

        const maxIndex = states.length;
        // const maxIndex = 10;
        const maxN = Math.ceil(Math.sqrt(maxIndex));
        const coordinates: [number, number][] = [];

        for (let i = 1; i <= maxN; i++) {
            if (i === 1) {
                coordinates.push([1, 1]);
                continue;
            }

            const startIndex = (i - 1) * (i - 1);
            let currentIndex = startIndex;

            while (true) {
                currentIndex++;

                if (currentIndex - startIndex > i - 1) {
                    coordinates.push([currentIndex - startIndex - i + 1, i]);
                } else {
                    coordinates.push([i, currentIndex - startIndex]);
                }

                // console.log(coordinates);

                if (currentIndex >= i * i || currentIndex >= maxIndex) break;
            }

            if (currentIndex >= maxIndex) break;
        }

        console.log(coordinates);

        setNodes(
            states.map((state, index) => {
                const [x, y] = coordinates[index];

                return {
                    id: `node-${state.id}`,
                    data: {
                        label: `state-${state.id}`,
                        productions: []
                    },
                    position: { x: x * 300, y: y * 100 }
                };
            })
        );

        setEdges(
            states.reduce((acc, state) => {
                const additionalEdges: Edge<AutomatonEdgeData>[] =
                    state.targets.reduce((acc, target) => {
                        const additionalEdges: Edge<AutomatonEdgeData>[] =
                            target.transferSymbols.map(transferSymbol => ({
                                id: `edge-${state.id}-${target.id}`,
                                source: `node-${state.id}`,
                                target: `node-${target.id}`,
                                label: transferSymbol
                            }));

                        return [...acc, ...additionalEdges];
                    }, [] as Edge<AutomatonEdgeData>[]);

                return [...acc, ...additionalEdges];
            }, [] as Edge<AutomatonEdgeData>[])
        );
    }, [automaton]);

    return (
        <Box
            height="100vh"
            width="100vw"
            sx={{
                paddingLeft: paddingLeft,
                paddingRight: paddingRight,
                paddingTop: paddingTop
            }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                fitView
                nodesConnectable={false}>
                <MiniMap position="top-right" />
                <Background />
                <Controls position="top-left" />
            </ReactFlow>
        </Box>
    );
};

export default AutomatonGraph;
