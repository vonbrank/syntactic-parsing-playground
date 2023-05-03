import React, { useState } from "react";
import {
    Stack,
    StackProps,
    Toolbar,
    Box,
    useTheme,
    useMediaQuery,
    Tabs,
    Tab
} from "@mui/material";
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

const panelOptionsName = {
    SyntaxInput: "文法定义",
    AnalysingPattern: "分析格局/句子输入",
    AnalysingTable: "LR 分析表"
};

type PanelOption = keyof typeof panelOptionsName;
const panelOptions: PanelOption[] = [
    "SyntaxInput",
    "AnalysingPattern",
    "AnalysingTable"
];

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

    const minWidth900px = useMediaQuery("(min-width:900px)");

    const minWidth900pxLayout = (
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
            {analysisControlWidget}
        </>
    );

    const [currentPanel, setCurrentPanel] =
        useState<PanelOption>("SyntaxInput");

    const maxWidth900pxLayout = (
        <>
            <Drawer anchor="bottom" variant="permanent">
                <Stack height={"40vh"} sx={{ position: "relative" }}>
                    <Box>
                        <Tabs
                            variant="fullWidth"
                            value={currentPanel}
                            onChange={(e, newValue) =>
                                setCurrentPanel(newValue)
                            }>
                            {panelOptions.map(panelOption => (
                                <Tab
                                    value={panelOption}
                                    label={panelOptionsName[panelOption]}
                                />
                            ))}
                        </Tabs>
                    </Box>
                    <Stack sx={{ flex: 1, height: 0 }}>
                        {
                            <Stack
                                display={
                                    currentPanel === "SyntaxInput"
                                        ? "flex"
                                        : "none"
                                }
                                direction="row"
                                sx={{ overflowY: "auto", flex: 1 }}>
                                {leftPanel}
                            </Stack>
                        }
                        {
                            <Stack
                                display={
                                    currentPanel === "AnalysingPattern"
                                        ? "flex"
                                        : "none"
                                }
                                sx={{ flex: 1 }}>
                                {bottomPanel}
                            </Stack>
                        }
                        {
                            <Stack
                                display={
                                    currentPanel === "AnalysingTable"
                                        ? "flex"
                                        : "none"
                                }
                                direction={"row"}
                                sx={{ overflowY: "auto", flex: 1 }}>
                                {rightPanel}
                            </Stack>
                        }
                    </Stack>
                </Stack>
            </Drawer>
            {analysisControlWidget}
        </>
    );

    return <>{minWidth900px ? minWidth900pxLayout : maxWidth900pxLayout}</>;
};
