import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllResquestsAction, confirmRequestAction, updateRequestStateAction } from "../redux/slices/requestServiceSlice";
import { Container, Typography, Grid, Card, CardContent, CircularProgress, Select, MenuItem, Button, FormControl, InputLabel } from "@mui/material";
import RoomIcon from '@mui/icons-material/Room';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import axios from "axios";

const statusColors = {
    pending: "#FFC107",
    accepted: "#2196F3",
    confirmed: "#4CAF50",
    completed: "#673AB7"
};

const Requests = ({ userType }) => {
    const dispatch = useDispatch();
    const { requests = {}, isLoading } = useSelector((state) => state.requestSlice || {});
    const { user } = useSelector((state) => state.auth);
    
    const [selectedProvider, setSelectedProvider] = useState({});
    const [locations, setLocations] = useState({});

    useEffect(() => {
        dispatch(getAllResquestsAction());
    }, [dispatch]);

    // Convert coordinates to address
    const getAddressFromCoordinates = async (lat, lng, requestId) => {
        try {
            const apiKey = "2d4b78c5799a4d8292da41dce45cadde"; 
            const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`);
            const address = response.data.results[0]?.formatted || "Unknown location";
            setLocations(prev => ({ ...prev, [requestId]: address }));
        } catch (error) {
            console.error("Error fetching address:", error);
            setLocations(prev => ({ ...prev, [requestId]: "Location not found" }));
        }
    };

    useEffect(() => {
        Object.entries(requests).forEach(([status, reqList]) => {
            reqList.forEach(req => {
                if (req.location?.coordinates) {
                    const [lng, lat] = req.location.coordinates; // GeoJSON format (lng, lat)
                    getAddressFromCoordinates(lat, lng, req._id);
                }
            });
        });
    }, [requests]);

    const handleAcceptRequest = async (requestId) => {
        await dispatch(updateRequestStateAction({ requestId, action: "accept" }));
        dispatch(getAllResquestsAction());
    };

    const handleConfirmProvider = async (requestId) => {
        if (!selectedProvider[requestId]) return;
        await dispatch(confirmRequestAction({ requestId, action: "confirm", providerId: selectedProvider[requestId] }));
        dispatch(getAllResquestsAction());
    };

    const handleCompleteRequest = async (requestId) => {
        await dispatch(updateRequestStateAction({ requestId, action: "complete" }));
        dispatch(getAllResquestsAction());
    };

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
                Service Requests
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
                                        boxShadow: 4, 
                                        borderLeft: `6px solid ${statusColors[status]}`, 
                                        borderRadius: "10px",
                                        transition: "transform 0.2s",
                                        '&:hover': { transform: "scale(1.03)" }
                                    }}>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>{req.serviceType}</Typography>
                                            
                                            {/* Converted Address */}
                                            <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mt: 1, color: "#555" }}>
                                                <RoomIcon fontSize="small" sx={{ mr: 1, color: "red" }} />
                                                {locations[req._id] || "Fetching location..."}
                                            </Typography>

                                            <Typography variant="body2" sx={{ mt: 1 }}>📝 Problem: {req.problemDescription}</Typography>

                                            {/* Provider: Show "Accept" button for pending requests */}
                                            {user.type === "provider" && status === "pending" && (
                                                <Button 
                                                    variant="contained" 
                                                    sx={{ mt: 2, bgcolor: "#FFC107", color: "#000" }} 
                                                    fullWidth
                                                    onClick={() => handleAcceptRequest(req._id)}
                                                >
                                                    Accept Request
                                                </Button>
                                            )}

                                            {/* Customer: Show provider selection for accepted requests */}
                                            {user.type === "customer" && status === "accepted" && req.acceptedProviders?.length > 0 && (
                                                <>
                                                    <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: "bold" }}>
                                                        Select a Provider:
                                                    </Typography>
                                                    <FormControl fullWidth sx={{ mt: 1 }}>
                                                        <InputLabel>Available Providers</InputLabel>
                                                        <Select
                                                            value={selectedProvider[req._id] || ""}
                                                            onChange={(e) => 
                                                                setSelectedProvider({ ...selectedProvider, [req._id]: e.target.value })
                                                            }
                                                        >
                                                            {req.acceptedProviders.map((provider) => (
                                                                <MenuItem key={provider._id} value={provider._id}>
                                                                    {provider.fullName} ({provider.phone})
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                    <Button 
                                                        variant="contained" 
                                                        color="primary" 
                                                        sx={{ mt: 2 }} 
                                                        fullWidth
                                                        onClick={() => handleConfirmProvider(req._id)}
                                                        disabled={!selectedProvider[req._id]}
                                                    >
                                                        <CheckCircleIcon sx={{ mr: 1 }} /> Confirm Provider
                                                    </Button>
                                                </>
                                            )}

                                            {/* Customer: Show "Mark as Completed" button for confirmed requests */}
                                            {user.type === "customer" && status === "confirmed" && (
                                                <Button 
                                                    variant="contained" 
                                                    sx={{ mt: 2, bgcolor: "#4CAF50" }} 
                                                    fullWidth
                                                    onClick={() => handleCompleteRequest(req._id)}
                                                >
                                                    <DoneAllIcon sx={{ mr: 1 }} /> Mark as Completed
                                                </Button>
                                            )}
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

export default Requests;
