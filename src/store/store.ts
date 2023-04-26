import { configureStore } from "@reduxjs/toolkit";
import localeReducer from "./reducers/locale";
import automatonSlice from "./reducers/automaton";

const store = configureStore({
    reducer: {
        locale: localeReducer,
        automaton: automatonSlice
    }
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
