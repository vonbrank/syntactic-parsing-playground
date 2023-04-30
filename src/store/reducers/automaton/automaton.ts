import { LR0RawGrammar } from "@/modules/automatons/lr0";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    LR0AnalysingPattern,
    ReduceLR0AnalysingPattern
} from "../../../modules/automatons/lr0/LR0";
import { Sentence } from "../../../pages/Home/components/SentenceEditor/SentenceEditor";
import {
    LR0Automaton,
    AnalyseLR0Grammar
} from "../../../modules/automatons/lr0/LR0";
import { UpdateAnalysingPatternOption } from "@/pages/Home/components/Widget";

interface AutomatonState {
    automaton: LR0Automaton | null;
    currentPattern: LR0AnalysingPattern | null;
    inputSentence: Sentence;
}

const initialState: AutomatonState = {
    automaton: null,
    currentPattern: null,
    inputSentence: {
        data: "",
        selectionStart: 0,
        selectionEnd: 0
    }
};

export const automatonSlice = createSlice({
    name: "automaton",
    initialState,
    reducers: {
        generateAutomaton: (state, action: PayloadAction<LR0RawGrammar>) => {
            const grammar = action.payload;
            state.automaton = AnalyseLR0Grammar(grammar);
        },
        disposeAutomaton: state => {
            state.automaton = null;
            state.currentPattern = null;
        },
        startAnalysingSentence: state => {
            const sentenceStr = state.inputSentence.data;
            state.currentPattern = {
                currentStepIndex: 0,
                stateStack: [0],
                characterStack: ["$"],
                remainCharacters: [...sentenceStr],
                initialSentence: sentenceStr
            };
        },
        stopAnalysingSentence: state => {
            state.currentPattern = null;
        },
        updateInputSentence: (state, action: PayloadAction<Sentence>) => {
            state.inputSentence = action.payload;
        },
        updateAnalysingPattern: (
            state,
            action: PayloadAction<UpdateAnalysingPatternOption>
        ) => {
            const option = action.payload;
            const { currentPattern, automaton } = state;

            switch (option) {
                case "NEXT":
                    if (currentPattern !== null && automaton !== null) {
                        const newPattern = ReduceLR0AnalysingPattern(
                            currentPattern,
                            automaton,
                            1
                        );
                        state.currentPattern = newPattern;
                    }
                    break;
                default:
            }
        }
    }
});

export const {
    generateAutomaton,
    updateInputSentence,
    startAnalysingSentence,
    stopAnalysingSentence,
    updateAnalysingPattern,
    disposeAutomaton
} = automatonSlice.actions;

export default automatonSlice.reducer;
