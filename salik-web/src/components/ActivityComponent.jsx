import React, { useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBooking,
  fetchProvidedRides,
} from "../redux/slices/activitySlice";
import Cards from "./Card";

const ActivityComponent = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const userType = user?.type;
  // Fetch rides based on user type
  const fetchActivity = async () => {
    if (userType === "customer") {
      console.log("Fetching customer rides");
      await dispatch(fetchBooking());
    } else {
      console.log("Fetching provider rides");
      await dispatch(fetchProvidedRides());
    }
  };
  useEffect(() => {
    fetchActivity();
  }, [dispatch, userType]);

  // Access state.activity correctly
  const {
    upcoming = [],
    completed = [],
    canceled = [],
    loading,
    error,
  } = useSelector((state) => state.activity);

  // Loading and error states
  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>{error}</Typography>;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={10} md={8} lg={6}>
        <Typography variant="h3" sx={{ marginBottom: 5 }}>
          Upcoming
        </Typography>
        {upcoming.length > 0 ? (
          upcoming.map((ride) => <Cards key={ride._id} ride={ride} />)
        ) : (
          <Typography>No upcoming rides</Typography>
        )}

        <Typography variant="h3" sx={{ marginBottom: 5, marginTop: 5 }}>
          Past
        </Typography>
        {completed.length > 0 ? (
          completed.map((ride) => <Cards key={ride._id} ride={ride} />)
        ) : (
          <Typography>No Past rides</Typography>
        )}

        <Typography variant="h3" sx={{ marginBottom: 5, marginTop: 5 }}>
          Canceled
        </Typography>
        {canceled.length > 0 ? (
          canceled.map((ride) => <Cards key={ride._id} ride={ride} />)
        ) : (
          <Typography>No Canceled rides</Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default ActivityComponent;
