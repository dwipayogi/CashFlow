import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { colors } from "@/constants/colors";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primary,
        tabBarStyle: {
          backgroundColor: colors.dark,
          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen name="dashboard" options={{
          title: "home",
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="transaction"
        options={{
          title: "transaction",
          tabBarIcon: ({ color }) => (
            <Feather name="bar-chart-2" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen name="planning" options={{
          title: "planning",
          tabBarIcon: ({ color }) => (
            <Feather name="book" size={24} color={color} />
          ),
        }} />
      <Tabs.Screen name="add-transaction" options={{ href: null }} />
      <Tabs.Screen name="add-plan" options={{ href: null }} />
    </Tabs>
  );
}

