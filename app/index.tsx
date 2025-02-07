import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { Link } from "expo-router";

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>CashFLow</Text>
      <Text style={styles.subtitle}>Your Financial Intelligence Partner</Text>
      <Link href="/register" asChild>
        <Text style={styles.button}>Register</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
    justifyContent: "flex-end",
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.white,
  },
  subtitle: {
    fontSize: 18,
    color: colors.white,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    color: colors.dark,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
