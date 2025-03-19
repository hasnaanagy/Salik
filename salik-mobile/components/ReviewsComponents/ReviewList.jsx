import React, { useEffect, useState } from "react";
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
import { useRouter } from "expo-router";
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
  const dispatch = useDispatch();
  const { reviews, isLoading, error } = useSelector((state) => state.reviews);
  const [isAddRateVisible, setIsAddRateVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [editMode, setEditMode] = useState("add");
  const [averageRating, setAverageRating] = useState(0);
  const [refreshing, setRefreshing] = useState(false); // State for RefreshControl

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
    dispatch(getAllReviewsAction("67b9d63113d8dc503bfa9615"));
  };
  useEffect(() => {
    dispatch(getAllReviewsAction("67b9d63113d8dc503bfa9615"));
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

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(getAllReviewsAction("67b9d63113d8dc503bfa9615")).then(() => {
      setRefreshing(false);
    });
  };

  return (
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

      <TouchableOpacity style={styles.addButton} onPress={handleAddReview}>
        <Feather name="plus" size={24} color="white" />
      </TouchableOpacity>

      {isAddRateVisible && (
        <AddRate
          onClose={() => setIsAddRateVisible(false)}
          initialRating={selectedReview ? selectedReview.rating : 0}
          initialReviewText={selectedReview ? selectedReview.comment : ""}
          mode={editMode}
          providerId={"67b9d63113d8dc503bfa9615"}
          reviewId={selectedReview?._id}
        />
      )}
    </View>
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
  },
});

export default ReviewList;
