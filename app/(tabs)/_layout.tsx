import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Tabs, router } from "expo-router";
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
            marginTop: 10,
          },
        }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
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
        <Tabs.Screen
          name="camera"
          options={{
            title: "camera",
            tabBarButton: () => (
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={() => {
                  router.push("/camera");
                }}
              >
                <View style={styles.cameraIconContainer}>
                  <Feather name="camera" size={30} color={colors.dark} />
                </View>
              </TouchableOpacity>
            ),
          }}
        />
        <Tabs.Screen
          name="planning"
          options={{
            title: "planning",
            tabBarIcon: ({ color }) => (
              <Feather name="book" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="chatbot"
          options={{
            title: "chatbot",
            tabBarIcon: ({ color }) => (
              <Feather name="message-square" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen name="add-transaction" options={{ href: null }} />
        <Tabs.Screen name="add-plan" options={{ href: null }} />
      </Tabs>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.dark,
  },
  cameraButton: {
    top: -12,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraIconContainer: {
    width: 54,
    height: 54,
    backgroundColor: colors.primary,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});
