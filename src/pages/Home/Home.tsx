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
import AutomatonGraph from "./components/AutomatonGraph/AutomatonGraph";
import { exampleAutomaton } from "./components/AutomatonGraph/AutomatonGraph";
import { useAppSelector } from "../../store/hooks";
import { v4 as uuidv4 } from "uuid";
import { Box, IconButton, useTheme, Stack } from "@mui/material";
import Paper from "@mui/material/Paper";
import { AnalysisControlWidget } from "./components/Widget";

const bottomDrawerHeight = "24rem";

const Home = () => {
    const { automaton } = useAppSelector(state => ({
        automaton: state.automaton.automaton
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
            {automaton && (
                <AutomatonGraph
                    key={automatonGraphKey}
                    automatonStates={automaton.states}
                />
            )}
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
