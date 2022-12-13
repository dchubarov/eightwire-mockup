import React, {FormEvent, useState} from "react";
import {Box, Button, SxProps, TextField, Typography} from "@mui/material";
import {Login as LoginIcon} from "@mui/icons-material";
import axios from "axios";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";

const FormSxProps: SxProps = {
    p: 2,
    '& .MuiTextField-root': {mt: 1, width: "100%"},
    '& .MuiButton-root': {mt: 1, width: "100%"},
}

const LoginForm: React.FC = () => {
    const [errorMsg, setErrorMsg] = useState<string | undefined>()
    const [username, setUsername] = useState("")
    const [, setCookie] = useCookies(["user"])
    const navigate = useNavigate()

    const handleSignIn = (e: FormEvent<HTMLFormElement>) => {

        axios.get(`/api/users/${username}`)
            .then(response => {
                setCookie("user", response.data.data.id, {path: "/"})
                setErrorMsg(undefined)
                navigate("/profile")
            })
            .catch(() => {
                setErrorMsg("Invalid user name or password")
            })

        e.preventDefault()
    }

    return (
        <Box component="form" onSubmit={handleSignIn} sx={FormSxProps}>
            <Typography>Please sign in</Typography>

            <TextField id="username"
                       label="Username"
                       value={username}
                       onChange={e => setUsername(e.target.value)}
                       variant="outlined"
                       size="small"
                       fullWidth/>

            <TextField id="password"
                       type="password"
                       label="Password"
                       variant="outlined"
                       size="small"
                       fullWidth
                       disabled/>

            {errorMsg && <Typography variant="body2" color="error">{errorMsg}</Typography>}

            <Button type="submit"
                    variant="contained"
                    color="primary"
                    endIcon={<LoginIcon/>}
                    disabled={username === ""}>Sign In</Button>
        </Box>
    )
}

export default LoginForm;
