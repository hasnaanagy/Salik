import React, { useEffect } from 'react';
import { Box, CircularProgress, Typography, Grid, Paper, List, ListItem, ListItemText, Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getDashboardStatisticsAction } from '../../redux/slices/dashboardStatisticsSlice';
import StatisticsCard from './StatisticsCard';
import PopularRoutes from './PopularRoutes';
import PeopleIcon from '@mui/icons-material/People';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import BuildIcon from '@mui/icons-material/Build';
import StatisticsSection from './StatisticsSection';

const HomeLayout = () => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.dashboardStatisticsSlice);

  useEffect(() => {
    dispatch(getDashboardStatisticsAction());
  }, [dispatch]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress sx={{ color: '#ffb800' }} />
      </Box>
    );
  }

  const userStats = stats?.userStats || {};
  const rideStats = stats?.rideStats || {};
  const serviceRequestStats = stats?.serviceRequestStats || {};
  const reviewStats = stats?.reviewStats || {};
  const operationalStats = stats?.operationalStats || {};
  const engagementStats = stats?.engagementStats || {};
  const popularRoutes = rideStats?.popularRoutes || [];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ 
        minHeight: '100vh',
        backgroundColor: '#fff8e1',
        borderRadius: '24px',
        p: { xs: 2, md: 4 },
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
      }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 800,
          mb: 6, // Increased margin bottom
          color: '#2d3436',
          textAlign: { xs: 'center', md: 'left' },
          fontSize: { xs: '1.8rem', md: '2.4rem' }
        }}>
          Dashboard Overview
        </Typography>

        {/* Overview Cards with equal height */}
        <Grid container spacing={4} sx={{ mb: 8 }}> {/* Increased margin bottom to 8 (64px) */}
          <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
            <StatisticsCard 
              title="Total Users" 
              value={userStats.totalUsers || 0} 
              icon={<PeopleIcon />}
              subtitle={`${userStats.newUsersLast30Days || 0} new users`}
              bgColor="#4caf50"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
            <StatisticsCard 
              title="Total Rides" 
              value={rideStats.totalRides || 0} 
              icon={<DirectionsCarIcon />}
              subtitle={`${rideStats.rideStatusBreakdown?.find(s => s._id === 'completed')?.count || 0} completed`}
              bgColor="#2196f3"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
            <StatisticsCard 
              title="Total Bookings" 
              value={rideStats.totalBookings || 0} 
              icon={<BookOnlineIcon />}
              subtitle={`Average $${rideStats.averageRidePrice?.toFixed(2) || 0}`}
              bgColor="#ff9800"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
            <StatisticsCard 
              title="Service Requests" 
              value={serviceRequestStats.totalServiceRequests || 0} 
              icon={<BuildIcon />}
              subtitle={`${serviceRequestStats.requestStatusBreakdown?.find(s => s._id === 'completed')?.count || 0} completed`}
              bgColor="#f44336"
            />
          </Grid>
        </Grid>

        {/* Statistics Sections */}
        <Grid container spacing={4}>
          <Grid item xs={12} lg={8}>
            <StatisticsSection 
              title="Popular Routes" 
              description="Most frequently traveled routes"
            >
              <PopularRoutes routes={popularRoutes} />
            </StatisticsSection>
          </Grid>

          <Grid item xs={12} lg={4}>
            <StatisticsSection 
              title="User Activity" 
              description="User engagement metrics"
            >
              <Paper sx={{ 
                p: 3, 
                borderRadius: '16px',
                background: 'linear-gradient(145deg, #ffffff 0%, #fff8e1 100%)'
              }}>
                <List>
                  <ListItem>
                    <ListItemText 
                      primary="New Users (30 Days)" 
                      secondary={userStats.newUsersLast30Days || 0}
                      primaryTypographyProps={{ fontWeight: 600 }}
                      secondaryTypographyProps={{ color: '#4caf50', fontWeight: 600 }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Active Users (24h)" 
                      secondary={engagementStats.activeUsersLast24Hours || 0}
                      primaryTypographyProps={{ fontWeight: 600 }}
                      secondaryTypographyProps={{ color: '#2196f3', fontWeight: 600 }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Repeat Customers" 
                      secondary={engagementStats.repeatCustomers || 0}
                      primaryTypographyProps={{ fontWeight: 600 }}
                      secondaryTypographyProps={{ color: '#ff9800', fontWeight: 600 }}
                    />
                  </ListItem>
                </List>
              </Paper>
            </StatisticsSection>
          </Grid>

          {/* Additional Statistics Sections */}
          <Grid item xs={12} md={6}>
            <StatisticsSection 
              title="Service Performance" 
              description="Service request metrics"
            >
              <Paper sx={{ 
                p: 3, 
                borderRadius: '16px',
                background: 'linear-gradient(145deg, #ffffff 0%, #fff8e1 100%)'
              }}>
                <List>
                  <ListItem>
                    <ListItemText 
                      primary="Average Response Time" 
                      secondary={`${(serviceRequestStats.averageResponseTime / 60000).toFixed(1)} minutes`}
                      primaryTypographyProps={{ fontWeight: 600 }}
                      secondaryTypographyProps={{ color: '#2196f3', fontWeight: 600 }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Request Fulfillment Rate" 
                      secondary={`${operationalStats.requestFulfillmentRate?.toFixed(1)}%`}
                      primaryTypographyProps={{ fontWeight: 600 }}
                      secondaryTypographyProps={{ color: '#4caf50', fontWeight: 600 }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Service Type Distribution" 
                      secondary={
                        serviceRequestStats.serviceTypePopularity?.map(type => 
                          `${type._id}: ${type.count}`
                        ).join(' | ')
                      }
                      primaryTypographyProps={{ fontWeight: 600 }}
                      secondaryTypographyProps={{ color: '#ff9800', fontWeight: 600 }}
                    />
                  </ListItem>
                </List>
              </Paper>
            </StatisticsSection>
          </Grid>

          {/* Reviews & Ratings Section */}
          <Grid item xs={12} md={6}>
            <StatisticsSection 
              title="Reviews & Ratings" 
              description="User feedback metrics"
            >
              <Paper sx={{ 
                p: 3, 
                borderRadius: '16px',
                background: 'linear-gradient(145deg, #ffffff 0%, #fff8e1 100%)'
              }}>
                <List>
                  <ListItem>
                    <ListItemText 
                      primary="Total Reviews" 
                      secondary={reviewStats.totalReviews || 0}
                      primaryTypographyProps={{ fontWeight: 600 }}
                      secondaryTypographyProps={{ color: '#f44336', fontWeight: 600 }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Average Ride Rating" 
                      secondary={`${reviewStats.avgRideReviewRating?.toFixed(1)} / 5.0`}
                      primaryTypographyProps={{ fontWeight: 600 }}
                      secondaryTypographyProps={{ color: '#2196f3', fontWeight: 600 }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Average Service Rating" 
                      secondary={`${reviewStats.avgServiceReviewRating?.toFixed(1)} / 5.0`}
                      primaryTypographyProps={{ fontWeight: 600 }}
                      secondaryTypographyProps={{ color: '#4caf50', fontWeight: 600 }}
                    />
                  </ListItem>
                  {reviewStats.topRatedProviders?.map((provider, index) => (
                    <ListItem key={index}>
                      <ListItemText 
                        primary={`Top Provider: ${provider.fullName}`}
                        secondary={`Rating: ${provider.avgRating?.toFixed(1)} (${provider.count} reviews)`}
                        primaryTypographyProps={{ fontWeight: 600 }}
                        secondaryTypographyProps={{ color: '#ff9800', fontWeight: 600 }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </StatisticsSection>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default HomeLayout;
