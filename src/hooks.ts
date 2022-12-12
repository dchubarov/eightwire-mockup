import {useCookies} from "react-cookie";
import {useEffect, useState} from "react";
import axios from "axios";
import {deserialize} from "json-api-deserialize";

export interface LoginUser {
    id?: string,
    display?: string,
    kind?: string,
    verified?: boolean
    region?: string
}

export function useLoginUser(): LoginUser {
    const [loginUser, setLoginUser] = useState<LoginUser>({})
    const [cookies] = useCookies(["user"])
    useEffect(() => {
        if (cookies.user) {
            axios.get(`/api/users/${cookies.user}?include=region`)
                .then(response => {
                    const userdata = deserialize(response.data)
                    setLoginUser({
                        id: userdata.data.id,
                        display: userdata.data.display,
                        kind: userdata.data.kind,
                        verified: userdata.data.verified,
                        region: userdata.data.region.display || userdata.data.region.id
                    })
                })
                .catch(() => setLoginUser({}))
        } else {
            setLoginUser({})
        }
    }, [cookies.user])
    return loginUser
}
