import React from "react";
import {Box, Typography} from "@mui/material";
import {NavigateNext as ArrowRightIcon} from "@mui/icons-material";
import {grey} from "@mui/material/colors";

interface ViewTitleProps {
    title: string
    username?: string
}

const PageTitle: React.FC<ViewTitleProps> = ({title, username}) => {
    return (
        <Box sx={{display: "flex", alignItems: "center", mb: 1, color: grey[600]}}>
            {username && <>
                <Typography variant="h4">{username}</Typography>
                <ArrowRightIcon color="inherit"/>
            </>}
            <Typography variant="h4">{title.toLowerCase()}</Typography>
        </Box>
    )
}

export default PageTitle;
