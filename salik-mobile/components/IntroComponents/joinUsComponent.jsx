import React from "react";
import { 
  View, Text, StyleSheet, Dimensions, TouchableOpacity, Image 
} from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const JoinUsScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.joinContainer}>
 
      <Image 
        source={require('../../assets/joinus.jpg')}
        style={styles.joinImage}
      />
      
      <Text style={styles.joinTitle}>Choose your role and join us</Text>
  

     
      <TouchableOpacity
        style={styles.getStartedButton}
        onPress={() => router.replace("/")}
      >
        <Text style={styles.getStartedText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

export { JoinUsScreen };

const styles = StyleSheet.create({
  joinContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 20,
  },
  joinImage: {
    width: width * 0.8, 
    height: 300, 
    resizeMode: 'contain',
    marginBottom: 20,
  },
  joinTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 10,
    lineHeight: 22,
  },
  getStartedButton: {
    backgroundColor: "#FFB800",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: "#FFB800",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  getStartedText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});