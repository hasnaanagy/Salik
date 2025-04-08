import React, { useEffect } from "react";
import { Grid, Typography, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBooking,
  fetchProviderRides,
} from "../redux/slices/activitySlice";
import Cards from "./Card";
import ActivityStyles from "../styles/ActivityStyle"; // Adjust the path if needed

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
      await dispatch(fetchProviderRides());
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

  // Check if there are no rides at all
  const hasNoRides =
    upcoming.length === 0 && completed.length === 0 && canceled.length === 0;

  return (
    <Grid sx={ActivityStyles.container}>
      <Grid item sx={ActivityStyles.gridItem}>
        {hasNoRides ? (
          <Box sx={ActivityStyles.noRidesBox}>
            <Typography variant="h5" sx={ActivityStyles.noRidesText}>
              No Activities Yet
            </Typography>
          </Box>
        ) : (
          <>
            <Typography variant="h3" sx={ActivityStyles.sectionTitle}>
              Upcoming
            </Typography>
            {upcoming.length > 0 ? (
              upcoming.map((ride) => <Cards key={ride._id} ride={ride} />)
            ) : (
              <Typography sx={ActivityStyles.emptySectionText}>
                No upcoming rides
              </Typography>
            )}

            <Typography
              variant="h3"
              sx={ActivityStyles.sectionTitleWithTopMargin}
            >
              Past
            </Typography>
            {completed.length > 0 ? (
              completed.map((ride) => <Cards key={ride._id} ride={ride} />)
            ) : (
              <Typography sx={ActivityStyles.emptySectionText}>
                No past rides
              </Typography>
            )}

            <Typography
              variant="h3"
              sx={ActivityStyles.sectionTitleWithTopMargin}
            >
              Canceled
            </Typography>
            {canceled.length > 0 ? (
              canceled.map((ride) => <Cards key={ride._id} ride={ride} />)
            ) : (
              <Typography sx={ActivityStyles.emptySectionText}>
                No canceled rides
              </Typography>
            )}
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default ActivityComponent;