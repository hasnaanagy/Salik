import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { getAllReviewsAction } from "../../redux/slices/reviewsSlice.js";
import appColors from "../../constants/colors.js";
import ReviewItem from "./ReviewItem";
import Stars from "./Stars";
import AddRate from "./addRate.jsx";
const ReviewList = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { reviews, isLoading, error } = useSelector((state) => state.reviews);
  const [isAddRateVisible, setIsAddRateVisible] = useState(false); // تحكم في عرض AddRate
  const [selectedReview, setSelectedReview] = useState(null);
  const [editMode, setEditMode] = useState("add"); // 🆕 افتراضيًا الوضع هو "add"
  const [averageRating, setAverageRating] = useState(0);
  const handleEditReview = (review) => {
    setSelectedReview(review);
    setEditMode("edit"); // تغيير الوضع إلى تعديل
    setIsAddRateVisible(true);
  };

  // عند الضغط على Plus (إضافة مراجعة جديدة)
  const handleAddReview = () => {
    setSelectedReview(null);
    setEditMode("add"); // تغيير الوضع إلى إضافة
    setIsAddRateVisible(true);
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

      {isLoading ? (
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
              onDelete={() => console.log("Delete Review", item.id)}
            />
          )}
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={handleAddReview}>
        <Feather name="plus" size={24} color="white" />
      </TouchableOpacity>

      {isAddRateVisible && (
        <AddRate
          onClose={() => setIsAddRateVisible(false)}
          initialRating={selectedReview ? selectedReview.rating : 0} // تمرير التقييم الصحيح
          initialReviewText={selectedReview ? selectedReview.comment : ""} // تمرير التعليق الصحيح
          mode={editMode} // تمرير الوضع (إضافة/تعديل)
          providerId={"67b9d63113d8dc503bfa9615"} // ⬅️ تمرير الـ Provider ID
          reviewId={selectedReview?._id} // ⬅️ تمرير الـ Review ID عند التعديل فقط
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
