import React, {useEffect, useState} from "react";
import PageTitle from "../components/PageTitle";
import {useLoginUser} from "../hooks";
import axios from "axios";
import {apiBaseurl} from "../api/client";
import {deserialize} from "../api/json-api-deserialize";

const CustomerTransactionsView: React.FC = () => {
    const [transactions, setTransactions] = useState<Object[]>([])
    const loginUser = useLoginUser()

    const loadUserInfo = (id: string) => axios.get(`${apiBaseurl()}/users/${id}`)
        .then(response => deserialize(response.data).data)

    const loadTransactions = (user: any) =>
        axios.get(`${apiBaseurl()}/transactions/from=${user.paymentMethodId}&to=${user.payoutMethodId}`)
            .then(response => deserialize(response.data).data as Object[])

    useEffect(() => {
        if (loginUser.id) {
            loadUserInfo(loginUser.id)
                .then(userInfo => loadTransactions(userInfo))
                .then(txs => setTransactions(txs))
                .catch(() => setTransactions([]))
        }
    }, [loginUser])

    return loginUser.id ? (<>
        <PageTitle title="Transactions" username={loginUser.id}/>
        <code>{JSON.stringify(transactions)}</code>
    </>) : null
}

export default CustomerTransactionsView;
