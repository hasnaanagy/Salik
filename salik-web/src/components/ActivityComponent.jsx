import React, { useEffect } from "react";
import { Grid, Typography, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchRides } from "../redux/slices/activitySlice"; // Import the fetchRides action
import Cards from "./Card"; // Assuming Cards component is used to render each ride

const ActivityComponent = () => {
    const dispatch = useDispatch();

    // Accessing the state from the Redux store
    const { upcoming, completed, loading, error } = useSelector((state) => state.rides);

    useEffect(() => {
        // Dispatch action to fetch rides data
        dispatch(fetchRides());
    }, [dispatch]);

    // Loading state
    if (loading) return <CircularProgress />;

    // Error handling
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Grid container spacing={2} justifyContent={"center"}>
            <Grid item xs={12} sm={10} md={8} lg={6}>
                {/* Display upcoming rides */}
                {upcoming.length > 0 && (
                    <>
                        <Typography variant="h4" sx={{ marginBottom: 2, fontSize: { xs: "1.5rem", md: "2rem" }, textAlign: "center" }}>
                            Upcoming
                        </Typography>
                        {upcoming.map((ride) => (
                            <Cards key={ride.id} ride={ride} />
                        ))}
                    </>
                )}

                {/* Display completed rides */}
                {completed.length > 0 && (
                    <>
                        <Typography variant="h4" sx={{ marginBottom: 2, fontSize: { xs: "1.5rem", md: "2rem" }, textAlign: "center" }}>
                            Past
                        </Typography>
                        {completed.map((ride) => (
                            <Cards key={ride.id} ride={ride} />
                        ))}
                    </>
                )}

                {/* If there are no rides in either category */}
                {upcoming.length === 0 && completed.length === 0 && (
                    <Typography variant="h6" sx={{ textAlign: "center" }}>
                        No rides available.
                    </Typography>
                )}
            </Grid>
        </Grid>
    );
};

export default ActivityComponent;