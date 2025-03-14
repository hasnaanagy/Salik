import React from "react";
import { View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import appColors from "../../constants/colors";

const Stars = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <View style={{ flexDirection: "row" }}>
      {Array.from({ length: fullStars }, (_, i) => (
        <FontAwesome
          key={`full-${i}`}
          name="star"
          size={24}
          color={appColors.primary}
        />
      ))}
      {hasHalfStar && (
        <FontAwesome
          key="half"
          name="star-half-full"
          size={24}
          color={appColors.primary}
        />
      )}
      {Array.from({ length: emptyStars }, (_, i) => (
        <FontAwesome
          key={`empty-${i}`}
          name="star-o"
          size={24}
          color="#B0B0B0"
        />
      ))}
    </View>
  );
};

export default Stars;
