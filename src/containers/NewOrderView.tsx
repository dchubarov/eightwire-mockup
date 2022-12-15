import React, {useEffect, useState} from "react";
import {useLoginUser} from "../hooks";
import PageTitle from "../components/PageTitle";
import {
    Button, Checkbox, FormControlLabel, FormGroup, Grid,
    InputAdornment,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Select,
    TextField, Typography
} from "@mui/material";
import {
    Filter1 as NumberOneIcon,
    Filter2 as NumberTwoIcon,
    Filter3 as NumberThreeIcon,
    NavigateNext as NextStepIcon,
} from "@mui/icons-material";
import axios from "axios";
import {deserialize} from "../api/json-api-deserialize";
import {useNavigate} from "react-router-dom";
import {apiBaseurl} from "../api/client";

const NewOrderView: React.FC = () => {
    const [payerData, setPayerData] = useState<any>({})
    const [orderDraft, setOrderDraft] = useState<any>({})
    const [consent1, setConsent1] = useState(false)
    const [consent2, setConsent2] = useState(false)
    const [payeeId, setPayeeId] = useState("")
    const [amount, setAmount] = useState(100)
    const loginUser = useLoginUser()
    const navigate = useNavigate()

    useEffect(() => {
        if (loginUser.id) {
            axios.get(`${apiBaseurl()}/users/${loginUser.id}?include=pay-in.currency,trusted`)
                .then(response => setPayerData(deserialize(response.data).data))
                .catch(() => setPayerData({}))
        }
    }, [loginUser])

    const handleCreateDraft = () => {
        const req = {
            payer: payerData.id,
            payee: payeeId,
            amount: amount
        }

        axios.post(`${apiBaseurl()}/orders?include=payer-method.currency,payee-method.currency`, req)
            .then(response => setOrderDraft(deserialize(response.data).data))
            .catch(() => setOrderDraft({}))
    }

    const handlePlaceOrder = () => {
        axios.get(`${apiBaseurl()}/orders/${orderDraft.id}/approve`)
            .then(() => navigate("/orders"))
            .catch(() => orderDraft.statusMsg = "Could not place order")
    }

    const handleCancelOrder = () => {
        axios.delete(`${apiBaseurl()}/orders/${orderDraft.id}`)
            .finally(() => setOrderDraft({}))
    }

    return loginUser.id ? (
        <>
            <PageTitle title={["Orders", orderDraft.id ? `#${orderDraft.id}` : "New"]} username={loginUser.id}/>

            {(orderDraft.status !== "created" && payerData.id) && <List>
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
                    <Select value={payeeId} onChange={e => setPayeeId(e.target.value)} sx={{width: 200}}>
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

                {orderDraft.status === "rejected" && <ListItem sx={{pl: 8, color: "red"}}>
                    <ListItemText primary="Your order has been rejected"
                                  secondary={orderDraft.statusMsg}/>
                </ListItem>}

                <ListItem sx={{pl: 8}}>
                    <Button
                        onClick={handleCreateDraft}
                        disabled={payeeId === "" || isNaN(amount) || amount <= 0}
                        variant="contained"
                        endIcon={<NextStepIcon/>}
                        sx={{mt: 2}}>Save & Review</Button>
                </ListItem>
            </List>}

            {orderDraft.status === "created" && <Grid spacing={1} container>
                <Grid item xs={8}>You pay:</Grid>
                <Grid item xs textAlign="right">
                    {`${orderDraft.paymentAmount} ${orderDraft.payerMethod.currency.id.toUpperCase()}`}
                </Grid>

                {orderDraft.paymentServiceFee !== 0 && <>
                    <Grid item xs={8}>Including service fee:</Grid>
                    <Grid item xs={4} textAlign="right">
                        {`${orderDraft.paymentServiceFee} ${orderDraft.payerMethod.currency.id.toUpperCase()}`}
                    </Grid>
                </>}

                {orderDraft.paymentFee !== 0 && <>
                    <Grid item xs={8}>Including transaction fee:</Grid>
                    <Grid item xs={4} textAlign="right">
                        {`${orderDraft.paymentFee} ${orderDraft.payerMethod.currency.id.toUpperCase()}`}
                    </Grid>
                </>}

                <Grid item xs={8}>Your correspondent will receive:</Grid>
                <Grid item xs={4} textAlign="right">
                    {`${orderDraft.payoutAmount - orderDraft.payoutFee} ${orderDraft.payeeMethod.currency?.id.toUpperCase()}`}
                </Grid>

                {orderDraft.payoutFee !== 0 && <>
                    <Grid item xs={8}>Deducted transaction fee:</Grid>
                    <Grid item xs={4} textAlign="right">
                        {`${orderDraft.payoutFee} ${orderDraft.payeeMethod.currency.id.toUpperCase()}`}
                    </Grid>
                </>}

                <Grid item xs={12}>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox value={consent1} onChange={e=>setConsent1(e.target.checked)}/>}
                                          label={<Typography variant="body2">I understand that my account will be charged as I place the order.</Typography>}/>
                        <FormControlLabel control={<Checkbox value={consent2} onChange={e=>setConsent2(e.target.checked)}/>}
                                          label={<Typography variant="body2">I agree to the terms of service.</Typography>}/>
                    </FormGroup>
                </Grid>

                {orderDraft.statusMsg && <Grid item xs={12}>
                    <Typography color="error">{orderDraft.statusMsg}</Typography>
                </Grid>}

                <Grid item xs={12}>
                    <Button onClick={handlePlaceOrder} disabled={!consent1 || !consent2} variant="contained">Place Order</Button>
                    <Button onClick={handleCancelOrder} variant="contained" color="error" sx={{ml: 1}}>Cancel Order</Button>
                </Grid>
            </Grid>}
        </>
    ) : null;
}

export default NewOrderView;
