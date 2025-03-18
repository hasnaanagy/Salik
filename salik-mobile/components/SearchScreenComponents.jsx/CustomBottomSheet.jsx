import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Dimensions, Platform } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, runOnJS } from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import SearchForm from "./SearchForm";
import ConfirmPickUpComponent from "./ConfirmPickUpComponent";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const INITIAL_HEIGHT =Platform.OS === 'ios' ?SCREEN_HEIGHT / 3.5  : SCREEN_HEIGHT / 2.7;
const EXPANDED_HEIGHT = SCREEN_HEIGHT - 100;

const CustomBottomSheet = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const heightValue = useSharedValue(INITIAL_HEIGHT);
  const context = useSharedValue({ h: 0 });

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { h: heightValue.value };
    })
    .onUpdate((event) => {
      heightValue.value = context.value.h - event.translationY;
      heightValue.value = Math.max(INITIAL_HEIGHT, Math.min(heightValue.value, EXPANDED_HEIGHT)); 
    })
    .onEnd(() => {
      if (heightValue.value > (INITIAL_HEIGHT + EXPANDED_HEIGHT) / 2) {
        heightValue.value = withSpring(EXPANDED_HEIGHT, { damping: 50 });
        runOnJS(setIsExpanded)(true); // Ensure state updates correctly
      } else {
        heightValue.value = withSpring(INITIAL_HEIGHT, { damping: 50 });
        runOnJS(setIsExpanded)(false); // Ensure state updates correctly
      }
    });

  const bottomSheetStyle = useAnimatedStyle(() => ({
    height: heightValue.value,
  }));

  useEffect(() => {
    heightValue.value = withSpring(INITIAL_HEIGHT, { damping: 50 });
  }, []);

  const onSearchPress = () => {
    heightValue.value = withSpring(EXPANDED_HEIGHT, { damping: 50 });
    setIsExpanded(true);
  };

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.bottomSheetContainer, bottomSheetStyle]}>
        <View style={styles.line} />
        <Text style={styles.text}>{!isExpanded?"Set Your PickUp Location":"Search"}</Text>
        <View style={styles.divider}></View>

        {!isExpanded ? (
          <ConfirmPickUpComponent onSearchPress={onSearchPress} />
        ) : (
          <SearchForm />
        )}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  bottomSheetContainer: {
    display: "flex",
    gap: 10,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: "white",
    width: "100%",
  },
  line: {
    width: 60,
    height: 5,
    borderRadius: 20,
    backgroundColor: "#ccc",
    alignSelf: "center",
    marginVertical: 10,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#eee",
  },
  text: {
    textAlign: "center",
    marginVertical: 10,
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default CustomBottomSheet;
