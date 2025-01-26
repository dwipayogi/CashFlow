import { Tabs } from "expo-router";

import { colors } from "@/constants/colors";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarStyle: {
          backgroundColor: colors.dark,
        },
      }}
    >
      <Tabs.Screen name="dashboard" />
      <Tabs.Screen name="transaction" />
      <Tabs.Screen name="add-transaction" options={{ href: null }} />
    </Tabs>
  );
}
