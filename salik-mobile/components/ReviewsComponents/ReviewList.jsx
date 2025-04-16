import React, { use, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteReviewAction,
  getAllReviewsAction,
} from "../../redux/slices/reviewsSlice.js";
import appColors from "../../constants/colors.js";
import ReviewItem from "./ReviewItem";
import Stars from "./Stars";
import AddRate from "./addRate.jsx";

const ReviewList = () => {
  const router = useRouter();
  const { providerId, serviceType } = useLocalSearchParams(); // Retrieve providerId from navigation params
  console.log("pepep", providerId, serviceType);
  const dispatch = useDispatch();
  const { reviews, isLoading, error } = useSelector((state) => state.reviews);
  const [isAddRateVisible, setIsAddRateVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [editMode, setEditMode] = useState("add");
  const [averageRating, setAverageRating] = useState(0);
  const [refreshing, setRefreshing] = useState(false); // State for RefreshControl
  const { user } = useSelector((state) => state.auth);
  const handleEditReview = (review) => {
    setSelectedReview(review);
    setEditMode("edit");
    setIsAddRateVisible(true);
  };

  const handleAddReview = () => {
    setSelectedReview(null);
    setEditMode("add");
    setIsAddRateVisible(true);
  };

  const handleDeleteReview = async (reviewId) => {
    await dispatch(deleteReviewAction(reviewId));
    dispatch(getAllReviewsAction({ providerId, serviceType }));
  };
  useEffect(() => {
    dispatch(getAllReviewsAction({ providerId, serviceType }));
  }, [dispatch]);

  useEffect(() => {
    if (reviews.length > 0) {
      const avg =
        reviews.reduce((acc, review) => acc + review.rating, 0) /
        reviews.length;
      setAverageRating(avg.toFixed(1));
    } else {
      setAverageRating(0);
    }
  }, [reviews]);

  // Update the onRefresh function
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(getAllReviewsAction({ providerId, serviceType }));
    } catch (error) {
      console.error("Refresh error:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Update the initial useEffect
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        await dispatch(getAllReviewsAction({ providerId, serviceType }));
      } catch (error) {
        console.error("Initial load error:", error);
      }
    };
    if (providerId && serviceType) {
      fetchReviews();
    }
  }, [dispatch, providerId, serviceType]);

  // Update the FlatList section
  <FlatList
    data={reviews}
    keyExtractor={(item) => item._id}
    renderItem={({ item }) => (
      <ReviewItem
        review={item}
        onEdit={() => handleEditReview(item)}
        onDelete={() => handleDeleteReview(item._id)}
      />
    )}
    refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        colors={[appColors.primary]}
      />
    }
    ListEmptyComponent={() => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No reviews available</Text>
      </View>
    )}
  />;
  return (
    console.log(providerId),
    (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => router.push("/")}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Rating & Reviews</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.averageRating}>{averageRating}</Text>
          <Stars rating={averageRating} />
        </View>
        {isLoading && !refreshing ? ( // Show loader only for initial load, not refresh
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={appColors.primary} />
          </View>
        ) : error ? (
          <Text style={{ color: "red" }}>{error}</Text>
        ) : (
          <FlatList
            data={reviews}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <ReviewItem
                review={item}
                onEdit={() => handleEditReview(item)}
                onDelete={() => handleDeleteReview(item._id)}
              />
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
        // Remove or modify this condition to show the add button
        {/* Replace this condition */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddReview}>
          <Feather name="plus" size={24} color="white" />
        </TouchableOpacity>
        {isAddRateVisible && (
          <AddRate
            onClose={() => setIsAddRateVisible(false)}
            initialRating={selectedReview ? selectedReview.rating : 0}
            initialReviewText={selectedReview ? selectedReview.comment : ""}
            mode={editMode}
            providerId={providerId}
            reviewId={selectedReview?._id}
            serviceType={serviceType}
          />
        )}
      </View>
    )
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  backButton: { position: "absolute", top: 23, left: 15, zIndex: 10 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  averageRating: {
    fontSize: 40,
    fontWeight: "bold",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: appColors.primary,
    padding: 15,
    borderRadius: 50,
    elevation: 5,
    zIndex: 999, // Add this to ensure button stays on top
    shadowColor: "#000", // Add shadow for iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default ReviewList;
