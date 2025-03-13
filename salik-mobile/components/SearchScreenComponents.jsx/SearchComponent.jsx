import React from "react";
import { StyleSheet, View } from "react-native";
import BackButton from "../SharedComponents/BackButton";
import CustomBottomSheet from "./CustomBottomSheet";
import Map from "../MapComponent/Map";

const SearchComponent = () => {
  return (
    <View style={styles.container}>
      <BackButton />
      <Map />
      <CustomBottomSheet />
    </View>
  );
};

export default SearchComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
