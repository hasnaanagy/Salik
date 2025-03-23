// app/(tabs)/_layout.jsx
import { Tabs } from 'expo-router';
import React from 'react';
import { TabBar } from '../../components/SharedComponents/TabBar';
import { Platform } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ProfileComponent from '../../components/UserComponents/profileComponent';

const Drawer = createDrawerNavigator();

const TabsLayout = () => {
  const options = {
    headerStyle: {
      backgroundColor: 'transparent',
      elevation: 0,
      shadowOpacity: 0,
      height: Platform.OS === 'ios' ? 100 : 60
    },
    headerTitleAlign: "left",
    headerTitleStyle: {
      fontFamily: "Poppins_400Regular",
      fontSize: 34,
    }
  };

  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="index" options={{ title: "Salik", ...options }} />
      <Tabs.Screen name="requests" options={{ title: "Requests", ...options }} />
      <Tabs.Screen name="activity" options={{ title: "Activity", ...options }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", ...options }} />
    </Tabs>
  );
};

const DrawerLayout = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <ProfileComponent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: 300,
        },
      }}
    >
      <Drawer.Screen name="tabs" component={TabsLayout} />
    </Drawer.Navigator>
  );
};

export default DrawerLayout;