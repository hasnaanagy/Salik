import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const BackButton = () => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={{
        position: "absolute",
        top: 15,
        left: 15,
        zIndex: 10,
      }}
      onPress={() => router.back()}
    >
      <Ionicons name="arrow-back" size={24} color="black" />
    </TouchableOpacity>
  );
};

export default BackButton;
