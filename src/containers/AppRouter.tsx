import React from "react";
import {createBrowserRouter, createRoutesFromElements, Route} from "react-router-dom";

import Root from "./Root";
import ProfileView from "./ProfileView";
import ReadmeView from "./ReadmeView";
import CustomerOrdersView from "./CustomerOrdersView";
import NewOrderView from "./NewOrderView";
import CustomerTransactionsView from "./CustomerTransactionsView";

const AppRouter = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Root/>}>
            <Route path="profile" element={<ProfileView/>}/>
            <Route path="customer/orders" element={<CustomerOrdersView/>}/>
            <Route path="customer/orders/new" element={<NewOrderView/>}/>
            <Route path="customer/transactions" element={<CustomerTransactionsView/>}/>
            <Route path="*" element={<ReadmeView/>}/>
            <Route index element={<ReadmeView/>}/>
        </Route>
    ), {basename: process.env.REACT_APP_UI_ROOT || "/"}
);

export default AppRouter;
