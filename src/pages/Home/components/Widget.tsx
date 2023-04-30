import React, { useState, useEffect } from "react";
import {
    Box,
    IconButton,
    useTheme,
    Stack,
    Paper,
    Collapse,
    Grow
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
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import {
    startAnalysingSentence,
    stopAnalysingSentence,
    updateAnalysingPattern
} from "@/store/reducers/automaton";

interface AnalysisControlWidgetProps {
    bottomDrawerOpen: boolean;
    bottomDrawerHeight: string;
}

export type UpdateAnalysingPatternOption =
    | "RESTART"
    | "PREVIOUS"
    | "NEXT"
    | "FINAL";

const labelToButtonIcon = {
    Play: <PlayArrowIcon />,
    Stop: <StopIcon />,
    Previous: <SkipPreviousIcon />,
    Next: <SkipNextIcon />,
    "Fast Forward": <FastForwardIcon />,
    Restart: <RestartAltIcon />
};

type ActionLabel = keyof typeof labelToButtonIcon;

export const AnalysisControlWidget = (props: AnalysisControlWidgetProps) => {
    const { bottomDrawerHeight, bottomDrawerOpen } = props;
    const dispatch = useAppDispatch();
    const { automaton } = useAppSelector(state => ({
        automaton: state.automaton.automaton
    }));
    const theme = useTheme();
    const [transition, marginBottom] = getTransitionMarginByBottomDrawer(
        theme,
        bottomDrawerOpen,
        bottomDrawerHeight
    );
    const [mode, setMode] = useState<"Playing" | "Idle">("Idle");

    const onStartAnalysing = () => {
        setMode("Playing");
        dispatch(startAnalysingSentence());
    };
    const onStopAnalysing = () => {
        setMode("Idle");
        dispatch(stopAnalysingSentence());
    };

    const handleAnalyseNextStep = () => {
        dispatch(updateAnalysingPattern("NEXT"));
    };

    const [currentGroup, setCurrentGroup] = useState<ActionLabel[]>([]);

    useEffect(() => {
        setCurrentGroup(() => {
            if (mode === "Idle") {
                return ["Play"];
            }
            return ["Stop", "Restart", "Previous", "Next", "Fast Forward"];
        });
    }, [mode]);

    useEffect(() => {
        setMode("Idle");
    }, [automaton]);

    const handleAction = (actionLabel: ActionLabel) => {
        switch (actionLabel) {
            case "Play":
            case "Restart":
                onStartAnalysing();
                break;
            case "Stop":
                onStopAnalysing();
                break;
            case "Next":
                handleAnalyseNextStep();
                break;
            default:
        }
    };

    return (
        <Box className={styles["AnalysisControlWidget-root"]}>
            <Box
                sx={{
                    marginLeft: "9rem",
                    transition: transition,
                    marginBottom: `calc(${marginBottom} + 2.4rem)`
                }}>
                <Grow in={automaton !== null}>
                    <Paper>
                        <Box>
                            <TransitionGroup
                                className={
                                    styles[
                                        "AnalysisControlWidget-transition-group"
                                    ]
                                }>
                                {currentGroup.map((item, index) => (
                                    <Collapse
                                        key={item}
                                        orientation="horizontal">
                                        <IconButton
                                            onClick={() => handleAction(item)}>
                                            {labelToButtonIcon[item]}
                                        </IconButton>
                                    </Collapse>
                                ))}
                            </TransitionGroup>
                        </Box>
                    </Paper>
                </Grow>
            </Box>
        </Box>
    );
};
