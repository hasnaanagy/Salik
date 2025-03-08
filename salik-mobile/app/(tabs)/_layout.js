import { Tabs } from "expo-router";
import React from "react";
import { TabBar } from "../../components/SharedComponents/TabBar";

const TabsLayout = () => {
  const options = {
    headerStyle: {
      backgroundColor: "transparent",
      elevation: 0,
      shadowOpacity: 0,
    },

    headerTitleAlign: "left",
    headerTitleStyle: {
      fontFamily: "Poppins_400Regular",
      fontSize: 32,
    },
  };
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="index" options={{ title: "Salik", ...options }} />
      <Tabs.Screen
        name="requests"
        options={{ title: "Requests", ...options }}
      />
      <Tabs.Screen
        name="activity"
        options={{ title: "Activity", ...options }}
      />
      <Tabs.Screen name="profile" options={{ title: "Profile", ...options }} />
    </Tabs>
  );
};

export default TabsLayout;
