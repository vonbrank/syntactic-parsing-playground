import React from "react";
import { useAppSelector } from "./store/hooks";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { lightTheme, darkTheme } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { IntlProvider } from "react-intl";

const App: React.FC = () => {
    const currentLocale = useAppSelector(state => state.locale.currentLocale);

    return (
        <IntlProvider messages={currentLocale} locale="en">
            <ThemeProvider theme={lightTheme}>
                <CssBaseline />
                <RouterProvider router={router} />
            </ThemeProvider>
        </IntlProvider>
    );
};

export default App;
