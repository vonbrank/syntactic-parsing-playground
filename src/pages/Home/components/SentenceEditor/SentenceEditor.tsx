import React from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import styles from "./SentenceEditor.module.scss";

interface SentenceEditorProps {
    isLocked: boolean;
    code: string;
    currentIndex: number;
}

const SentenceEditor: React.FC<SentenceEditorProps> = (
    props: SentenceEditorProps
) => {
    return <div className={styles.divCodeEditorWrapper}></div>;
};

export default SentenceEditor;
