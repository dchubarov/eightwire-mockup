import React from "react";
import {createBrowserRouter, createRoutesFromElements, Route} from "react-router-dom";

import Root from "./App/Root";
import Profile from "./Profile";
import Readme from "./Readme";

const AppRouter = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Root/>}>
            <Route path="profile" element={<Profile/>}/>
            <Route path="*" element={<Readme/>}/>
            <Route index element={<Readme/>}/>
        </Route>
    )
);

export default AppRouter;
