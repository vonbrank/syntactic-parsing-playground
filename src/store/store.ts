import { configureStore } from "@reduxjs/toolkit";
import localeReducer from "./reducers/locale";
import automatonSlice from "./reducers/automaton";
import toastSlice from "./reducers/toast";

const store = configureStore({
    reducer: {
        locale: localeReducer,
        automaton: automatonSlice,
        toast: toastSlice
    }
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
