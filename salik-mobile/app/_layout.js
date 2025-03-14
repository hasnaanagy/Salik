import { Provider } from "react-redux";
import store from "../redux/store";
import { Stack } from "expo-router";
import React from "react";
import { useFonts, Poppins_400Regular } from "@expo-google-fonts/poppins";
import { View, ActivityIndicator } from "react-native";

const RootLayout = () => {
  const [fontsLoaded] = useFonts({ Poppins_400Regular });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <Stack
        screenOptions={{
          headerTitleStyle: { fontFamily: "Poppins_400Regular" },
        }}
      >
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="search"
          options={{
            fontFamily: "Poppins_400Regular",
            headerShown: false,
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="license"
          options={{
            headerShown: false,
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="addTrip"
          options={{
            headerShown: false,
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="addService"
          options={{
            headerShown: false,
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="reviews"
          options={{
            headerShown: false,
            headerTransparent: true,
          }}
        />
      </Stack>
    </Provider>
  );
};

export default RootLayout;
