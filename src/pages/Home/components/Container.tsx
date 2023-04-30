import React from "react";
import { Stack, StackProps, Toolbar, Box, useTheme } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import { Theme } from "@mui/material/styles";

interface SidePanelContainerProps extends StackProps {
    bottomDrawerOpen: boolean;
    bottomDrawerHeight: string;
}

export const getTransitionMarginByBottomDrawer: (
    theme: Theme,
    bottomDrawerOpen: boolean,
    bottomDrawerHeight: string
) => [string, string | number] = (
    theme: Theme,
    bottomDrawerOpen: boolean,
    bottomDrawerHeight: string
) => {
    const transition = bottomDrawerOpen
        ? theme.transitions.create("margin", {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen
          })
        : theme.transitions.create("margin", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen
          });
    const marginBottom = bottomDrawerOpen ? `${bottomDrawerHeight}` : "0rem";
    return [transition, marginBottom];
};

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

    const theme = useTheme();
    const [transition, marginBottom] = getTransitionMarginByBottomDrawer(
        theme,
        bottomDrawerOpen,
        bottomDrawerHeight
    );

    return (
        <>
            <Toolbar />
            <Stack
                direction={direction}
                alignItems={alignItems}
                sx={{
                    flex: 1,
                    height: 0,
                    transition: transition,
                    marginBottom: marginBottom,
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
    analysisControlWidget: React.ReactNode;
    bottomPanelOpen: boolean;
    bottomDrawerHeight: string;
}

export const AnalysisPanelsContainer: React.FC<AnalysisPanelsContainerProps> = (
    props: AnalysisPanelsContainerProps
) => {
    const {
        leftPanel,
        rightPanel,
        bottomDrawerHeight,
        bottomPanelOpen,
        bottomPanel,
        analysisControlWidget
    } = props;

    return (
        <Box sx={{ flex: 1, height: 0, position: "relative" }}>
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
            {analysisControlWidget}
        </Box>
    );
};
