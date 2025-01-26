import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/constants/colors";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { Link } from "expo-router";
export default function Register() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an account</Text>
      <Text style={styles.subtitle}>Username</Text>
      <Input placeholder="Name" />
      <Text style={styles.subtitle}>Email</Text>
      <Input placeholder="Email" />
      <Text style={styles.subtitle}>Password</Text>
      <Input placeholder="Password" />
      <Button>Register</Button>
      <Text style={styles.text}>Already have an account? <Link href="/login" style={styles.link}>Login</Link></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
    justifyContent: "flex-end",
    padding: 16,
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.light,
  },
  text: {
    fontSize: 16,
    color: colors.light,
    textAlign: "center",
  },
  link: {
    color: colors.primary,
    fontWeight: "bold",
  },
});
