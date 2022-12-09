import React, {useState} from "react";
import {Box, Button, TextField, Typography} from "@mui/material";
import {Login as LoginIcon} from "@mui/icons-material";
import axios from "axios";
import {useCookies} from "react-cookie";

const LoginForm: React.FC = () => {
    const [, setCookie] = useCookies(["user"])
    const [username, setUsername] = useState("")
    const [errorMessage, setErrorMessage] = useState<string | undefined>()

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value)
    }

    const handleSignIn = () => {
        if (username && username !== "") {
            axios.get(`/api/users/${username}`)
                .then(response => {
                    if (response.data.user && response.data.user.id === username) {
                        setCookie("user", response.data.user.id, {path: "/"})
                        setErrorMessage(undefined)
                    }
                })
                .catch(() => {
                    setErrorMessage("Invalid user name and (or) password");
                })
        }
    }

    return (
        <Box component="form"
             sx={{
                 '& .MuiTextField-root': {mt: 1, width: "100%"},
                 '& .MuiButton-root': {mt: 1, width: "100%"},
                 p: 2,
             }}>
            <Typography variant="caption">Please sign in</Typography>
            <TextField variant="outlined" size="small" label="Username" value={username}
                       onChange={handleUsernameChange}/>
            <TextField variant="outlined" label="Password" type="password" size="small" disabled/>

            <Button variant="contained" color="primary" endIcon={<LoginIcon/>} onClick={handleSignIn}>Sign In</Button>

            {errorMessage && <Typography mt={1} variant="body2" color="error">
                {errorMessage}
            </Typography>}
        </Box>
    )
}

export default LoginForm;
