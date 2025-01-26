import { StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/button";
import { colors } from "@/constants/colors";
import { Link } from "expo-router";

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>CashFLow</Text>
      <Text style={styles.subtitle}>Your Financial Intelligence Partner</Text>
      <Link href="/register" asChild>
        <Button>Register</Button>
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
});
