import React from "react";
import {User} from "./server/model";
import {Avatar, Box, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography} from "@mui/material";
import {Logout as LogoutIcon, Person3 as UserIcon, Verified as VerifiedIcon} from "@mui/icons-material";
import {useCookies} from "react-cookie";

interface UserMenuProps {
    user: User
}

const UserMenu: React.FC<UserMenuProps> = ({user}) => {
    const [, , removeCookie] = useCookies(["user"])

    const handleSignOut = () => {
        removeCookie("user")
    }

    return (
        <List>
            <ListItem>
                <ListItemButton component="a" href="dashboard">
                    <ListItemAvatar>
                        <Avatar src={`/img/avatar/${user.id}.png`} variant="circular"
                                sx={theme => {return {border:`1px solid ${theme.palette.divider}`}}}>
                            <UserIcon/>
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={user.display || user.id} secondary={
                        <Box component="span" sx={{display: "flex", alignItems: "center"}}>
                            {user.verified && <VerifiedIcon color="primary" fontSize="small"/>}
                            <Typography sx={{ml: 0.3, textTransform: "capitalize"}} component="span" variant="body2">
                                {user.type}
                            </Typography>
                        </Box>}/>
                </ListItemButton>
            </ListItem>

            <ListItem sx={{pl: 4}}>
                <ListItemButton onClick={handleSignOut}>
                    <ListItemText primary={<Typography component="span" color="error"
                                                       sx={{display: "flex", alignItems: "center"}}>Sign Out <LogoutIcon
                        fontSize="small" sx={{ml: 1}}/></Typography>}/>
                </ListItemButton>
            </ListItem>
        </List>
    )
}

export default UserMenu
