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
    analysingToTheEnd,
    startAnalysingSentence,
    stopAnalysingSentence,
    updateAnalysingPattern
} from "@/store/reducers/automaton";
import { showTemporaryToastText } from "@/store/reducers/toast";
import useMediaQuery from "@mui/material/useMediaQuery";

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
    const { automaton, analysingPatternRes } = useAppSelector(state => ({
        automaton: state.automaton.automaton,
        analysingPatternRes: state.automaton.analysingPatternRes
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

    const handleAnalyseToFinal = () => {
        dispatch(analysingToTheEnd());
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
            case "Fast Forward":
                handleAnalyseToFinal();
                break;
            case "Previous":
                dispatch(
                    showTemporaryToastText({
                        severity: "warning",
                        message: "功能开发中，敬请期待"
                    })
                );
                break;
            default:
        }
    };

    useEffect(() => {
        if (analysingPatternRes === null) return;

        const { message, status } = analysingPatternRes;

        if (message === null) return;

        dispatch(
            showTemporaryToastText({
                severity:
                    status === "OK" || status === "Success"
                        ? "success"
                        : "error",
                message
            })
        );
    }, [analysingPatternRes]);

    const minWidth900px = useMediaQuery("(min-width:900px)");

    return (
        <Box
            className={styles["AnalysisControlWidget-root"]}
            sx={{
                bottom: minWidth900px ? 0 : "calc(40vh + 2.4rem)",
                transform: `translate(-50%, 0)`
            }}>
            <Box
                sx={{
                    transition: minWidth900px ? transition : undefined,
                    marginBottom: minWidth900px ? marginBottom : 0,
                    transform: minWidth900px
                        ? `translate(4.5rem, -2.4rem)`
                        : undefined
                }}>
                <Box>
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
                                                onClick={() =>
                                                    handleAction(item)
                                                }>
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
        </Box>
    );
};
