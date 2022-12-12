import React from "react";
import {Box, CssBaseline} from "@mui/material";
import Sidebar from "./Sidebar";
import {Outlet} from "react-router-dom";

const Root: React.FC = () => {
    return (
        <Box sx={{display: "flex"}}>
            <CssBaseline/>
            <Sidebar/>
            <Box sx={{flexGrow: 1, p: 1}}>
                <Outlet/>
            </Box>
        </Box>
    )
}

export default Root;
