import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllResquestsAction } from "../redux/slices/requestServiceSlice";
import { Container, Typography, Grid, Card, CardContent, CircularProgress, Snackbar, Alert } from "@mui/material";
import io from "socket.io-client";

const socket = io("http://localhost:5000", { autoConnect: false });

const ProviderRequests = () => {
    const dispatch = useDispatch();
    const { requests = {}, isLoading } = useSelector((state) => state.requestSlice || {});

    useEffect(() => {
        dispatch(getAllResquestsAction());
    }, [dispatch]);

    if (isLoading) {
        return (
            <Container sx={{ textAlign: "center", mt: 4 }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>Loading requests...</Typography>
            </Container>
        );
    }

    if (!requests || Object.values(requests).every(arr => arr.length === 0)) {
        return (
            <Container sx={{ textAlign: "center", mt: 4 }}>
                <Typography variant="h6" color="textSecondary">No requests found.</Typography>
            </Container>
        );
    }

    return (
        <Container sx={{ mt: 5 }}>
            <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "bold", mb: 4 }}>
                🚀 Provider Requests
            </Typography>

            {requests.pending.length > 0 && (
                <>
                    <Typography variant="h5" sx={{ color: "#FFC107", fontWeight: "bold", mb: 2 }}>
                        Pending Requests
                    </Typography>
                    <Grid container spacing={3}>
                        {requests.pending.map((req) => (
                            <Grid item xs={12} sm={6} md={4} key={req._id}>
                                <Card sx={{ boxShadow: 2, borderLeft: "5px solid #FFC107" }}>
                                    <CardContent>
                                        <Typography variant="h6">{req.serviceType}</Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            📍 Location: {req.location?.coordinates?.join(", ")}
                                        </Typography>
                                        <Typography variant="body2">Problem: {req.problemDescription}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}

            {requests.accepted.length > 0 && (
                <>
                    <Typography variant="h5" sx={{ color: "#2196F3", fontWeight: "bold", mt: 3 }}>
                        Accepted Requests
                    </Typography>
                    <Grid container spacing={3}>
                        {requests.accepted.map((req) => (
                            <Grid item xs={12} sm={6} md={4} key={req._id}>
                                <Card sx={{ boxShadow: 2, borderLeft: "5px solid #2196F3" }}>
                                    <CardContent>
                                        <Typography variant="h6">{req.serviceType}</Typography>
                                        <Typography variant="body2">📍 Location: {req.location?.coordinates?.join(", ")}</Typography>
                                        <Typography variant="body2">Problem: {req.problemDescription}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}
        </Container>
    );
};

export default ProviderRequests;

