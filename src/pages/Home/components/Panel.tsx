import React, { useState, useEffect } from "react";
import {
    IconButton,
    Tabs,
    Tab,
    StackProps,
    Checkbox,
    Box,
    Paper,
    Grow
} from "@mui/material";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import CloseIcon from "@mui/icons-material/Close";
import AnalysisTable from "./AnalysisTable";
import SyntaxInputSection from "./SyntaxInputSection";
import SentenceEditor from "./SentenceEditor/SentenceEditor";
import { Sentence } from "./SentenceEditor/SentenceEditor";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { updateInputSentence } from "@/store/reducers/automaton";
import AnalysisPattern from "./AnalysisPattern";
import { Divider } from "@mui/material";
import { showTemporaryToastText } from "../../../store/reducers/toast/toast";
import useMediaQuery from "@mui/material/useMediaQuery";

interface SyntaxInputPanelProps {
    bottomDrawerOpen: boolean;
    setBottomDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

type SyntaxType = "LR0" | "LR1" | "SLR" | "LALR" | "LL";
const syntaxTypeList: SyntaxType[] = ["LR0", "SLR", "LR1", "LALR", "LL"];

export const SyntaxInputPanel = (props: SyntaxInputPanelProps) => {
    const { bottomDrawerOpen, setBottomDrawerOpen } = props;

    const dispatch = useAppDispatch();

    const [syntaxType, setSyntaxType] = useState<SyntaxType | false>("LR0");
    const handleChangeSyntaxType = (newType: SyntaxType) => {
        if (newType === "LR0") {
            setSyntaxType(current => {
                if (current === newType) return false;
                return newType;
            });
        } else {
            dispatch(
                showTemporaryToastText({
                    severity: "warning",
                    message: "功能开发中，敬请期待"
                })
            );
        }
    };

    const minWidth900px = useMediaQuery("(min-width:900px)");

    return (
        <>
            <Stack
                sx={{ boxShadow: 4, zIndex: theme => theme.zIndex.drawer - 2 }}
                justifyContent="space-between">
                <Tabs
                    onChange={(_, newType) => {
                        handleChangeSyntaxType(newType);
                    }}
                    value={syntaxType}
                    orientation="vertical"
                    variant="scrollable">
                    {syntaxTypeList.map(syntaxTypeItem => (
                        <Tab
                            key={syntaxTypeItem}
                            sx={{ height: "7.2rem" }}
                            label={syntaxTypeItem}
                            value={syntaxTypeItem}
                        />
                    ))}
                </Tabs>
                {!bottomDrawerOpen && minWidth900px && (
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
            <Stack
                width={minWidth900px ? "32rem" : "100%"}
                height="100%"
                sx={{ overflowY: "auto" }}>
                <Stack
                    alignItems={"center"}
                    sx={{ flexGrow: 1, overflowY: "auto" }}>
                    <SyntaxInputSection />
                </Stack>
            </Stack>
        </>
    );
};

interface AnalysisTablePanelProps {}

export const AnalysisTablePanel = (props: AnalysisTablePanelProps) => {
    const { automaton } = useAppSelector(state => ({
        automaton: state.automaton.automaton
    }));

    const minWidth900px = useMediaQuery("(min-width:900px)");

    return (
        <Stack width={minWidth900px ? "32rem" : "100%"}>
            <Stack height={"100%"} alignItems="center">
                <AnalysisTable automaton={automaton} />
            </Stack>
        </Stack>
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

    const { inputSentence, currentPattern } = useAppSelector(state => ({
        inputSentence: state.automaton.inputSentence,
        currentPattern: state.automaton.currentPattern
    }));
    const disptach = useAppDispatch();

    const handleChangeSentence = (newValue: Sentence) => {
        disptach(updateInputSentence(newValue));
    };

    const getLastConsumedIndex = () => {
        if (currentPattern === null) return -1;

        return (
            currentPattern.initialSentence.length -
            currentPattern.remainCharacters.length -
            1
        );
    };

    const [analysingStack, setAnalysingStack] = useState<{
        stateStack: number[];
        characterStack: string[];
    }>({
        stateStack: [],
        characterStack: []
    });

    useEffect(() => {
        if (currentPattern === null) {
            setAnalysingStack({
                stateStack: [],
                characterStack: []
            });
        } else {
            setAnalysingStack({
                stateStack: [...currentPattern.stateStack],
                characterStack: [...currentPattern.characterStack]
            });
        }
    }, [currentPattern]);

    const minWidth900px = useMediaQuery("(min-width:900px)");

    return (
        <Stack
            height={minWidth900px ? bottomDrawerHeight : 0}
            sx={{
                position: "relative",
                padding: "3rem",
                "& .AnalysisPatternPanel-pattern-transition-group": {
                    display: "flex",
                    flexDirection: "row"
                },
                flexGrow: minWidth900px ? undefined : 1,
                ...(sx || {})
            }}
            direction="row"
            {...others}>
            <Stack
                direction={"row"}
                sx={{
                    flex: 1,
                    border: theme => `1px solid ${theme.palette.divider}`
                }}>
                <AnalysisPattern
                    stateStack={analysingStack.stateStack}
                    characterStack={analysingStack.characterStack}
                />
                <Divider orientation="vertical" />
                <Stack
                    direction="row"
                    width={"100%"}
                    sx={{
                        flex: 1,
                        width: 0
                    }}>
                    {/* <Typography width={"100%"}> */}
                    <SentenceEditor
                        isLocked={currentPattern !== null}
                        sentence={inputSentence}
                        onSentenceChange={handleChangeSentence}
                        lastConsumedIndex={getLastConsumedIndex()}
                    />
                    {/* </Typography> */}
                </Stack>
            </Stack>
            {minWidth900px && (
                <IconButton
                    onClick={() => setBottomDrawerOpen(false)}
                    sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        transform: "translateX(-50%)"
                    }}>
                    <CloseIcon />
                </IconButton>
            )}
        </Stack>
    );
};
