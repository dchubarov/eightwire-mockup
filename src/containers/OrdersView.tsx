import React, {useEffect, useState} from "react";
import PageTitle from "../components/PageTitle";
import {useLoginUser} from "../hooks";
import axios from "axios";
import {deserialize} from "../api/json-api-deserialize";
import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {Add as AddIcon} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {apiBaseurl} from "../api/client";

const OrdersView: React.FC = () => {
    const [outgoingOrders, setOutgoingOrders] = useState<Object[]>([])
    const [incomingOrders, setIncomingOrders] = useState<Object[]>([])
    const loginUser = useLoginUser()
    const navigate = useNavigate()

    useEffect(() => {
        if (loginUser.id) {
            axios.get(`${apiBaseurl()}/orders?payer=${loginUser.id}&status=pending,completed&include=payer-method.currency,payee-method.currency,payee.region`)
                .then(response => deserialize(response.data).data as Object[])
                .then(deserialized => setOutgoingOrders(deserialized))
                .catch(() => setOutgoingOrders([]))

            axios.get(`${apiBaseurl()}/orders?payee=${loginUser.id}&status=pending,completed&include=payee-method.currency,payer-method.currency,payer.region`)
                .then(response => deserialize(response.data).data as Object[])
                .then(deserialized => setIncomingOrders(deserialized))
                .catch(() => setIncomingOrders([]))
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

            <Typography variant="h5">Outgoing transfers</Typography>
            {outgoingOrders.length === 0 ?
                <Typography><i>There are no orders.</i></Typography> :
                <TableContainer component={Paper} sx={{mb: 2}}>
                    <Table sx={{width: "100%", minWidth: 400}}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Order#</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Payer</TableCell>
                                <TableCell>Payment method</TableCell>
                                <TableCell align="right">Amount</TableCell>
                                <TableCell>Payee region</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {outgoingOrders.map((order: any, index) =>
                                <TableRow key={`row-${index}`} sx={{"&:last-child td, &:last-child th": {border: 0}}}>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>{(order.status || "unknown!").toUpperCase()}</TableCell>
                                    <TableCell>{order.payer?.display || order.payer?.id}</TableCell>
                                    <TableCell>{order.payerMethod?.display}</TableCell>
                                    <TableCell align="right">{`${order.paymentAmount} ${order.payerMethod?.currency?.id.toUpperCase()}`}</TableCell>
                                    <TableCell>{`${order.payee?.region?.display || (order.payee?.region?.id || "").toUpperCase()}`}</TableCell>
                                </TableRow>)}
                        </TableBody>
                    </Table>
                </TableContainer>}

            <Typography variant="h5">Incoming transfers</Typography>
            {incomingOrders.length === 0 ?
                <Typography><i>There are no orders.</i></Typography> :
                <TableContainer component={Paper} sx={{mb: 2}}>
                    <Table sx={{width: "100%", minWidth: 400}}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Order#</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Payer</TableCell>
                                <TableCell>Payer region</TableCell>
                                <TableCell align="right">Amount</TableCell>
                                <TableCell>Payout method</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {incomingOrders.map((order: any, index) =>
                                <TableRow key={`row-${index}`} sx={{"&:last-child td, &:last-child th": {border: 0}}}>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>{(order.status || "unknown!").toUpperCase()}</TableCell>
                                    <TableCell>{order.payer?.display || order.payer?.id}</TableCell>
                                    <TableCell>{`${order.payer?.region?.display || (order.payer?.region?.id || "").toUpperCase()}`}</TableCell>
                                    <TableCell align="right">{`${order.payoutAmount} ${order.payeeMethod?.currency?.id.toUpperCase()}`}</TableCell>
                                    <TableCell>{order.payeeMethod?.display}</TableCell>
                                </TableRow>)}
                        </TableBody>
                    </Table>
                </TableContainer>}
        </>
    ) : null
}

export default OrdersView;
