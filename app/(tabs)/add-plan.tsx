import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { Header } from "@/components/header";
import { Button } from "@/components/button";
import { Input } from "@/components/input";

import { colors } from "@/constants/colors";

export default function AddPlan() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  function handleAddPlan() {
    router.push("/dashboard");
  }

  return (
    <View style={styles.container}>
      <Header title="Create New Plan" />
      <Text style={styles.label}>Name</Text>
      <Input placeholder="Name" value={name} onChangeText={setName} />
      <Text style={styles.label}>Description</Text>
      <Input placeholder="Description" value={description} onChangeText={setDescription} />
      <Text style={styles.label}>Amount</Text>
      <Input placeholder="Amount" value={amount} onChangeText={setAmount} />
      <Text style={styles.label}>Date</Text>
      <Input placeholder="Date" value={date} onChangeText={setDate} />
      <Button style={styles.button} onPress={handleAddPlan}>Create</Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.white,
    alignSelf: "center",
    marginBottom: 16,
  },
  label: {
    marginTop: 16,
    marginBottom: 4,
    fontSize: 16,
    fontWeight: "bold",
    color: colors.light,
  },
  button: {
    marginTop: 16,
  },
});


