import React, {useEffect, useState} from "react";
import {Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useLoginUser} from "../hooks";
import axios from "axios";
import {deserialize} from "json-api-deserialize";

const Profile: React.FC = () => {
    const [profile, setProfile] = useState<any>({})
    const loginUser = useLoginUser()
    const navigate = useNavigate()

    useEffect(() => {
        if (loginUser.id) {
            axios.get(`/api/users/${loginUser.id}?include=region,pay-in.currency,pay-out.currency`)
                .then(response => deserialize(response.data))
                .then(deserialized => setProfile(deserialized.data))
                .catch(() => setProfile({}))
        }
    }, [loginUser, navigate])

    return (
        <>
            <Typography variant="h4">Profile</Typography>

            <Typography variant="h6">Region</Typography>
            {profile.region?.id ?
                <Typography>{profile.region.display || profile.region.id}</Typography> :
                <Typography color="error"><i>Not set.</i></Typography>}

            <Typography variant="h6">Payment methods</Typography>
            {profile.payIn?.id ?
                <Typography>
                    Default payment method: <b>{profile.payIn.display}
                    , {profile.payIn.currency.id.toUpperCase()}</b>
                </Typography> :
                <Typography color="error">
                    <i>No default payment method.</i>
                </Typography>}

            {profile.payOut?.id ?
                <Typography>
                    Default payout method: <b>{profile.payOut.display}
                    , {profile.payOut.currency.id.toUpperCase()}</b>
                </Typography> :
                <Typography color="error">
                    <i>No default payout method.</i>
                </Typography>}

            <Typography variant="h6">Trusted contacts</Typography>

            <code>{JSON.stringify(profile)}</code>
        </>
    )
}

export default Profile;
