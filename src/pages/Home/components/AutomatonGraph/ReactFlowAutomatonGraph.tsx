import React, { useEffect, memo } from "react";
import {
    LR0Automaton,
    LR0AutomatonState,
    LR0Production
} from "@/modules/automatons/lr0/LR0";
import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    MiniMap,
    Controls,
    Background,
    Edge,
    NodeProps,
    Handle,
    Position,
    NodeTypes
} from "reactflow";
import { Box, Divider, Paper, Stack } from "@mui/material";
import "reactflow/dist/style.css";
import Typography from "@mui/material/Typography/Typography";

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

interface AutomatonNodeProps extends NodeProps<AutomatonNodeData> {}

const NODE_VERTICAL_PADDING = 1.6;
const NODE_HORIZONTAL_PADDING = 1.6;
const NODE_VERTIAL_SPACING = 0.4;
const NODE_LINE_HEIGHT = 1.5;
const NODE_FONT_SIZE = 1.6;
const NODE_FONT_HEIGHT = NODE_FONT_SIZE * NODE_LINE_HEIGHT;
const NODE_FONT_WIDTH = NODE_FONT_HEIGHT / 2.15;

const itemFormat = (production: LR0Production) => {
    return `${production.leftSide} ➜ ${production.rightSide.join(" ")}`;
};

const AutomatonNode = memo((props: AutomatonNodeProps) => {
    const { data, isConnectable, xPos, yPos } = props;
    const { productions } = data;

    return (
        <>
            <Handle
                type="target"
                position={Position.Top}
                isConnectable={isConnectable}
            />
            <Paper>
                <Stack
                    paddingY="1.6rem"
                    spacing={"0.4rem"}
                    sx={{
                        "& .MuiTypography-root": {
                            fontFamily: `"Roboto Mono", monospace`
                        }
                    }}>
                    <Box paddingX="1.6rem">
                        <Typography textAlign={"center"}>
                            {/* {data.label}{" "} */}
                            {`[${xPos.toFixed(0)}, ${yPos.toFixed(0)}]`}
                        </Typography>
                    </Box>
                    <Divider />
                    <Stack paddingX="1.6rem">
                        {data.productions.map((production, index) => {
                            return (
                                <Typography key={index}>
                                    {[...itemFormat(production)].map(
                                        (char, index) => (
                                            <span key={index}>{char}</span>
                                        )
                                    )}
                                </Typography>
                            );
                        })}
                    </Stack>
                </Stack>
            </Paper>
            <Handle
                type="source"
                position={Position.Bottom}
                isConnectable={isConnectable}
            />
        </>
    );
});

const nodeTypes: NodeTypes = {
    itemSet: AutomatonNode
};

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
        let coordinates: [number, number][] = [];
        const size: [number, number][] = [];

        const getStateSize: (
            state: LR0AutomatonState
        ) => [number, number] = state => {
            const { itemSet } = state;
            const maxLength =
                itemSet.reduce(
                    (acc, item) => Math.max(acc, [...itemFormat(item)].length),
                    0
                ) + 1;
            console.log(`state-${state.id}: `, {
                fontWidth: NODE_FONT_WIDTH,
                maxLength: maxLength * NODE_FONT_WIDTH,
                x: maxLength * NODE_FONT_WIDTH + 2 * NODE_HORIZONTAL_PADDING
            });

            return [
                maxLength * NODE_FONT_WIDTH + 2 * NODE_HORIZONTAL_PADDING,
                NODE_VERTICAL_PADDING * 2 +
                    NODE_VERTIAL_SPACING * 2 +
                    (itemSet.length + 1) * NODE_FONT_HEIGHT
            ];
        };

        for (let i = 1; i <= maxN; i++) {
            if (i === 1) {
                coordinates.push([1, 1]);
                size.push(getStateSize(states[0]));
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
                size.push(getStateSize(states[currentIndex - 1]));

                // console.log(coordinates);

                if (currentIndex >= i * i || currentIndex >= maxIndex) break;
            }

            if (currentIndex >= maxIndex) break;
        }

        const MIN_INTERNAL = 10;

        while (true) {
            let noUpdate = true;
            const newCoordinates = [...coordinates];

            for (let i = 0; i < states.length; i++) {
                for (let j = i + 1; j < states.length; j++) {
                    const [x1, y1] = coordinates[i];
                    const [x2, y2] = coordinates[j];

                    const [w1, h1] = size[i];
                    const [w2, h2] = size[j];

                    const minTargetWidth = (w1 + w2) / 2;
                    const minTargetHeight = (h1 + h2) / 2;

                    const targetMinDis = Math.sqrt(
                        minTargetWidth * minTargetWidth +
                            minTargetHeight * minTargetHeight
                    );
                    let currentDis = Math.sqrt(
                        (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)
                    );
                    let vec: [number, number] = [x2 - x1, y2 - y1];
                    if (
                        Math.abs(x2 - x1) < Number.EPSILON ||
                        Math.abs(y2 - y1) < Number.EPSILON
                    ) {
                        vec = [1, 1];
                        currentDis = 1;
                    }
                    if (vec[0] < 0 && vec[1] < 0) {
                        vec[0] = -vec[0];
                        vec[1] = -vec[1];
                    }

                    if (currentDis < targetMinDis) {
                        const newVec: [number, number] = [
                            (vec[0] * (targetMinDis + MIN_INTERNAL)) /
                                currentDis,
                            (vec[1] * (targetMinDis + MIN_INTERNAL)) /
                                currentDis
                        ];
                        const targetCoordinate: [number, number] = [
                            x1 + newVec[0],
                            y1 + newVec[1]
                        ];

                        console.log(`${i} vs ${j} = `, {
                            x1,
                            y1,
                            x2,
                            y2,
                            w1,
                            w2,
                            minTargetWidth,
                            minTargetHeight,
                            targetMinDis,
                            currentDis,
                            vec,
                            newVec,
                            targetCoordinate
                        });

                        newCoordinates[j] = [...targetCoordinate];
                        noUpdate = false;
                    }
                }
            }
            coordinates = newCoordinates;
            if (noUpdate) break;
        }

        console.log("coordinates", coordinates);
        console.log("size", size);

        setNodes(
            states.map((state, index) => {
                const [x, y] = coordinates[index];
                // const [x, y] = [index, 1];

                return {
                    id: `node-${state.id}`,
                    data: {
                        label: `state-${state.id}`,
                        productions: state.itemSet
                    },
                    position: { x: x * 10, y: y * 10 },
                    type: "itemSet"
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
                nodeTypes={nodeTypes}
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
