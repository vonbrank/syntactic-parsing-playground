import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import { getBaseUrlByHostname } from "../../config";

const customRouter = createBrowserRouter(
    [
        {
            path: "/",
            element: <Home />
        }
    ],
    { basename: getBaseUrlByHostname(window.location.hostname) }
);

export default customRouter;
