import React from "react";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ProfilePhotoUpload from "./ProfilePhotoUpload";
import LicensePhotoUpload from "./LicensePhotoUpload";

const LicenceForm = () => {
    return (
        <Box className="container" sx={{ maxWidth: 400, margin: "auto", mt: 4 }}>
            <Typography variant="h5" fontWeight="bold">
                Welcome, Mohamed
            </Typography>
            <Typography variant="body2" color="gray" mb={2}>
                Here's what you need to do to set up your account.
            </Typography>

            {/* Profile Photo Upload */}
            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography fontWeight="bold">Profile Photo</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <ProfilePhotoUpload />
                </AccordionDetails>
            </Accordion>

            {/* License Photo Upload */}
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography fontWeight="bold">Driving License</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <LicensePhotoUpload />
                </AccordionDetails>
            </Accordion>

            {/* Terms & Conditions */}
            <Typography variant="body2" color="gray" mt={2}>
                <strong>Term and Conditions</strong>
            </Typography>
            <Typography variant="body2" color="green">completed</Typography>
        </Box>
    );
};

export default LicenceForm;