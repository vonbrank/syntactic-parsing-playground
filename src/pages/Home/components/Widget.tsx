import React, { useState } from "react";
import {
    Box,
    IconButton,
    useTheme,
    Stack,
    Paper,
    Collapse
} from "@mui/material";
import { getTransitionMarginByBottomDrawer } from "./Container";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import FastForwardIcon from "@mui/icons-material/FastForward";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { TransitionGroup } from "react-transition-group";
import styles from "./Widget.module.scss";

interface AnalysisControlWidgetProps {
    bottomDrawerOpen: boolean;
    bottomDrawerHeight: string;
}

export const AnalysisControlWidget = (props: AnalysisControlWidgetProps) => {
    const { bottomDrawerHeight, bottomDrawerOpen } = props;
    const theme = useTheme();
    const [transition, marginBottom] = getTransitionMarginByBottomDrawer(
        theme,
        bottomDrawerOpen,
        bottomDrawerHeight
    );
    const [mode, setMode] = useState<"Playing" | "Idle">("Playing");

    const idleGroup = [
        <IconButton onClick={() => setMode("Playing")}>
            <PlayArrowIcon />
        </IconButton>
    ];
    const playingGroup = [
        <IconButton onClick={() => setMode("Idle")}>
            <StopIcon />
        </IconButton>,
        <IconButton>
            <RestartAltIcon />
        </IconButton>,
        <IconButton>
            <SkipPreviousIcon />
        </IconButton>,
        <IconButton>
            <SkipNextIcon />
        </IconButton>,
        <IconButton>
            <FastForwardIcon />
        </IconButton>
    ];

    const currentGroup = mode === "Idle" ? idleGroup : playingGroup;

    return (
        <Box className={styles["AnalysisControlWidget-root"]}>
            <Box
                sx={{
                    marginLeft: "9rem",
                    transition: transition,
                    marginBottom: `calc(${marginBottom} + 2.4rem)`
                }}>
                <Paper>
                    <Box>
                        <TransitionGroup
                            className={
                                styles["AnalysisControlWidget-transition-group"]
                            }>
                            {currentGroup.map((item, index) => (
                                <Collapse key={index} orientation="horizontal">
                                    {item}
                                </Collapse>
                            ))}
                        </TransitionGroup>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};
