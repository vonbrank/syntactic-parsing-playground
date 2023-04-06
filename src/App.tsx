import React, { useState } from "react";
import locales, { LocaleContext } from "../locales/locales";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { lightTheme, darkTheme } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";

const App: React.FC = () => {
    const [localeIndex, setLocaleIndex] = useState(0);

    return (
        <LocaleContext.Provider value={locales[localeIndex].locale}>
            <ThemeProvider theme={lightTheme}>
                <CssBaseline />
                <RouterProvider router={router} />
            </ThemeProvider>
        </LocaleContext.Provider>
    );
};

export default App;
