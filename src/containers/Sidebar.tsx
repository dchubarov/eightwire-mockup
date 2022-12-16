import React from "react";
import {Drawer, SxProps} from "@mui/material";
import {grey} from "@mui/material/colors";
import {useLoginUser} from "../hooks";
import LoginForm from "./LoginForm";
import UserMenu from "./UserMenu";
import {Link} from "react-router-dom";

const SidebarWidth = 305

const SidebarSxProps: SxProps = {
    width: SidebarWidth,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
        width: SidebarWidth,
        boxSizing: 'border-box',
        backgroundColor: grey[50]
    },
}

const Sidebar: React.FC = () => {
    const loginUser = useLoginUser()

    return (
        <Drawer anchor="left" variant="permanent" sx={SidebarSxProps}>
            <Link to="/">
                <img src={`${process.env.PUBLIC_URL}/img/logo.png`} width="300" height="80" alt="Logo"/>
            </Link>
            {loginUser.id ? <UserMenu user={loginUser}/> : <LoginForm/>}
        </Drawer>
    );
}

export default Sidebar;
