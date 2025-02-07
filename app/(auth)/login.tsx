import { useState } from "react";
import { View, Text, StyleSheet,  ActivityIndicator } from "react-native";
import { Link, useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { colors } from "@/constants/colors";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if(data.token){
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('username', data.user.username);
      router.push("/dashboard");
    } else {
      alert(data.message);
    }
    setLoading(false);
  }

  if (loading)
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to an Account</Text>
      <Text style={styles.subtitle}>Email</Text>
      <Input placeholder="Email" value={email} onChangeText={setEmail} />
      <Text style={styles.subtitle}>Password</Text>
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button onPress={() => handleLogin()}>Login</Button>
      <Text style={styles.text}>
        Don't have an account?{" "}
        <Link href="/register" style={styles.link}>
          Register
        </Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.dark,
  },
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
