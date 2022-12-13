import React, {useEffect, useState} from "react";
import {useLoginUser} from "../hooks";
import PageTitle from "../components/PageTitle";
import {InputAdornment, List, ListItem, ListItemIcon, ListItemText, MenuItem, Select, TextField} from "@mui/material";
import {Filter1 as NumberOneIcon, Filter2 as NumberTwoIcon, Filter3 as NumberThreeIcon} from "@mui/icons-material";
import axios from "axios";
import {deserialize} from "json-api-deserialize";

const NewOrderView: React.FC = () => {
    const [payerData, setPayerData] = useState<any>({})
    const [recipient, setRecipient] = useState("")
    const [amount, setAmount] = useState(100)
    const loginUser = useLoginUser()

    useEffect(() => {
        if (loginUser.id) {
            axios.get(`/api/users/${loginUser.id}?include=pay-in.currency,trusted`)
                .then(response => setPayerData(deserialize(response.data).data))
                .catch(() => setPayerData({}))
        }
    }, [loginUser])

    return loginUser.id ? (
        <>
            <PageTitle title="New order" username={loginUser.id}/>
            {payerData.id && <List>
                <ListItem>
                    <ListItemIcon>
                        <NumberOneIcon/>
                    </ListItemIcon>
                    <ListItemText
                        primary="Select payment method"
                        secondary={`${payerData.payIn.display}`}/>
                </ListItem>

                <ListItem>
                    <ListItemIcon>
                        <NumberTwoIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Select recipient"
                                  secondary={`You have ${payerData.trusted.length} contact(s)`}/>
                </ListItem>

                <ListItem sx={{pl: 8}}>
                    <Select value={recipient} onChange={e => setRecipient(e.target.value)} sx={{width: 200}}>
                        {payerData.trusted.map((item: any, index: number) =>
                            <MenuItem key={`item-${index}`} value={item.id}>{item.display || item.id}</MenuItem>)}
                    </Select>
                </ListItem>

                <ListItem>
                    <ListItemIcon>
                        <NumberThreeIcon/>
                    </ListItemIcon>
                    <ListItemText
                        primary="Enter amount"
                        secondary={`${payerData.payIn.currency.display || payerData.payIn.currency.id.toUpperCase()}`}/>
                </ListItem>

                <ListItem sx={{pl: 8}}>
                    <TextField type="number"
                               value={amount}
                               onChange={e => setAmount(Number(e.target.value))}
                               sx={{width: 200}}
                               InputProps={{
                                   startAdornment: <InputAdornment position="start">
                                       {payerData.payIn.currency.symbol || payerData.payIn.currency.id.toUpperCase()}
                                   </InputAdornment>
                               }}/>
                </ListItem>
            </List>}

        </>
    ) : null;
}

export default NewOrderView;
