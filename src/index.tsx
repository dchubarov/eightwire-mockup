import React from 'react';
import ReactDOM from 'react-dom/client';
import {CookiesProvider} from "react-cookie";
import {RouterProvider} from "react-router-dom";

import AppRouter from "./containers/AppRouter";
import {makeApiServer} from "./api/server";
import reportWebVitals from './reportWebVitals';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import './index.css';

makeApiServer(process.env.NODE_ENV)

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <CookiesProvider>
            <RouterProvider router={AppRouter}/>
        </CookiesProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
