import React from "react";
import { StyleSheet, Text, View } from "react-native";

import RequestPage from "../../components/RequestComponent/RequestPage";
const Requests = () => {
  return (
    <View style={styles.container}>
      <RequestPage />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Requests;
