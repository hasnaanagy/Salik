import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, TextField, Typography } from "@mui/material";
import { MainButton } from "../custom/MainButton";
import { useDispatch } from "react-redux";
import { sendRequestAction } from "../redux/slices/requestServiceSlice";
import io from "socket.io-client";

const socket = io("http://localhost:5000"); // Replace with your backend URL

export const RequestService = ({ serviceType }) => {
    const [location, setLocation] = useState({ lat: null, lng: null });
    const [problem, setProblem] = useState("");
    const dispatch = useDispatch();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            (error) => {
                console.error("Error getting location:", error);
            }
        );
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const type = serviceType === "Mechanic" ? "mechanic" : "fuel";

        const requestData = {
            serviceType: type,
            location: {
                type: "Point",
                coordinates: [location.lng, location.lat],
            },
            problem,
        };

        await dispatch(sendRequestAction(requestData));

        // Emit event to notify providers
        socket.emit("customer-request", requestData);
        console.log("Service request sent:", requestData);
    };

    return (
        <div>
            <Typography variant="h6" fontWeight="bold" mb={2} gutterBottom>
                Request {serviceType} Service
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    placeholder="Describe your problem"
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    required
                    multiline
                    minRows={4}
                    sx={{
                        width: "70%",
                        marginBottom: "16px",
                        borderRadius: "12px",
                        backgroundColor: "#F3F3F3",
                        fontSize: "16px",
                        outline: "none",
                        resize: "vertical",
                        fontFamily: "inherit",
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                                border: "none",
                            },
                        },
                    }}
                />
                <MainButton
                    type="submit"
                    sx={{ width: "30%", display: "flex" }}
                    variant="contained"
                >
                    Send
                </MainButton>
            </form>
        </div>
    );
};
