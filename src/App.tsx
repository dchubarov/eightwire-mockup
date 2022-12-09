import React, {useEffect, useState} from 'react';
import {useCookies} from "react-cookie";
import axios from "axios";

import {Box, CssBaseline, Drawer, Typography} from "@mui/material";
import {grey} from "@mui/material/colors";

import {HealthResponse, User} from "./server/model";
import UserMenu from "./UserMenu";
import LoginForm from "./LoginForm";

const App: React.FC = () => {
    const [serverHealth, setServerHealth] = useState<HealthResponse>({status: "OK"})
    const [userInfo, setUserInfo] = useState<User | undefined>()
    const [cookies] = useCookies(["user"])

    useEffect(() => {
        axios.get<HealthResponse>("/api/health")
            .then(response => setServerHealth(response.data))
            .catch(() => setServerHealth({status: "FAIL"}))
    }, [])

    useEffect(() => {
        if (cookies.user && cookies.user !== "") {
            axios.get(`/api/users/${cookies.user}`)
                .then(response => setUserInfo(response.data.user))
                .catch(() => setServerHealth({status: "FAIL"}))
        } else {
            setUserInfo(undefined)
        }
    }, [cookies.user])

    return (
        <Box sx={{display: "flex"}}>
            <CssBaseline/>

            <Drawer variant="permanent" anchor="left" sx={{
                width: 305,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: 305,
                    boxSizing: 'border-box',
                    backgroundColor: grey[50]
                },
            }}>
                <img src="/logo.png" width="300" height="80" alt="Logo"/>

                {userInfo && <UserMenu user={userInfo}/>}

                {(cookies.user === undefined || serverHealth.status !== "OK") && <LoginForm/>}

                <Box sx={{position: "absolute", right: 0, bottom: 0, p: 1}}>
                    <Typography variant="body2" color="text.secondary">
                        {`Server status: ${serverHealth.status} (v.${serverHealth.version})`}
                    </Typography>
                </Box>
            </Drawer>

            <Box m={2}>
                <Typography variant="h3">Profile</Typography>
                <Typography>Page content</Typography>
            </Box>
        </Box>
    );
}

export default App;
