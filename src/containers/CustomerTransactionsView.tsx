import React, {useEffect, useState} from "react";
import PageTitle from "../components/PageTitle";
import {useLoginUser} from "../hooks";
import axios from "axios";
import {apiBaseurl} from "../api/client";
import {deserialize} from "../api/json-api-deserialize";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";

const CustomerTransactionsView: React.FC = () => {
    const [transactions, setTransactions] = useState<Object[]>([])
    const loginUser = useLoginUser()

    const loadUserInfo = (id: string) => axios.get(`${apiBaseurl()}/users/${id}?include=payIn,payOut`)
        .then(response => deserialize(response.data).data)

    const loadTransactions = (user: any) =>
        axios.get(`${apiBaseurl()}/transactions?from=${user.payIn?.id || ""}&to=${user.payOut?.id || ""}&include=fromAccount.currency,toAccount`)
            .then(response => deserialize(response.data).data as Object[])

    useEffect(() => {
        if (loginUser.id) {
            loadUserInfo(loginUser.id)
                .then(userInfo => loadTransactions(userInfo))
                .then(txs => setTransactions(txs))
                .catch(() => setTransactions([]))
        }
    }, [loginUser.id])

    return loginUser.id ? (<>
        <PageTitle title="Transactions" username={loginUser.id}/>
        {transactions.length === 0 ?
            <Typography><i>There are no transactions.</i></Typography> :
            <TableContainer component={Paper} sx={{mb: 2}}>
                <Table sx={{width: "100%", minWidth: 400}}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Tx#</TableCell>
                            <TableCell>From</TableCell>
                            <TableCell>To</TableCell>
                            <TableCell align="right">Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.map((tx: any, index) =>
                            <TableRow key={`row-${index}`}>
                                <TableCell>{tx.id}</TableCell>
                                <TableCell>{tx.fromAccount.display || tx.fromAccount.id}</TableCell>
                                <TableCell>{tx.toAccount.display || tx.toAccount.id}</TableCell>
                                <TableCell align="right">{`${tx.amount} ${tx.fromAccount.currency.id.toUpperCase()}`}</TableCell>
                            </TableRow>)}
                    </TableBody>
                </Table>
            </TableContainer>}
    </>) : null
}

export default CustomerTransactionsView;
