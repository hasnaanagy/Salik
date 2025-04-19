import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import store from "../redux/store";
import { Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useFonts, Poppins_400Regular } from "@expo-google-fonts/poppins";
import { View, ActivityIndicator } from "react-native";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded] = useFonts({ Poppins_400Regular });
  const router = useRouter();

  useEffect(() => {
    const loadApp = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await SplashScreen.hideAsync();
      router.replace("/splash");
    };

    loadApp();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <Stack
          screenOptions={{
            headerTitleStyle: { fontFamily: "Poppins_400Regular" },
          }}
        >
          <Stack.Screen name="splash" options={{ headerShown: false }} />
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
            options={{ headerShown: false, headerTransparent: true }}
          />
          <Stack.Screen
            name="addTrip"
            options={{ headerShown: false, headerTransparent: true }}
          />
          <Stack.Screen
            name="addService"
            options={{ headerShown: false, headerTransparent: true }}
          />
          <Stack.Screen
            name="intro"
            options={{ headerShown: false, headerTransparent: true }}
          />
          <Stack.Screen
            name="joinUs"
            options={{ headerShown: false, headerTransparent: true }}
          />
          <Stack.Screen
            name="reviews"
            options={{
              headerShown: false,
              headerTransparent: true,
            }}
          />
          <Stack.Screen
            name="request"
            options={{
              headerShown: false,
              headerTransparent: true,
            }}
          />
          <Stack.Screen
            name="servicesProvider"
            options={{
              headerShown: false,
              headerTransparent: true,
            }}
          />
             <Stack.Screen
            name="editProfile"
            options={{
              headerShown: false,
              headerTransparent: true,
            }}
          />
        </Stack>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
