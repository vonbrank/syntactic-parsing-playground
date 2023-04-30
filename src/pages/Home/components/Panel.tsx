import React, { useState } from "react";
import {
    IconButton,
    Tabs,
    Tab,
    StackProps,
    Checkbox,
    Box,
    Paper
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

interface SyntaxInputPanelProps {
    bottomDrawerOpen: boolean;
    setBottomDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

type SyntaxType = "LR0" | "LR1" | "SLR" | "LALR" | "LL";
const syntaxTypeList: SyntaxType[] = ["LR0", "SLR", "LR1", "LALR", "LL"];

export const SyntaxInputPanel = (props: SyntaxInputPanelProps) => {
    const { bottomDrawerOpen, setBottomDrawerOpen } = props;

    const [syntaxType, setSyntaxType] = useState<SyntaxType | false>("LR0");
    const handleChangeSyntaxType = (newType: SyntaxType) => {
        setSyntaxType(current => {
            if (current === newType) return false;
            return newType;
        });
    };

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
            <Stack width={"32rem"} sx={{ overflowY: "auto" }}>
                <Stack alignItems={"center"} sx={{ flexGrow: 1 }}>
                    <SyntaxInputSection />
                </Stack>
            </Stack>
        </>
    );
};

interface AnalysisTablePanelProps {}

export const AnalysisTablePanel = (props: AnalysisTablePanelProps) => {
    return (
        <Stack width={"32rem"}>
            <Stack height={"100%"} alignItems="center">
                <AnalysisTable />
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
        // console.log("currentPattern = ", currentPattern);
        if (currentPattern === null) return -1;

        return (
            currentPattern.initialSentence.length -
            currentPattern.remainCharacters.length -
            1
        );
    };

    return (
        <Stack
            height={bottomDrawerHeight}
            sx={{ position: "relative", ...(sx || {}) }}
            alignItems={alignItems}
            justifyContent={justifyContent}
            {...others}>
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

            <Stack direction="row">
                {/* <Checkbox
                    onChange={e => setIsLocked(e.currentTarget.checked)}
                /> */}
                <Typography>
                    <SentenceEditor
                        isLocked={currentPattern !== null}
                        sentence={inputSentence}
                        onSentenceChange={handleChangeSentence}
                        lastConsumedIndex={getLastConsumedIndex()}
                    />
                </Typography>
            </Stack>
        </Stack>
    );
};
