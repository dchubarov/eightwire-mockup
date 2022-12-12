import React from "react";
import {LoginUser} from "../../hooks";
import {List, ListItem, ListItemButton, ListItemText, SxProps, Typography} from "@mui/material";
import {Logout as LogoutIcon} from "@mui/icons-material";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import UserCard from "../../components/UserCard";

interface UserMenuProps {
    user: LoginUser
}

const UserMenuItemSxProps: SxProps = {
    pl: 6
}

const UserMenu: React.FC<UserMenuProps> = ({user}) => {
    const [, , removeCookie] = useCookies(["user"])
    const navigate = useNavigate()

    const handleSignOut = () => {
        removeCookie("user")
        navigate("/", {replace: true})
    }

    return (
        <List>
            <ListItem>
                <ListItemButton onClick={() => navigate("/dashboard")}>
                    <UserCard user={user} showVerifiedStatus/>
                </ListItemButton>
            </ListItem>

            <ListItem sx={UserMenuItemSxProps}>
                <ListItemButton  onClick={() => navigate("/profile")}>
                    <ListItemText primary="My Profile"/>
                </ListItemButton>
            </ListItem>

            <ListItem sx={UserMenuItemSxProps}>
                <ListItemButton onClick={handleSignOut}>
                    <ListItemText primary={
                        <Typography component="span" color="error"
                                    sx={{display: "flex", alignItems: "center"}}>
                            Sign Out
                            <LogoutIcon fontSize="small" sx={{ml: 1}}/>
                        </Typography>}/>
                </ListItemButton>
            </ListItem>
        </List>
    )
}

export default UserMenu;
