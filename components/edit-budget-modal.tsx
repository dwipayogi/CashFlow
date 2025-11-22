import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Input } from "./input";
import { CurrencyInput } from "./currency-input";
import { Button } from "./button";
import { colors } from "@/constants/colors";
import { updateBudget } from "@/functions/localStorage";

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

interface EditBudgetModalProps {
  isVisible: boolean;
  onClose: () => void;
  budget: Budget | null;
  onUpdate: (updatedBudget: Budget) => void;
}

export const EditBudgetModal = ({
  isVisible,
  onClose,
  budget,
  onUpdate,
}: EditBudgetModalProps) => {
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

    // Early validation - silently return if required fields are missing
    if (!description || !amount || !target) {
      return;
    }

    // Validate numeric fields
    const amountNum = parseFloat(amount);
    const targetNum = parseFloat(target);

    if (
      isNaN(amountNum) ||
      amountNum < 0 ||
      isNaN(targetNum) ||
      targetNum <= 0
    ) {
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

      const result = await updateBudget(token, budget.id, requestBody);

      if (!result.success) {
        throw new Error(result.message || "Failed to update budget");
      }

      // Update with the returned data
      onUpdate(result.data!);

      // Close modal on success
      onClose();
    } catch (err: any) {
      console.error("Error updating budget:", err);
      // Don't show alerts for errors, just log them
    } finally {
      setLoading(false);
    }
  };

  const renderDateInputs = () => {
    return (
      <>
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
    );
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Ubah Anggaran</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButtonContainer}
            >
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContent}>
            {budget ? (
              <>
                {" "}
                <Text style={styles.label}>Deskripsi</Text>
                <Input
                  placeholder="Deskripsi"
                  value={description}
                  onChangeText={setDescription}
                />{" "}
                <Text style={styles.label}>Jumlah Saat Ini</Text>
                <CurrencyInput
                  placeholder="Jumlah Saat Ini"
                  value={amount}
                  onChangeText={setAmount}
                />{" "}
                <Text style={styles.label}>Jumlah Target</Text>
                <CurrencyInput
                  placeholder="Jumlah Target"
                  value={target}
                  onChangeText={setTarget}
                />{" "}
                <Text style={styles.label}>Kategori (Opsional)</Text>
                <Input
                  placeholder="Kategori"
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
                  Perbarui Anggaran
                </Button>
              </>
            ) : (
              <ActivityIndicator size="large" color={colors.primary} />
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: colors.dark,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
    maxHeight: Dimensions.get("window").height * 0.85,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.light,
  },
  closeButtonContainer: {
    padding: 8,
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
    marginBottom: 40,
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
