import React from "react";
import styles from "./SentenceEditor.module.scss";
import { splitLines } from "@/modules/utils";

interface SentenceEditorProps {
    isLocked: boolean;
    sentence: string;
    lastConsumedIndex: number;
    onSentenceChange: (sentence: string) => void;
}

const SentenceEditor: React.FC<SentenceEditorProps> = (
    props: SentenceEditorProps
) => {
    const sentenceLines = splitLines(props.sentence);

    return (
        <div className={styles.divSentenceEditorWrapper}>
            <div className={styles.divLineNumberWrapper}>
                {sentenceLines.map((_, i) => (
                    <label key={"label" + i} className={styles.lblLineNumber}>
                        {i + 1}
                    </label>
                ))}
            </div>

            <div className={styles.divSentenceWrapper}>
                {props.isLocked ? (
                    <div className={styles.divLockedSentenceWrapper}>
                        {props.sentence
                            .substring(0, props.lastConsumedIndex + 1)
                            .split("")
                            .map((x, i) => (
                                <span
                                    key={`consumed${i}`}
                                    className={styles.spanConsumedChar}>
                                    {x}
                                </span>
                            ))}
                        {props.sentence
                            .substring(props.lastConsumedIndex + 1)
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
                        value={props.sentence}
                        onChange={e =>
                            props.onSentenceChange(e.currentTarget.value)
                        }
                    />
                )}
            </div>
        </div>
    );
};

export default SentenceEditor;
