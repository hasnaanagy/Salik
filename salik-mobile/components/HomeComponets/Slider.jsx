import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  Dimensions,
  Animated,
  Text,
  Platform,
} from "react-native";

const { width } = Dimensions.get("window");

// Images for the slider
const featureImages = [
  require("../../assets/ride share.jpg"),
  require("../../assets/mechanic slider.jpg"),
  require("../../assets/petrol.jpg"),
];

// Corresponding sentences for each image
const featureTexts = [
  "Start Sharing Your Rides !",
  "Need Assistance?",
  "Fuel Up and Keep Moving!",
];

const Slider = () => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Function to animate text when index changes
  const animateText = () => {
    fadeAnim.setValue(0); // Reset animation
    Animated.timing(fadeAnim, {
      toValue: 1, // Fade in
      duration: 500, // Animation duration
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    animateText();
  }, [currentIndex]);

  return (
    <View style={styles.container}>
      {/* Animated Sentence */}
      <Animated.Text style={[styles.text, { opacity: fadeAnim }]}>
        {featureTexts[currentIndex]}
      </Animated.Text>

      {/* Image Slider */}
      <FlatList
        ref={flatListRef}
        data={featureImages}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <Image source={item} style={styles.image} />}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(
            event.nativeEvent.contentOffset.x / width
          );
          setCurrentIndex(newIndex);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container:{
        marginTop:Platform.OS==='ios'?20:0
    },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  image: {
    width: width * 0.8,
    height: Platform.OS === "ios" ? 220 : 160,
    resizeMode: "cover",
    borderRadius: 10,
    marginHorizontal: 10,
  },
});

export default Slider;
