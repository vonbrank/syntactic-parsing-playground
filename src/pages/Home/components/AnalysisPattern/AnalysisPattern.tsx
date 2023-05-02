import React, { useState, useEffect } from "react";
import { Grow } from "@mui/material";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { TransitionGroup } from "react-transition-group";

interface AnalysisPatternProps {
    stateStack: number[];
    characterStack: string[];
}

const AnalysisPattern = (props: AnalysisPatternProps) => {
    const { stateStack, characterStack } = props;
    return (
        <Stack
            sx={{
                flex: 1,
                width: 0,
                overflowX: "auto"
            }}>
            <Stack
                sx={{
                    flex: 1
                }}
                justifyContent={"start"}
                direction="row"
                alignItems={"center"}>
                <TransitionGroup
                    className={"AnalysisPatternPanel-pattern-transition-group"}>
                    <Stack
                        width={"12.8rem"}
                        sx={{
                            flexShrink: 0,
                            position: "sticky",
                            left: 0,
                            background: theme =>
                                theme.palette.background.default
                        }}
                        alignItems="center">
                        <Typography fontSize={"2rem"}>状态栈</Typography>
                    </Stack>
                    {stateStack.map((state, index) => (
                        <Grow key={`${state}-${index}`}>
                            <Stack
                                width={"6.4rem"}
                                alignItems="center"
                                sx={{ flexShrink: 0 }}>
                                <Typography fontSize={"2rem"}>
                                    {state === -1 ? "" : state}
                                </Typography>
                            </Stack>
                        </Grow>
                    ))}
                </TransitionGroup>
            </Stack>
            <Stack
                sx={{
                    flex: 1
                }}
                justifyContent={"start"}
                direction="row"
                alignItems={"center"}>
                <TransitionGroup
                    className={"AnalysisPatternPanel-pattern-transition-group"}>
                    <Stack
                        width={"12.8rem"}
                        sx={{
                            flexShrink: 0,
                            position: "sticky",
                            left: 0,
                            background: theme =>
                                theme.palette.background.default
                        }}
                        alignItems="center">
                        <Typography fontSize={"2rem"}>符号栈</Typography>
                    </Stack>
                    {characterStack.map((character, index) => (
                        <Grow key={`${character}-${index}`}>
                            <Stack
                                width={"6.4rem"}
                                alignItems="center"
                                sx={{ flexShrink: 0 }}>
                                <Typography fontSize={"2rem"}>
                                    {character}
                                </Typography>
                            </Stack>
                        </Grow>
                    ))}
                </TransitionGroup>
            </Stack>
        </Stack>
    );
};
export default AnalysisPattern;
