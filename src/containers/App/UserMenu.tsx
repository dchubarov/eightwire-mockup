import React from "react";
import {LoginUser} from "../../hooks";
import {
    Avatar,
    Badge,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    SxProps,
    Typography
} from "@mui/material";
import {
    Error as UnverifiedIcon,
    Logout as LogoutIcon,
    Person as UserIcon,
    Verified as VerifiedIcon
} from "@mui/icons-material";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";

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
                    <ListItemAvatar>
                        <Badge overlap="circular" anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                               badgeContent={user.verified ? <VerifiedIcon color="primary"/> :
                                   <UnverifiedIcon color="warning"/>}>
                            <Avatar src={`/img/avatar/${user.id}.png`} variant="circular">
                                <UserIcon/>
                            </Avatar>
                        </Badge>
                    </ListItemAvatar>
                    <ListItemText primary={user.display || user.id} secondary={user.region}/>
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
