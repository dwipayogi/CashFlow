import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  AppState,
  Alert,
  ActivityIndicator,
} from "react-native";
import { colors } from "@/constants/colors";
import { Input } from "@/components/input";
import { Button } from "@/components/button";

import { supabase } from "@/lib/supabase";
import { Link, useRouter } from "expo-router";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
    router.push("/dashboard");
  }

  if (loading) return <ActivityIndicator size="large" color={colors.primary} />;

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
      <Button onPress={handleLogin}>Login</Button>
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
