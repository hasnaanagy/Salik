// dashboardController.js
const Ride = require("../models/Ride");
const RideBooking = require("../models/RideBookings");
const ServiceRequest = require("../models/RequestService");
const Service = require("../models/Service");
const Review = require("../models/Review");
const ServiceReview = require("../models/ServiceReview");
const User = require("../models/User");

exports.getDashboardStats = async (req, res) => {
  try {
    // Ensure only admins can access this endpoint
    if (req.user.type !== "admin") {
      return res.status(403).json({ message: "Only admins can access dashboard statistics" });
    }

    // 1. User Statistics
    const totalUsers = await User.countDocuments();
    const userTypeDistribution = await User.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ]);
    const newUsersLast30Days = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    });
    const unverifiedProviders = await User.countDocuments({
      type: "provider",
      $or: [{ nationalIdStatus: "pending" }, { licenseStatus: "pending" }],
    });

    // 2. Ride and Booking Statistics
    const totalRides = await Ride.countDocuments();
    const rideStatusBreakdown = await Ride.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const totalBookings = await RideBooking.countDocuments();
    const bookingStatusBreakdown = await RideBooking.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const popularRoutes = await Ride.aggregate([
      {
        $group: {
          _id: { from: "$fromLocation", to: "$toLocation" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);
    const averageRidePrice = await Ride.aggregate([
      { $group: { _id: null, avgPrice: { $avg: "$price" } } },
    ]);

    // 3. Service Request Statistics
    const totalServiceRequests = await ServiceRequest.countDocuments();
    const requestStatusBreakdown = await ServiceRequest.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const serviceTypePopularity = await ServiceRequest.aggregate([
      { $group: { _id: "$serviceType", count: { $sum: 1 } } },
    ]);
    const averageResponseTime = await ServiceRequest.aggregate([
      { $match: { status: "accepted" } },
      {
        $group: {
          _id: null,
          avgResponseTime: {
            $avg: {
              $divide: [
                { $subtract: ["$updatedAt", "$createdAt"] },
                1000 * 60, // Convert to minutes
              ],
            },
          },
        },
      },
    ]);

    // 4. Review and Rating Statistics
    const totalRideReviews = await Review.countDocuments();
    const totalServiceReviews = await ServiceReview.countDocuments();
    const totalReviews = totalRideReviews + totalServiceReviews;
    const avgRideReviewRating = await Review.aggregate([
      { $group: { _id: null, avgRating: { $avg: "$rating" } } },
    ]);
    const avgServiceReviewRating = await ServiceReview.aggregate([
      { $group: { _id: null, avgRating: { $avg: "$rating" } } },
    ]);
    const topRatedProviders = await Review.aggregate([
      { $group: { _id: "$providerId", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
      { $match: { count: { $gte: 5 } } },
      { $sort: { avgRating: -1 } },
      { $limit: 5 },
      { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "provider" } },
      { $unwind: "$provider" },
      { $project: { fullName: "$provider.fullName", avgRating: 1, count: 1 } },
    ]);

    // 5. Operational Metrics
    const activeProviders = await Service.countDocuments();
    const rideCompletionRate = await Ride.aggregate([
      {
        $group: {
          _id: null,
          completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
          total: { $sum: 1 },
        },
      },
      {
        $project: {
          rate: { $multiply: [{ $divide: ["$completed", "$total"] }, 100] },
        },
      },
    ]);
    const requestFulfillmentRate = await ServiceRequest.aggregate([
      {
        $group: {
          _id: null,
          completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
          total: { $sum: 1 },
        },
      },
      {
        $project: {
          rate: { $multiply: [{ $divide: ["$completed", "$total"] }, 100] },
        },
      },
    ]);

    // 6. User Engagement Metrics
    const activeUsersLast24Hours = await User.countDocuments({
      lastLogin: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });
    const repeatCustomers = await RideBooking.aggregate([
      { $group: { _id: "$customerId", count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } },
      { $count: "repeatCustomers" },
    ]);

    // Combine all stats into a single response
    const stats = {
      userStats: {
        totalUsers,
        userTypeDistribution,
        newUsersLast30Days,
        unverifiedProviders,
      },
      rideStats: {
        totalRides,
        rideStatusBreakdown,
        totalBookings,
        bookingStatusBreakdown,
        popularRoutes,
        averageRidePrice: averageRidePrice[0]?.avgPrice || 0,
      },
      serviceRequestStats: {
        totalServiceRequests,
        requestStatusBreakdown,
        serviceTypePopularity,
        averageResponseTime: averageResponseTime[0]?.avgResponseTime || 0,
      },
      reviewStats: {
        totalReviews,
        avgRideReviewRating: avgRideReviewRating[0]?.avgRating || 0,
        avgServiceReviewRating: avgServiceReviewRating[0]?.avgRating || 0,
        topRatedProviders,
      },
      operationalStats: {
        activeProviders,
        rideCompletionRate: rideCompletionRate[0]?.rate || 0,
        requestFulfillmentRate: requestFulfillmentRate[0]?.rate || 0,
      },
      engagementStats: {
        activeUsersLast24Hours,
        repeatCustomers: repeatCustomers[0]?.repeatCustomers || 0,
      },
    };

    res.status(200).json({ message: "Dashboard statistics retrieved successfully", stats });
  } catch (error) {
    console.error("[DASHBOARD STATS] Server error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};