import { View, Text, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { colors } from "@/constants/colors";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { Link } from "expo-router";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    if (!session) Alert.alert('Please check your inbox for email verification!')
    setLoading(false)
  }

  if (loading) return <ActivityIndicator size="large" color={colors.primary} />;
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an account</Text>
      <Text style={styles.subtitle}>Username</Text>
      <Input placeholder="Name" value={username} onChangeText={setUsername} />
      <Text style={styles.subtitle}>Email</Text>
      <Input placeholder="Email" value={email} onChangeText={setEmail} />
      <Text style={styles.subtitle}>Password</Text>
      <Input placeholder="Password" value={password} onChangeText={setPassword} />
      <Button onPress={handleRegister}>Register</Button>
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
