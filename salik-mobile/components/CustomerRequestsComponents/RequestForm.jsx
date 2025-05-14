import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import CustomText from "../CustomeComponents/CustomText";

const { width, height } = Dimensions.get("window");

const RequestForm = ({
  description,
  setDescription,
  handleSubmit,
  locationLoading,
}) => {
  return (
    <View style={styles.form}>
      <Image
        source={require("../../assets/help.png")}
        style={styles.imageStyle}
        resizeMode="contain"
      />
      <View style={styles.inputContainer}>
        <Feather
          name="file-text"
          size={24}
          color="#ffb800"
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.formTextArea}
          placeholder="Describe your problem"
          placeholderTextColor="#999"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>
      <TouchableOpacity
        style={[styles.button, { opacity: locationLoading ? 0.6 : 1 }]}
        onPress={handleSubmit}
        disabled={locationLoading}
      >
        <Feather name="send" size={20} color="#000" style={styles.buttonIcon} />
        <CustomText style={styles.buttonText}>Request Service</CustomText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: width * 0.05,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: height * 0.02,
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    left: 15,
    zIndex: 1,
  },
  formTextArea: {
    flex: 1,
    padding: width * 0.04,
    paddingLeft: width * 0.12,
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 16,
    fontSize: width * 0.04,
    color: "#212529",
    backgroundColor: "#f8f9fa",
    height: height * 0.15,
    textAlignVertical: "top",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.6,
    backgroundColor: "#ffb800",
    paddingVertical: height * 0.018,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    marginVertical: height * 0.02,
  },
  buttonText: {
    color: "#000",
    fontSize: width * 0.04,
    fontWeight: "600",
  },
  buttonIcon: {
    marginRight: width * 0.02,
  },
  imageStyle: {
    width: width * 0.5,
    height: height * 0.2,
    marginBottom: height * 0.03,
  },
});

export default RequestForm;
