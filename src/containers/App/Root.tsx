import React, {useEffect} from "react";
import {Box, CssBaseline} from "@mui/material";
import Sidebar from "./Sidebar";
import {Outlet, useLocation} from "react-router-dom";
import {useLoginUser} from "../../hooks";

const Root: React.FC = () => {
    const loginUser = useLoginUser()
    const location = useLocation()

    useEffect(() => {
        let title = ""

        if (loginUser.id) {
            title = loginUser.id + " – "
        }

        if (location.pathname === "/") {
            title += "Homepage"
        } else {
            const p = location.pathname.substring(1).split("/", 1)
            if (p.length > 0) {
                title += p[0].charAt(0).toUpperCase()
                title += p[0].substring(1)
            }
        }

        document.title = title
    }, [loginUser, location])

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
