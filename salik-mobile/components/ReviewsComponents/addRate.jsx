import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "react-native-vector-icons";
import { useDispatch } from "react-redux";
import {
  addReviewsAction,
  updateReviewAction,
} from "../../redux/slices/reviewsSlice.js";
import appColors from "../../constants/colors.js";

const AddRate = ({
  onClose,
  initialRating = 0,
  initialReviewText = "",
  mode = "add",
  providerId, // ⬅️ إضافة providerId
  reviewId, // ⬅️ إضافة reviewId عند التعديل
}) => {
  const dispatch = useDispatch();
  const [rating, setRating] = useState(initialRating);
  const [reviewText, setReviewText] = useState(initialReviewText);

  const handleStarPress = (index) => {
    setRating(index + 1);
  };

  const handleSubmit = () => {
    if (mode === "edit") {
      dispatch(updateReviewAction({ reviewId, rating, comment: reviewText }));
    } else {
      dispatch(addReviewsAction({ providerId, rating, comment: reviewText }));
    }
    onClose(); // ⬅️ إغلاق المودال بعد الإرسال
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Feather name="x" size={24} color="black" />
        </TouchableOpacity>

        <Text style={styles.title}>
          {mode === "edit" ? "Edit Review" : "Add Review"}
        </Text>

        <View style={styles.starsContainer}>
          {Array.from({ length: 5 }).map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleStarPress(index)}
            >
              <FontAwesome
                name={index < rating ? "star" : "star-o"}
                size={30}
                color={index < rating ? appColors.primary : "#B0B0B0"}
              />
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={styles.input}
          placeholder="Write your review..."
          value={reviewText}
          onChangeText={setReviewText}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>
            {mode === "edit" ? "Update" : "Submit"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButton: { position: "absolute", top: 10, right: 10 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  starsContainer: { flexDirection: "row", marginBottom: 15 },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: appColors.primary,
    padding: 10,
    borderRadius: 5,
  },
  submitText: { color: "white", fontWeight: "bold" },
});

export default AddRate;
