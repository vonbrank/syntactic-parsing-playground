import React, { useState } from "react";
import { Toolbar } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import { DefaultAppContainer } from "../../components/Container";
import {
    AnalysisTablePanel,
    SyntaxInputPanel,
    AnalysisPatternPanel
} from "./components/Panel";

const bottomDrawerHeight = "24rem";

const Home = () => {
    const [bottomDrawerOpen, setBottomDrawerOpen] = useState(false);
    return (
        <DefaultAppContainer>
            <Drawer
                PaperProps={{
                    sx: {
                        zIndex: theme => theme.zIndex.drawer - 1
                    }
                }}
                variant="permanent">
                <Toolbar />
                <SyntaxInputPanel
                    bottomDrawerOpen={bottomDrawerOpen}
                    setBottomDrawerOpen={setBottomDrawerOpen}
                    bottomDrawerHeight={bottomDrawerHeight}
                />
            </Drawer>
            <Drawer
                PaperProps={{
                    sx: {
                        zIndex: theme => theme.zIndex.drawer - 1
                    }
                }}
                anchor="right"
                variant="permanent">
                <Toolbar />
                <AnalysisTablePanel
                    bottomDrawerOpen={bottomDrawerOpen}
                    setBottomDrawerOpen={setBottomDrawerOpen}
                    bottomDrawerHeight={bottomDrawerHeight}
                />
            </Drawer>
            <Drawer
                anchor="bottom"
                variant="persistent"
                open={bottomDrawerOpen}>
                <AnalysisPatternPanel
                    bottomDrawerHeight={bottomDrawerHeight}
                    setBottomDrawerOpen={setBottomDrawerOpen}
                />
            </Drawer>
        </DefaultAppContainer>
    );
};

export default Home;
