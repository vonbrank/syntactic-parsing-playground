import React from "react";
import { Stack, StackProps, Toolbar } from "@mui/material";
import Drawer from "@mui/material/Drawer";

interface SidePanelContainerProps extends StackProps {
    bottomDrawerOpen: boolean;
    bottomDrawerHeight: string;
}

const SidePanelContainer = (props: SidePanelContainerProps) => {
    const {
        bottomDrawerOpen,
        bottomDrawerHeight,
        direction = "row",
        alignItems = "stretch",
        sx,
        children,
        ...others
    } = props;

    return (
        <>
            <Toolbar />
            <Stack
                direction={direction}
                alignItems={alignItems}
                sx={{
                    flex: 1,
                    height: 0,
                    transition: theme =>
                        bottomDrawerOpen
                            ? theme.transitions.create("margin", {
                                  easing: theme.transitions.easing.easeOut,
                                  duration:
                                      theme.transitions.duration.enteringScreen
                              })
                            : theme.transitions.create("margin", {
                                  easing: theme.transitions.easing.sharp,
                                  duration:
                                      theme.transitions.duration.leavingScreen
                              }),
                    marginBottom: bottomDrawerOpen
                        ? `${bottomDrawerHeight}`
                        : 0,
                    ...(sx || {})
                }}
                {...others}>
                {children}
            </Stack>
        </>
    );
};

interface AnalysisPanelsContainerProps {
    leftPanel: React.ReactNode;
    rightPanel: React.ReactNode;
    bottomPanel: React.ReactNode;
    bottomPanelOpen: boolean;
    bottomDrawerHeight: string;
}

export const AnalysisPanelsContainer = (
    props: AnalysisPanelsContainerProps
) => {
    const {
        leftPanel,
        rightPanel,
        bottomDrawerHeight,
        bottomPanelOpen,
        bottomPanel
    } = props;

    return (
        <>
            <Drawer
                PaperProps={{
                    sx: {
                        zIndex: theme => theme.zIndex.drawer - 1
                    }
                }}
                variant="permanent">
                <SidePanelContainer
                    bottomDrawerOpen={bottomPanelOpen}
                    bottomDrawerHeight={bottomDrawerHeight}>
                    {leftPanel}
                </SidePanelContainer>
            </Drawer>
            <Drawer
                PaperProps={{
                    sx: {
                        zIndex: theme => theme.zIndex.drawer - 1
                    }
                }}
                anchor="right"
                variant="permanent">
                <SidePanelContainer
                    bottomDrawerOpen={bottomPanelOpen}
                    bottomDrawerHeight={bottomDrawerHeight}>
                    {rightPanel}
                </SidePanelContainer>
            </Drawer>
            <Drawer anchor="bottom" variant="persistent" open={bottomPanelOpen}>
                {bottomPanel}
            </Drawer>
        </>
    );
};
