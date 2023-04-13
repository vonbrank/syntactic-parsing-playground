import React, { useState } from "react";
import { IconButton, Tabs, Tab, StackProps } from "@mui/material";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import CloseIcon from "@mui/icons-material/Close";

interface SidePanelBaseProps extends StackProps {
    bottomDrawerOpen: boolean;
    setBottomDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
    bottomDrawerHeight: string;
}

const SidePanelBase = (props: SidePanelBaseProps) => {
    const {
        bottomDrawerOpen,
        setBottomDrawerOpen,
        bottomDrawerHeight,
        direction = "row",
        alignItems = "stretch",
        sx,
        children,
        ...others
    } = props;

    return (
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
                              duration: theme.transitions.duration.leavingScreen
                          }),
                marginBottom: bottomDrawerOpen ? `${bottomDrawerHeight}` : 0,
                ...(sx || {})
            }}
            {...others}>
            {children}
        </Stack>
    );
};

interface SyntaxInputPanelProps extends SidePanelBaseProps {}

type SyntaxType = "LR0" | "LR1" | "SLR" | "LALR" | "LL";
const syntaxTypeList: SyntaxType[] = ["LR0", "SLR", "LR1", "LALR", "LL"];

export const SyntaxInputPanel = (props: SyntaxInputPanelProps) => {
    const { bottomDrawerOpen, setBottomDrawerOpen, ...others } = props;

    const [syntaxType, setSyntaxType] = useState<SyntaxType | false>("LR0");
    const handleChangeSyntaxType = (newType: SyntaxType) => {
        setSyntaxType(current => {
            if (current === newType) return false;
            return newType;
        });
    };

    return (
        <SidePanelBase
            bottomDrawerOpen={bottomDrawerOpen}
            setBottomDrawerOpen={setBottomDrawerOpen}
            {...others}>
            <Stack sx={{ boxShadow: 4 }} justifyContent="space-between">
                <Tabs
                    onChange={(_, newType) => {
                        handleChangeSyntaxType(newType);
                    }}
                    value={syntaxType}
                    orientation="vertical"
                    variant="scrollable">
                    {syntaxTypeList.map(syntaxTypeItem => (
                        <Tab
                            sx={{ height: "7.2rem" }}
                            label={syntaxTypeItem}
                            value={syntaxTypeItem}
                        />
                    ))}
                </Tabs>
                {!bottomDrawerOpen && (
                    <Stack alignItems={"center"}>
                        <IconButton
                            onClick={() =>
                                setBottomDrawerOpen(current => !current)
                            }
                            sx={{
                                height: "3.6rem",
                                width: "3.6rem"
                            }}>
                            <KeyboardIcon />
                        </IconButton>
                    </Stack>
                )}
            </Stack>
            <Stack width={"32rem"} padding="2.4rem">
                <Stack
                    height={"100%"}
                    alignItems={"center"}
                    justifyContent="center">
                    <Typography>文法输入区域占位符</Typography>
                </Stack>
            </Stack>
        </SidePanelBase>
    );
};

interface AnalysisTablePanelProps extends SidePanelBaseProps {}

export const AnalysisTablePanel = (props: AnalysisTablePanelProps) => {
    const {
        width = "32rem",
        alignItems = "center",
        justifyContent = "center",
        ...others
    } = props;
    return (
        <SidePanelBase
            width={width}
            alignItems={alignItems}
            justifyContent={justifyContent}
            {...others}>
            <Typography>分析表显示区域占位符</Typography>
        </SidePanelBase>
    );
};

interface AnalysisPatternPanelProps extends StackProps {
    bottomDrawerHeight: string;
    setBottomDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AnalysisPatternPanel = (props: AnalysisPatternPanelProps) => {
    const {
        bottomDrawerHeight,
        setBottomDrawerOpen,
        sx,
        alignItems = "center",
        justifyContent = "center",
        ...others
    } = props;
    return (
        <Stack
            height={bottomDrawerHeight}
            sx={{ position: "relative", ...(sx || {}) }}
            alignItems={alignItems}
            justifyContent={justifyContent}
            {...others}>
            <IconButton
                onClick={() => setBottomDrawerOpen(false)}
                sx={{ position: "absolute", top: 0, right: 0 }}>
                <CloseIcon />
            </IconButton>
            <Typography>输入句子与分析格局区域占位符</Typography>
        </Stack>
    );
};
