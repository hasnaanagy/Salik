import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { MainButton } from "../custom/MainButton";
import car from "../../public/images/car.png";
const Cards = (id, fromLocation, toLocation, seats, price, date, time) => {
    const cancelled = false;
    const color = cancelled ? "grey" : "#FFB800";
    const cancel = cancelled ? "Cancelled" : "Cancel";
    const textDecoration = cancelled ? "line-through" : "none";
    return (
        <Box display="flex" alignItems="center" gap={2} mb={2}>
            {/* Left side*/}
            <Box display="flex" alignItems="center">
                <Box
                    sx={{
                        width: 12,
                        height: 12,
                        bgcolor: color,
                        borderRadius: "50%",
                        marginRight: 1,
                        boxShadow: 1,
                    }}
                />
                <Typography variant="body2" color="textSecondary">
                    {date} {time}
                </Typography>
            </Box>

            {/* Ride Card */}
            <Card sx={{ width: 500, display: "flex", alignItems: "center", padding: 1 }}>
                <CardContent sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                    {/* Car Icon */}
                    <img src={car} style={{ width: 50, marginRight: 20 }} color="warning" />

                    {/* Ride Details */}
                    <Box flexGrow={1}>
                        <Typography variant="subtitle1">{fromLocation} to {toLocation}</Typography>
                        <Typography variant="body2">Price: {price} $ &nbsp; &nbsp; Seats: {seats}</Typography>
                    </Box>

                    {/* Yellow Cancel Button */}
                    <MainButton variant="contained" color={color} sx={{ textDecoration: textDecoration }}
                        onClick={() => cancelled = !cancelled}>
                        {cancel}
                    </MainButton>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Cards;
