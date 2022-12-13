import React, {useEffect, useState} from "react";
import PageTitle from "../components/PageTitle";
import {useLoginUser} from "../hooks";
import axios from "axios";
import {deserialize} from "json-api-deserialize";
import {Button, Typography} from "@mui/material";
import {Add as AddIcon} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";

const OrdersView: React.FC = () => {
    const [orderList, setOrderList] = useState<any>({})
    const loginUser = useLoginUser()
    const navigate = useNavigate()

    useEffect(() => {
        if (loginUser.id) {
            axios.get(`/api/orders?user=${loginUser.id}`)
                .then(response => deserialize(response.data))
                .then(deserialized => setOrderList(deserialized))
                .catch(() => setOrderList({}))
        }
    }, [loginUser])

    return loginUser.id ? (
        <>
            <PageTitle title="Orders" username={loginUser.id}/>

            <Button onClick={() => navigate("new")}
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon/>}
                    sx={{mb: 4}}>Create New</Button>

            <Typography variant="h5">Previous orders</Typography>
            <Typography><i>There are no orders.</i></Typography>

            <code>{JSON.stringify(orderList)}</code>
        </>
    ) : null
}

export default OrdersView;
