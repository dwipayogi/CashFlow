import { useState } from "react";
import { View, Text, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Header } from "@/components/header";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { CurrencyInput } from "@/components/currency-input";

import { colors } from "@/constants/colors";

export default function AddPlan() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [target, setTarget] = useState("");
  const [type, setType] = useState("EXPENSE");
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  async function handleAddPlan() {
    if (!description || !amount || !target) {
      Alert.alert("Error", "Description, amount, and target are required");
      return;
    }

    // Validate numeric fields
    const amountNum = parseFloat(amount);
    const targetNum = parseFloat(target);

    if (isNaN(amountNum) || amountNum < 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    if (isNaN(targetNum) || targetNum <= 0) {
      Alert.alert("Error", "Please enter a valid target amount");
      return;
    }
    try {
      setLoading(true);

      // Get token for authenticated requests
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        throw new Error("No authentication token found");
      }

      // Create the request body with proper typing
      const requestBody: {
        amount: number;
        target: number;
        description: string;
        type: string;
        category?: string;
        endDate?: string;
      } = {
        amount: amountNum,
        target: targetNum,
        description,
        type,
        category: category || undefined,
      };

      // Only include endDate for SAVINGS type
      if (type === "SAVINGS") {
        requestBody.endDate = endDate.toISOString();
      }

      const response = await fetch("http://localhost:3000/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create budget");
      }

      Alert.alert("Success", "Budget plan created successfully");
      router.push("/planning");
    } catch (err: any) {
      console.error("Error adding budget:", err);
      Alert.alert("Error", err.message || "Failed to create budget");
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
      {" "}
      <Header title="Buat Rencana Anggaran Baru" />
      <Text style={styles.label}>Deskripsi</Text>
      <Input
        placeholder="Deskripsi"
        value={description}
        onChangeText={setDescription}
      />
      <Text style={styles.label}>Jumlah Saat Ini</Text>
      <CurrencyInput
        placeholder="Jumlah Saat Ini"
        value={amount}
        onChangeText={setAmount}
      />
      <Text style={styles.label}>Jumlah Target</Text>
      <CurrencyInput
        placeholder="Target Amount"
        value={target}
        onChangeText={setTarget}
      />{" "}
      <Text style={styles.label}>Tipe</Text>
      <View style={styles.typeButtonContainer}>
        {" "}
        <Button
          style={[
            styles.typeButton,
            styles.leftButton,
            type === "SAVINGS" && styles.activeButton,
          ]}
          onPress={() => setType("SAVINGS")}
          textColor={type === "SAVINGS" ? colors.dark : colors.primary}
        >
          Target Menabung
        </Button>
        <Button
          style={[
            styles.typeButton,
            styles.rightButton,
            type === "EXPENSE" && styles.activeButton,
          ]}
          onPress={() => setType("EXPENSE")}
          textColor={type === "EXPENSE" ? colors.dark : colors.primary}
        >
          Batas Anggaran
        </Button>
      </View>{" "}
      <Text style={styles.label}>Kategori (Opsional)</Text>
      <Input
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
      />
      {/* Only show End Date input for Savings Goal type */}
      {type === "SAVINGS" && (
        <>
          {" "}
          <Text style={styles.label}>Tanggal Berakhir (DD/MM/YYYY)</Text>
          <View style={styles.manualDateContainer}>
            <Input
              style={styles.dateInput}
              placeholder="DD"
              keyboardType="numeric"
              value={endDate.getDate().toString().padStart(2, "0")}
              onChangeText={(text) => {
                const day = parseInt(text);
                if (!isNaN(day) && day >= 1 && day <= 31) {
                  const newDate = new Date(endDate);
                  newDate.setDate(day);
                  setEndDate(newDate);
                }
              }}
              maxLength={2}
            />
            <Text style={styles.dateSlash}>/</Text>
            <Input
              style={styles.dateInput}
              placeholder="MM"
              keyboardType="numeric"
              value={(endDate.getMonth() + 1).toString().padStart(2, "0")}
              onChangeText={(text) => {
                const month = parseInt(text) - 1;
                if (!isNaN(month) && month >= 0 && month <= 11) {
                  const newDate = new Date(endDate);
                  newDate.setMonth(month);
                  setEndDate(newDate);
                }
              }}
              maxLength={2}
            />
            <Text style={styles.dateSlash}>/</Text>
            <Input
              style={[styles.dateInput, styles.yearInput]}
              placeholder="YYYY"
              keyboardType="numeric"
              value={endDate.getFullYear().toString()}
              onChangeText={(text) => {
                const year = parseInt(text);
                if (!isNaN(year) && text.length === 4) {
                  const newDate = new Date(endDate);
                  newDate.setFullYear(year);
                  setEndDate(newDate);
                }
              }}
              maxLength={4}
            />
          </View>
        </>
      )}{" "}
      <Button style={styles.button} onPress={handleAddPlan}>
        Buat Rencana Anggaran
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
  label: {
    marginTop: 16,
    marginBottom: 4,
    fontSize: 16,
    fontWeight: "bold",
    color: colors.light,
  },
  button: {
    marginTop: 24,
  },
  typeButtonContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
  typeButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.dark,
  },
  leftButton: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    marginRight: 0,
    borderRightWidth: 1,
  },
  rightButton: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    marginLeft: 0,
    borderLeftWidth: 1,
  },
  activeButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  manualDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  dateInput: {
    flex: 1,
    maxWidth: 50,
    textAlign: "center",
  },
  yearInput: {
    maxWidth: 80,
  },
  dateSlash: {
    color: colors.light,
    fontSize: 20,
    marginHorizontal: 5,
  },
});
