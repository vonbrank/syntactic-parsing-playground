import { LR0RawGrammar } from "@/modules/automatons/lr0";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    LR0Automaton,
    AnalyseLR0Grammar
} from "../../../modules/automatons/lr0/LR0";

interface AutomatonState {
    automaton: LR0Automaton | null;
}

const initialState: AutomatonState = {
    automaton: null,
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
        }
    }
});

export const { generateAutomaton } = automatonSlice.actions;

export default automatonSlice.reducer;
