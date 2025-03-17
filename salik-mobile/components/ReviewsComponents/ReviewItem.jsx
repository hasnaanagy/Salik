import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import Stars from "./Stars"; // استيراد مكون النجوم
import { useSelector } from "react-redux";

const ReviewItem = ({ review, onEdit, onDelete }) => {
  const { user } = useSelector((state) => state.auth);
  console.log(review);
  const image = review.customerId?.profileImg
    ? { uri: review.customerId.profileImg }
    : require("../../assets/adaptive-icon.png");
  return (
    <View style={styles.reviewCard}>
      <Image source={image} style={styles.avatar} />
      <View style={styles.reviewContent}>
        <Text style={styles.name}>{review.comment}</Text>

        <Stars rating={review.rating} />
        <Text style={styles.comment}>{review.comment}</Text>
        <Text style={styles.date}>{review.createdAt.split("T")[0]}</Text>
      </View>
      {review.customerId?._id === user?._id &&
        (console.log("Ali", review.customerId?._id, user?._id),
        (
          <>
            <TouchableOpacity onPress={onEdit} style={styles.iconButton}>
              <Feather name="edit" size={18} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete} style={styles.iconButton}>
              <Feather name="trash" size={18} color="black" />
            </TouchableOpacity>
          </>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  reviewCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  name: { fontSize: 16, fontWeight: 500 },

  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  reviewContent: { flex: 1 },
  comment: { color: "#555" },
  date: { fontSize: 12, color: "#888" },
  iconButton: { marginHorizontal: 5 },
});

export default ReviewItem;
