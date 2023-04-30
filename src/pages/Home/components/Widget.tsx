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
import { useAppSelector } from "../../../store/hooks";
import {
    LR0AnalysingPattern,
    ReduceLR0AnalysingPattern
} from "@/modules/automatons/lr0";

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
    const [mode, setMode] = useState<"Playing" | "Idle">("Idle");

    const { automaton } = useAppSelector(state => ({
        automaton: state.automaton.automaton
    }));

    const [currentPattern, setCurrentPattern] =
        useState<LR0AnalysingPattern | null>(null);

    const onStartAnalysing = () => {
        if (automaton === null) return;

        console.log("automaton = ", automaton);

        setCurrentPattern({
            currentStepIndex: 0,
            stateStack: [0],
            characterStack: ["$"],
            remainCharacters: ["b", "a", "b", "$"],
            initialSentence: "bab"
        });
    };

    const handleAnalyseNextStep = () => {
        if (automaton === null) return;
        setCurrentPattern(current => {
            if (current !== null) {
                const newPattern = ReduceLR0AnalysingPattern(
                    current,
                    automaton,
                    1
                );
                console.log("new pattern = ", newPattern);
                return newPattern;
            }
            return current;
        });
    };

    const idleGroup = [
        <IconButton
            onClick={() => {
                setMode("Playing");
                onStartAnalysing();
            }}>
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
        <IconButton onClick={handleAnalyseNextStep}>
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
