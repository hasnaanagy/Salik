import React from 'react';
import { Grid, Box } from '@mui/material';
import StatisticsCard from './StatisticsCard';
import PeopleIcon from '@mui/icons-material/People';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BuildIcon from '@mui/icons-material/Build';
import StarIcon from '@mui/icons-material/Star';

const StatisticsGrid = ({ stats }) => {
  const cards = [
    {
      title: "Total Users",
      value: stats.users,
      icon: <PeopleIcon />,
      bgColor: "#4caf50",
      subtitle: `${stats.newUsers || 0} new this month`
    },
    {
      title: "Active Rides",
      value: stats.rides,
      icon: <DirectionsCarIcon />,
      bgColor: "#2196f3",
      subtitle: `${stats.completedRides || 0} completed`
    },
    {
      title: "Services",
      value: stats.services,
      icon: <BuildIcon />,
      bgColor: "#ff9800",
      subtitle: `${stats.pendingServices || 0} pending`
    },
    {
      title: "Average Rating",
      value: stats.rating?.toFixed(1) || "0.0",
      icon: <StarIcon />,
      bgColor: "#f44336",
      subtitle: `From ${stats.totalReviews || 0} reviews`
    }
  ];

  return (
    <Box sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatisticsCard {...card} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default React.memo(StatisticsGrid);