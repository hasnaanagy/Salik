import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  Animated,
  Dimensions,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const SplashScreen = () => {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  
  const letterAnimations = useRef(
    Array.from({ length: 5 }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      letterAnimations.forEach((anim, index) => {
        setTimeout(() => {
          Animated.timing(anim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start();
        }, index * 300);
      });
    }, 2000);

    setTimeout(() => {
      router.replace("/intro");
    }, 6000);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../../assets/logo.jpg")}
        style={[
          styles.logo,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      />
      
      <View style={styles.lettersContainer}>
        {["S", "A", "L", "I", "K"].map((letter, index) => (
          <Animated.Text
            key={index}
            style={[styles.letter, { opacity: letterAnimations[index] }]}
          >
            {letter}
          </Animated.Text>
        ))}
      </View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  logo: {
    width: width * 0.5,
    height: width * 0.5,
    resizeMode: "contain",
    marginBottom: 20,
  },
  lettersContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  letter: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
    marginHorizontal: 4,
  },
});
