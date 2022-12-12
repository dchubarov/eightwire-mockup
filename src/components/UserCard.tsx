import React from "react";
import {Avatar, Badge, ListItemAvatar, ListItemText} from "@mui/material";
import {Error as UnverifiedIcon, Person as UserIcon, Verified as VerifiedIcon} from "@mui/icons-material";

interface UserCardProps {
    user: any,
    showVerifiedStatus?: boolean
}

const UserAvatar: React.FC<{ id: string }> = ({id}) => (
    <Avatar src={`/img/avatar/${id}.png`} variant="circular">
        <UserIcon/>
    </Avatar>
)

const UserCard: React.FC<UserCardProps> = ({user, showVerifiedStatus}) => {
    return (
        <>
            <ListItemAvatar>
                {showVerifiedStatus ?
                    <Badge overlap="circular" anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                           badgeContent={user.verified ?
                               <VerifiedIcon color="primary"/> :
                               <UnverifiedIcon color="warning"/>}>
                        <UserAvatar id={user.id}/>
                    </Badge> :
                    <UserAvatar id={user.id}/>}
            </ListItemAvatar>

            <ListItemText
                primary={user.display || user.id}
                secondary={typeof user.region === "string" ? user.region : user.region?.display || user.region?.id}/>

        </>
    )
}

export default UserCard;
