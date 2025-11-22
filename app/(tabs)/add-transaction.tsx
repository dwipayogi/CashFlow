import { useState } from "react";
import { View, Text, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Header } from "@/components/header";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { CurrencyInput } from "@/components/currency-input";

import { colors } from "@/constants/colors";
import { addTransaction } from "@/functions/localStorage";

export default function AddTransaction() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("DEPOSIT");
  const [loading, setLoading] = useState(false);

  async function handleAddTransaction() {
    if (!description || !amount) {
      Alert.alert("Error", "Description and amount are required");
      return;
    }

    // Validate amount is a number
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    try {
      setLoading(true);

      // Get token for authenticated requests
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const result = await addTransaction(token, {
        description,
        amount: amountNum,
        type: type as "DEPOSIT" | "WITHDRAWAL",
        category: category || undefined,
      });

      if (!result.success) {
        throw new Error(result.message || "Failed to add transaction");
      }

      console.log("Transaction created");

      router.push("/dashboard");
    } catch (err: any) {
      console.error("Error adding transaction:", err);
      Alert.alert("Error", err.message || "Failed to add transaction");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Tambah Transaksi Baru" />
      <Text style={styles.label}>Deskripsi</Text>
      <Input
        placeholder="Deskripsi"
        value={description}
        onChangeText={setDescription}
      />
      <Text style={styles.label}>Jumlah</Text>
      <CurrencyInput
        placeholder="Jumlah"
        value={amount}
        onChangeText={setAmount}
      />
      <Text style={styles.label}>Tipe</Text>
      <View style={styles.typeButtonContainer}>
        <Button
          textColor={type === "DEPOSIT" ? colors.dark : colors.primary}
          style={[
            styles.typeButton,
            styles.leftButton,
            type === "DEPOSIT" && styles.activeButton,
          ]}
          onPress={() => setType("DEPOSIT")}
        >
          Pendapatan
        </Button>
        <Button
          textColor={type === "WITHDRAWAL" ? colors.dark : colors.primary}
          style={[
            styles.typeButton,
            styles.rightButton,
            type === "WITHDRAWAL" && styles.activeButton,
          ]}
          onPress={() => setType("WITHDRAWAL")}
        >
          Pengeluaran
        </Button>
      </View>
      <Text style={styles.label}>Kategori (Opsional)</Text>
      <Input
        placeholder="Kategori"
        value={category}
        onChangeText={setCategory}
      />
      <Button style={styles.button} onPress={handleAddTransaction}>
        Tambah Transaksi
      </Button>
    </View>
  );
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
  typeButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  typeButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  leftButton: {
    backgroundColor: colors.dark,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  rightButton: {
    backgroundColor: colors.dark,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  activeButton: {
    backgroundColor: colors.primary,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});
