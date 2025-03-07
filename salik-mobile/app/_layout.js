import { Stack } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useFonts, Poppins_400Regular } from '@expo-google-fonts/poppins';

const RootLayout = () => {
    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
    });

    if (!fontsLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    return (
        <Stack
            screenOptions={{
                headerTitleStyle: {
                    fontFamily: 'Poppins_400Regular',
                },
            }}
        >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen 
                name="search"
                options={{
                    headerShown: false, 
                    headerTransparent: true,
                }}
            />
        </Stack>
    );
}

export default RootLayout;
