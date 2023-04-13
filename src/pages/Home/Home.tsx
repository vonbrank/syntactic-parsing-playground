import React, { useState } from "react";
import {
    AnalysisTablePanel,
    SyntaxInputPanel,
    AnalysisPatternPanel
} from "./components/Panel";
import { AnalysisPanelsContainer } from "./components/Container";
import { DefaultAppContainer } from "@/components/Container";

const bottomDrawerHeight = "24rem";

const Home = () => {
    const [bottomDrawerOpen, setBottomDrawerOpen] = useState(false);
    return (
        <DefaultAppContainer>
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
            />
        </DefaultAppContainer>
    );
};

export default Home;
