import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/constants/colors";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { Link, useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin() {
    router.push("/dashboard");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to an Account</Text>
      <Text style={styles.subtitle}>Username</Text>
      <Input placeholder="Name" value={username} onChangeText={setUsername} />
      <Text style={styles.subtitle}>Password</Text>
      <Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button onPress={handleLogin}>Login</Button>
      <Text style={styles.text}>Don't have an account? <Link href="/register" style={styles.link}>Register</Link></Text>
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
