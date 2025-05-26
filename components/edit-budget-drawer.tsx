import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Drawer } from "react-native-drawer-layout";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Input } from "./input";
import { CurrencyInput } from "./currency-input";
import { Button } from "./button";
import { colors } from "@/constants/colors";

// Budget type from planning.tsx
interface Budget {
  id: string;
  amount: number;
  target: number;
  description: string;
  type: "EXPENSE" | "SAVINGS";
  category: string;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  categoryData?: {
    id: string;
    name: string;
    description: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface EditBudgetDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  budget: Budget | null;
  onUpdate: (updatedBudget: Budget) => void;
}

export const EditBudgetDrawer = ({
  isOpen,
  onClose,
  budget,
  onUpdate,
}: EditBudgetDrawerProps) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [target, setTarget] = useState("");
  const [category, setCategory] = useState("");
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  // Reset form when budget changes
  useEffect(() => {
    if (budget) {
      setDescription(budget.description);
      setAmount(budget.amount.toString());
      setTarget(budget.target.toString());
      setCategory(budget.categoryData?.name || "");
      if (budget.endDate) {
        setEndDate(new Date(budget.endDate));
      } else {
        setEndDate(new Date());
      }
    }
  }, [budget]);

  const handleUpdate = async () => {
    if (!budget) return;

    if (!description || !amount || !target) {
      Alert.alert("Error", "Description, amount, and target are required");
      return;
    }

    // Validate numeric fields
    const amountNum = parseFloat(amount);
    const targetNum = parseFloat(target);

    if (isNaN(amountNum) || amountNum < 0) {
      Alert.alert("Error", "Please enter a valid current amount");
      return;
    }

    if (isNaN(targetNum) || targetNum <= 0) {
      Alert.alert("Error", "Please enter a valid target amount");
      return;
    }

    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Create request body based on API documentation
      const requestBody: {
        description: string;
        amount: number;
        target: number;
        category?: string;
        endDate?: string;
      } = {
        description,
        amount: amountNum,
        target: targetNum,
      };

      // Only include category if provided
      if (category.trim()) {
        requestBody.category = category;
      }

      // Only include endDate for SAVINGS type budget
      if (budget.type === "SAVINGS") {
        requestBody.endDate = endDate.toISOString();
      }

      const response = await fetch(
        `http://localhost:3000/api/budgets/${budget.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update budget");
      }

      // According to API.md, the updated budget is in data.data
      onUpdate(data.data);

      Alert.alert("Success", "Budget updated successfully");
      onClose();
    } catch (err: any) {
      console.error("Error updating budget:", err);
      Alert.alert("Error", err.message || "Failed to update budget");
    } finally {
      setLoading(false);
    }
  };

  const renderDateInputs = () => {
    return (
      <>
        <Text style={styles.label}>End Date (DD/MM/YYYY)</Text>
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
    );
  };

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      drawerType="slide"
      drawerPosition="right"
      renderDrawerContent={() => {
        return (
          <View style={styles.drawer}>
            <View style={styles.header}>
              <Text style={styles.title}>Edit Budget</Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            {budget ? (
              <>
                <Text style={styles.label}>Description</Text>
                <Input
                  placeholder="Description"
                  value={description}
                  onChangeText={setDescription}
                />

                <Text style={styles.label}>Current Amount</Text>
                <CurrencyInput
                  placeholder="Current Amount"
                  value={amount}
                  onChangeText={setAmount}
                />

                <Text style={styles.label}>Target Amount</Text>
                <CurrencyInput
                  placeholder="Target Amount"
                  value={target}
                  onChangeText={setTarget}
                />

                <Text style={styles.label}>Category (Optional)</Text>
                <Input
                  placeholder="Category"
                  value={category}
                  onChangeText={setCategory}
                />

                {/* Only show End Date input for Savings Goal type */}
                {budget.type === "SAVINGS" && renderDateInputs()}

                <Button
                  style={styles.updateButton}
                  onPress={handleUpdate}
                  loading={loading}
                >
                  Update Budget
                </Button>
              </>
            ) : (
              <ActivityIndicator size="large" color={colors.primary} />
            )}
          </View>
        );
      }}
    >
      {/* Children */}
    </Drawer>
  );
};

const styles = StyleSheet.create({
  drawer: {
    flex: 1,
    backgroundColor: colors.dark,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.light,
  },
  closeButton: {
    fontSize: 24,
    color: colors.light,
  },
  label: {
    marginTop: 16,
    marginBottom: 4,
    fontSize: 16,
    fontWeight: "bold",
    color: colors.light,
  },
  updateButton: {
    marginTop: 24,
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
