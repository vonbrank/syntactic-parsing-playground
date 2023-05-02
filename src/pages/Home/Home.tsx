import React, { useState, useEffect } from "react";
import {
    AnalysisTablePanel,
    SyntaxInputPanel,
    AnalysisPatternPanel
} from "./components/Panel";
import {
    AnalysisPanelsContainer,
    getTransitionMarginByBottomDrawer
} from "./components/Container";
import { DefaultAppContainer } from "@/components/Container";
import AutomatonGraph from "./components/AutomatonGraph";
import { useAppSelector } from "../../store/hooks";
import { v4 as uuidv4 } from "uuid";
import { Box, IconButton, useTheme, Stack } from "@mui/material";
import Paper from "@mui/material/Paper";
import { AnalysisControlWidget } from "./components/Widget";

const bottomDrawerHeight = "24rem";

const Home = () => {
    const { automaton, currentPattern } = useAppSelector(state => ({
        automaton: state.automaton.automaton,
        currentPattern: state.automaton.currentPattern
    }));

    const [bottomDrawerOpen, setBottomDrawerOpen] = useState(false);

    const [automatonGraphKey, setAutomatonGraphKey] = useState(uuidv4());

    useEffect(() => {
        if (automaton) {
            setAutomatonGraphKey(uuidv4());
        }
    }, [automaton]);

    return (
        <DefaultAppContainer>
            <AutomatonGraph
                key={automatonGraphKey}
                automaton={automaton}
                currentPattern={currentPattern}
            />
            <AnalysisPanelsContainer
                bottomPanelOpen={bottomDrawerOpen}
                bottomDrawerHeight={bottomDrawerHeight}
                leftPanel={
                    <SyntaxInputPanel
                        bottomDrawerOpen={bottomDrawerOpen}
                        setBottomDrawerOpen={setBottomDrawerOpen}
                    />
                }
                rightPanel={<AnalysisTablePanel />}
                bottomPanel={
                    <AnalysisPatternPanel
                        bottomDrawerHeight={bottomDrawerHeight}
                        setBottomDrawerOpen={setBottomDrawerOpen}
                    />
                }
                analysisControlWidget={
                    <AnalysisControlWidget
                        bottomDrawerOpen={bottomDrawerOpen}
                        bottomDrawerHeight={bottomDrawerHeight}
                    />
                }
            />
        </DefaultAppContainer>
    );
};

export default Home;
