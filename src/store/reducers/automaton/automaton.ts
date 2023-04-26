import { LR0RawGrammar } from "@/modules/automatons/lr0";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AutomatonState {}

const initialState: AutomatonState = {};

export const automatonSlice = createSlice({
    name: "automaton",
    initialState,
    reducers: {
        generateAutomaton: (state, action: PayloadAction<LR0RawGrammar>) => {}
    }
});

export default automatonSlice.reducer;
