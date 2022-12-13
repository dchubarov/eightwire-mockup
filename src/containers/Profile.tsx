import React, {useEffect, useState} from "react";
import {List, ListItem, ListItemIcon, ListItemText, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useLoginUser} from "../hooks";
import axios from "axios";
import {deserialize} from "json-api-deserialize";
import {
    AccountBalanceWallet as PayOutIcon,
    AccountBalanceWalletOutlined as PaymentIcon,
    Badge as NameIcon,
    Language as RegionIcon,
    PeopleAlt as ContactsIcon,
    Verified as VerifiedIcon,
} from "@mui/icons-material";
import UserCard from "../components/UserCard";

const Profile: React.FC = () => {
    const [profile, setProfile] = useState<any>({})
    const loginUser = useLoginUser()
    const navigate = useNavigate()

    useEffect(() => {
        if (loginUser.id) {
            axios.get(`/api/users/${loginUser.id}?include=region,pay-in.currency,pay-out.currency,trusted.region`)
                .then(response => deserialize(response.data))
                .then(deserialized => setProfile(deserialized.data))
                .catch(() => setProfile({}))
        }
    }, [loginUser, navigate])

    return profile.id ? (
        <>
            <Typography variant="h4">Profile: {profile.id}</Typography>

            <List>
                <ListItem>
                    <ListItemIcon>
                        <NameIcon/>
                    </ListItemIcon>
                    <ListItemText
                        primary="Full name"
                        secondary={profile.display || <i>Not set</i>}/>
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <VerifiedIcon/>
                    </ListItemIcon>
                    <ListItemText
                        primary="Verification"
                        secondary={profile.verified ? "Passed" : "Pending"}/>
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <RegionIcon/>
                    </ListItemIcon>
                    <ListItemText
                        primary="Region"
                        secondary={profile.region.id ?
                            profile.region.display || profile.region.id.toUpperCase() :
                            <i>Not set</i>}/>
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <PaymentIcon/>
                    </ListItemIcon>
                    <ListItemText
                        primary="Default payment method"
                        secondary={profile.payIn.id ?
                            `${profile.payIn.display} (${profile.payIn.currency.id.toUpperCase()})` :
                            <i>Not set</i>}/>
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <PayOutIcon/>
                    </ListItemIcon>
                    <ListItemText
                        primary="Default payout method"
                        secondary={profile.payOut.id ?
                            `${profile.payOut.display} (${profile.payOut.currency.id.toUpperCase()})` :
                            <i>Not set</i>}/>
                </ListItem>

                <ListItem>
                    <ListItemIcon>
                        <ContactsIcon/>
                    </ListItemIcon>
                    <ListItemText
                        primary="Trusted users"
                        secondary={`${profile.trusted.length} contact(s)`}/>
                </ListItem>

                {profile.trusted.length > 0 &&
                    <List disablePadding>
                        {profile.trusted.map((item: any, index: number) =>
                            <ListItem sx={{pl: 8}} key={`tc-${index}`}>
                                <UserCard user={item}/>
                            </ListItem>)}
                    </List>}
            </List>
        </>
    ) : null
}

export default Profile;
