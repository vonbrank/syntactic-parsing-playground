import React, { useRef, useState, useEffect } from "react";
import styles from "./SentenceEditor.module.scss";
import { splitLines } from "@/modules/utils";
import { alpha, Box } from "@mui/material";
import { sleep } from "@/utils";

export interface Sentence {
    data: string;
    selectionStart: number;
    selectionEnd: number;
}

interface SentenceEditorProps {
    isLocked: boolean;
    sentence: Sentence;
    lastConsumedIndex: number;
    onSentenceChange: (sentence: Sentence) => void;
}

const SentenceEditor: React.FC<SentenceEditorProps> = (
    props: SentenceEditorProps
) => {
    const { isLocked, sentence, lastConsumedIndex, onSentenceChange } = props;

    const [sentenceLines, setSentenceLines] = useState(
        splitLines(sentence.data)
    );
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        setSentenceLines(splitLines(sentence.data));
        const currentTextAreaRef = textAreaRef.current;

        if (currentTextAreaRef !== null) {
            currentTextAreaRef.selectionStart = sentence.selectionStart;
            currentTextAreaRef.selectionEnd = sentence.selectionEnd;
        }
    }, [sentence]);

    const handlePressTab = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Tab") {
            e.preventDefault();

            const currentTextAreaRef = textAreaRef.current;
            if (currentTextAreaRef === null) return;

            const start = currentTextAreaRef.selectionStart;
            const end = currentTextAreaRef.selectionEnd;
            const sentenceData = sentence.data;

            const newSentenceData = `${sentenceData.substring(
                0,
                start
            )}${" ".repeat(4)}${sentenceData.substring(end)}`;
            const newSelectionStart = start + 4;
            onSentenceChange({
                data: newSentenceData,
                selectionStart: newSelectionStart,
                selectionEnd: newSelectionStart
            });
        }
        // else if (e.key === "Backspace") {
        //     const currentTextAreaRef = textAreaRef.current;
        //     if (currentTextAreaRef === null) return;

        //     const sentenceData = sentence.data;

        //     const startPosBefore = currentTextAreaRef.selectionStart + 1;
        //     const endPosBefore = currentTextAreaRef.selectionEnd + 1;

        //     if (startPosBefore !== endPosBefore) {
        //         let startPosAfter = 0;

        //         if ((endPosBefore + 1) % 4 === 0) {
        //             startPosAfter = endPosBefore - 4 - 1;
        //         } else {
        //             startPosAfter = endPosBefore - (endPosBefore % 4) - 1;
        //         }
        //         const newSentenceData = `${sentenceData.substring(
        //             0,
        //             startPosAfter
        //         )}${sentenceData.substring(endPosBefore)}`;

        //         console.log("startPosBefore = ", startPosBefore);
        //         console.log("endPosBefore = ", endPosBefore);
        //         console.log("startPosAfter = ", startPosAfter);
        //         console.log("newSentenceData = ", newSentenceData);

        //         // onSentenceChange({
        //         //     data: newSentenceData,
        //         //     selectionStart: startPosAfter,
        //         //     selectionEnd: startPosAfter
        //         // });
        //     }
        // }
    };

    const handleTextAreaChange = (newValue: string) => {
        const currentTextAreaRef = textAreaRef.current;

        if (currentTextAreaRef === null) return;

        onSentenceChange({
            data: newValue,
            selectionStart: currentTextAreaRef.selectionStart,
            selectionEnd: currentTextAreaRef.selectionEnd
        });
    };

    return (
        <Box className={styles.divSentenceEditorWrapper}>
            <Box className={styles.divLineNumberWrapper}>
                {sentenceLines.map((_, i) => (
                    <label key={"label" + i} className={styles.lblLineNumber}>
                        {i + 1}
                    </label>
                ))}
            </Box>

            <div className={styles.divSentenceWrapper}>
                {isLocked ? (
                    <div className={styles.divLockedSentenceWrapper}>
                        {sentence.data
                            .substring(0, lastConsumedIndex + 1)
                            .split("")
                            .map((x, i) => (
                                <span
                                    key={`consumed${i}`}
                                    className={styles.spanConsumedChar}>
                                    {x}
                                </span>
                            ))}
                        {sentence.data
                            .substring(lastConsumedIndex + 1)
                            .split("")
                            .map((x, i) => (
                                <span
                                    key={`unconsumed${i}`}
                                    className={styles.spanUnconsumedChar}>
                                    {x}
                                </span>
                            ))}
                    </div>
                ) : (
                    <textarea
                        // line-height*lineCount
                        style={{
                            height: `${20 * sentenceLines.length}px`
                        }}
                        spellCheck={false}
                        className={styles.taSentence}
                        value={sentence.data}
                        onChange={e =>
                            handleTextAreaChange(e.currentTarget.value)
                        }
                        onKeyDown={handlePressTab}
                        ref={textAreaRef}
                    />
                )}
            </div>
        </Box>
    );
};

export default SentenceEditor;
