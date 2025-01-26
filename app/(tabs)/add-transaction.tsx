import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { colors } from "@/constants/colors";

export default function AddTransaction() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");

  function handleAddTransaction() {
    router.push("/dashboard");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Transaction</Text>
      <Text style={styles.label}>Name</Text>
      <Input placeholder="Name" value={name} onChangeText={setName} />
      <Text style={styles.label}>Amount</Text>
      <Input placeholder="Amount" value={amount} onChangeText={setAmount} />
      <Text style={styles.label}>Date</Text>
      <Input placeholder="Date" value={date} onChangeText={setDate} />
      <Text style={styles.label}>Category</Text>
      <Input placeholder="Category" value={category} onChangeText={setCategory} />
      <Button style={styles.button} onPress={handleAddTransaction}>Add</Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
    padding: 16,
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


