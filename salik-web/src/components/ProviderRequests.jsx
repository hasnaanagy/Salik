import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllResquestsAction } from "../redux/slices/requestServiceSlice";
import { Container, Typography, Grid, Card, CardContent, CircularProgress } from "@mui/material";


const statusColors = {
    pending: "#FFC107",
    accepted: "#2196F3",
    confirmed: "#4CAF50",
    completed: "#673AB7"
};

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
                  Provider Requests
            </Typography>

            {Object.entries(requests).map(([status, reqList]) => (
                reqList.length > 0 && (
                    <div key={status}>
                        <Typography variant="h5" sx={{ color: statusColors[status], fontWeight: "bold", mb: 2, mt: 3 }}>
                            {status.charAt(0).toUpperCase() + status.slice(1)} Requests
                        </Typography>
                        <Grid container spacing={3}>
                            {reqList.map((req) => (
                                <Grid item xs={12} sm={6} md={4} key={req._id}>
                                    <Card sx={{ 
                                        boxShadow: 3, 
                                        borderLeft: `5px solid ${statusColors[status]}`, 
                                        transition: "transform 0.2s",
                                        '&:hover': { transform: "scale(1.03)" }
                                    }}>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>{req.serviceType}</Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                📍 Location: {req.location?.coordinates?.join(", ")}
                                            </Typography>
                                            <Typography variant="body2">📝 Problem: {req.problemDescription}</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </div>
                )
            ))}
        </Container>
    );
};

export default ProviderRequests;
