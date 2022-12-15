import React, {useEffect, useState} from "react";
import {useLoginUser} from "../hooks";
import PageTitle from "../components/PageTitle";
import axios from "axios";
import {apiBaseurl} from "../api/client";
import {deserialize} from "../api/json-api-deserialize";
import {
    Box,
    Button, Checkbox, FormControlLabel,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";

const MasterOrdersView: React.FC = () => {
    const [orders, setOrders] = useState<Object[]>([])
    const [selectedOrders, setSelectedOrders] = useState<string[]>([])
    const [reconcileStatus, setReconcileStatus] = useState<string | undefined>()
    const loginUser = useLoginUser()

    const reloadOrders = () => {
        axios.get(`${apiBaseurl()}/orders?status=pending,completed&include=payer.region,payee.region,payerMethod.currency,payeeMethod.currency`)
            .then(response => deserialize(response.data).data as Object[])
            .then(data => setOrders(data))
            .catch(() => setOrders([]))
            .finally(() => setSelectedOrders([]))
    }

    const toggleOrderSelection = (id: string) => {
        setSelectedOrders(prev => {
            if (prev.includes(id))
                return prev.filter(x => x !== id)
            else {
                return [...prev, id]
            }
        })
    }

    const handleRefresh = () => {
        setReconcileStatus(undefined)
        reloadOrders()
    }

    const handleReconcile = () => {
        axios.get(`${apiBaseurl()}/orders/reconcile?ids=${selectedOrders.join(",")}`)
            .then(response => setReconcileStatus(response.data.statusMsg))
            .finally(() => reloadOrders())
    }

    useEffect(() => {
        if (loginUser.kind === "master") {
            reloadOrders()
        }
    }, [loginUser])

    return loginUser.id && loginUser.kind === "master" ? (
        <>
            <PageTitle title="Order reconciliation" username={loginUser.id}/>
            <Box sx={{display: "flex", alignItems: "center"}}>
                <Button onClick={handleRefresh} variant="contained">Refresh</Button>

                {orders.length > 0 && <Button
                    onClick={handleReconcile}
                    disabled={selectedOrders.length < 2}
                    variant="contained"
                    sx={{ml: 1}}>Try Reconcile</Button>}

                <Typography sx={{ml: 1}} color={reconcileStatus?.startsWith("OK") ? "default" : "error"}>
                    {reconcileStatus}
                </Typography>
            </Box>

            {orders.length > 0 &&
                <TableContainer component={Paper} sx={{mb: 2}}>
                    <Table sx={{width: "100%", minWidth: 400}}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Order#</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Payer</TableCell>
                                <TableCell align="right">Payment amount</TableCell>
                                <TableCell>Payee</TableCell>
                                <TableCell align="right">Payout amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((item: any, index) =>
                                <TableRow key={`item-${index}`}>
                                    <TableCell><FormControlLabel control={<Checkbox disabled={item.status !== "pending"} checked={selectedOrders.includes(item.id)} onChange={()=>toggleOrderSelection(item.id)}/>} label={item.id}/></TableCell>
                                    <TableCell>{item.status.toUpperCase()}</TableCell>
                                    <TableCell>{`${item.payer.display || item.payer.id} (${item.payer.region.display || item.payer.region.id.toUpperCase()})`}</TableCell>
                                    <TableCell align="right">{`${item.paymentAmount} ${item.payerMethod.currency.id.toUpperCase()}`}</TableCell>
                                    <TableCell>{`${item.payee.display || item.payee.id} (${item.payee.region.display || item.payee.region.id.toUpperCase()})`}</TableCell>
                                    <TableCell align="right">{`${item.payoutAmount} ${item.payeeMethod.currency.id.toUpperCase()}`}</TableCell>
                                </TableRow>)}
                        </TableBody>
                    </Table>
                </TableContainer>}
        </>
    ) : null;
}

export default MasterOrdersView;
