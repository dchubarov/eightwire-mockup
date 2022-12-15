import React from "react";
import {createBrowserRouter, createRoutesFromElements, Route} from "react-router-dom";

import Root from "./App/Root";
import ProfileView from "./ProfileView";
import ReadmeView from "./ReadmeView";
import OrdersView from "./OrdersView";
import NewOrderView from "./NewOrderView";

const AppRouter = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Root/>}>
            <Route path="profile" element={<ProfileView/>}/>
            <Route path="orders" element={<OrdersView/>}/>
            <Route path="orders/new" element={<NewOrderView/>}/>
            <Route path="*" element={<ReadmeView/>}/>
            <Route index element={<ReadmeView/>}/>
        </Route>
    ), {basename: process.env.REACT_APP_UI_ROOT || "/"}
);

export default AppRouter;
