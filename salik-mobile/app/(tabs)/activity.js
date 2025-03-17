import React from "react";
import { StyleSheet, View } from "react-native";
import ActivityComponent from "../../components/ActivityComponent/ActivityPage";
const Activity = () => {
  return (
    <View style={styles.container}>
      <ActivityComponent />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Activity;
