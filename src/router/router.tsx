import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";

const customRouter = createBrowserRouter(
    [
        {
            path: "/",
            element: <Home />
        }
    ],
    { basename: "/syntactic-parsing-playground" }
);

export default customRouter;
