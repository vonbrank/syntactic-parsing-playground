import React, { useState } from "react";
import locales, { LocaleContext } from "../locales/locales";
import { RouterProvider } from "react-router-dom";
import router from "./router";

const App: React.FC = () => {
    const [localeIndex, setLocaleIndex] = useState(0);

    return (
        <LocaleContext.Provider value={locales[localeIndex].locale}>
            <RouterProvider router={router} />
        </LocaleContext.Provider>
    );
};

export default App;
