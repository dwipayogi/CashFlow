import { Stack, useRouter } from "expo-router";
import { useAuth } from "@/contexts/authContext";

export default function AuthLayout() {
  const router = useRouter();
  const { session } = useAuth();

  if (session) router.replace("/(tabs)/dashboard");

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="register" />
      <Stack.Screen name="login" />
    </Stack>
  );
}
