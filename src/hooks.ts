import {useCookies} from "react-cookie";
import {useEffect, useState} from "react";
import axios from "axios";
import {deserialize} from "./api/json-api-deserialize";
import {apiBaseurl} from "./api/client";

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
            axios.get(`${apiBaseurl()}/users/${cookies.user}?include=region`)
                .then(response => {
                    const userdata = deserialize(response.data).data as any
                    if (userdata) {
                        setLoginUser({
                            id: userdata.id,
                            display: userdata.display,
                            kind: userdata.kind,
                            verified: userdata.verified,
                            region: userdata.region.display || userdata.region.id,
                        })
                    }
                })
                .catch((reason) => {
                    console.warn(reason)
                    setLoginUser({})
                })
        } else {
            setLoginUser({})
        }
    }, [cookies.user])
    return loginUser
}
