import React from "react";
import PageTitle from "../components/PageTitle";
import {Typography} from "@mui/material";

const ReadmeView: React.FC = () => {
    return (<>
        <PageTitle title="README"/>

        <Typography>
            This is a naive demo of a system that would allow people to
            transfer money in case of any technical or legal restrictions
            preventing them to do so directly. For example, blocked bank
            transfers between countries; lack of integration between
            different payment systems; too high fee for traditional wire
            transfer.
        </Typography>

        <Typography mt={2}>
            The hypothetical system's purpose is to acquire payers' money
            in their jurisdiction or region, and then fulfil counter requests
            as soon as possible. Say, a customer named John who reside in the
            United States, makes an request to transfer money to his correspondent,
            Hanna, who is currently in Georgia (not the state, but a country outside
            the USA). Around the same time another customer Giorgi, who lives in
            Georgia, makes a <b>counter request</b> to send money to the USA in favor
            of his trusted contact Mariam. If both requests are approximately the same
            amount considering floating exchange rates, then the system can match
            those requests, and make payments to Hanna and Mariami almost instantly,
            without having to transfer any money between jurisdictions.
        </Typography>

        <Typography mt={2}>
            For demo purposes the following users are registered: <b>john</b>,
            <b>hanna</b>, <b>giorgi</b>, <b>mariam</b>.
        </Typography>

        <Typography mt={2}>
            There is also a <b>master</b> account that simulates and helps understating
            the behavior and functionality of the system. Of course, the real system
            should not have any interface for order reconciliation, this is a demo
            feature only.
        </Typography>

        <Typography mt={2}>
            Please note that this demo has no backend. It has no server database either.
            Respectively, all the data is kept in browser memory, and then you refresh
            the page, "database" gets reset to its initial state.
        </Typography>
    </>)
}

export default ReadmeView;
