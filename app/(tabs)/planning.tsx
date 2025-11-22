import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Header } from "@/components/header";
import { EditBudgetModal } from "@/components/edit-budget-modal";
import { colors } from "@/constants/colors";
import { getBudgets, deleteBudget } from "@/functions/localStorage";

// Define the budget type
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

// Custom BudgetCard component with progress bar
const BudgetCard = ({
  budget,
  onEdit,
  onDelete,
}: {
  budget: Budget;
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const progress = budget.amount / budget.target;
  const progressPercentage = Math.min(Math.round(progress * 100), 100);

  return (
    <TouchableOpacity
      style={styles.budgetCard}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
    >
      <View style={styles.budgetHeader}>
        <Text style={styles.budgetTitle}>{budget.description}</Text>
        <Text
          style={[
            styles.budgetAmount,
            budget.type === "EXPENSE" ? styles.expenseText : styles.incomeText,
          ]}
        >
          Rp {budget.target.toLocaleString("id-ID")}
        </Text>
      </View>
      <View style={styles.budgetMeta}>
        <Text style={styles.budgetCategory}>
          {budget.categoryData?.name || "Tanpa kategori"}
        </Text>
        <Text style={styles.budgetDate}>
          Hingga:{" "}
          {budget.endDate
            ? new Date(budget.endDate).toLocaleDateString()
            : "Tanpa tanggal akhir"}
        </Text>
      </View>
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progressPercentage}%`,
                backgroundColor:
                  budget.type === "EXPENSE" ? colors.danger : colors.success,
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {progressPercentage}% ({budget.amount.toLocaleString("id-ID")} /{" "}
          {budget.target.toLocaleString("id-ID")})
        </Text>
      </View>
      {expanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.expandedLabel}>Detail Progres</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Jumlah Saat Ini:</Text>
            <Text style={styles.detailValue}>
              Rp {budget.amount.toLocaleString("id-ID")}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Target Jumlah:</Text>
            <Text style={styles.detailValue}>
              Rp {budget.target.toLocaleString("id-ID")}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Sisa:</Text>
            <Text style={styles.detailValue}>
              Rp {(budget.target - budget.amount).toLocaleString("id-ID")}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Tipe:</Text>
            <Text
              style={[
                styles.detailValue,
                budget.type === "EXPENSE"
                  ? styles.expenseText
                  : styles.incomeText,
              ]}
            >
              {budget.type === "EXPENSE" ? "Budget Limit" : "Savings Goal"}
            </Text>
          </View>
          {budget.endDate && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tanggal Berakhir:</Text>
              <Text style={styles.detailValue}>
                {new Date(budget.endDate).toLocaleDateString()}
              </Text>
            </View>
          )}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Dibuat:</Text>
            <Text style={styles.detailValue}>
              {new Date(budget.createdAt).toLocaleDateString()}
            </Text>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={() => onEdit(budget)}
            >
              <Text style={styles.buttonText}>Ubah</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => onDelete(budget.id)}
            >
              <Text style={styles.buttonText}>Hapus</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function Planning() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);

  // Function to handle budget editing
  const handleEditBudget = (budget: Budget) => {
    setSelectedBudget(budget);
    setEditModalVisible(true);
  };

  // Function to handle budget update after edit
  const handleBudgetUpdate = (updatedBudget: Budget) => {
    // Update the budget in the state
    setBudgets(
      budgets.map((b) => (b.id === updatedBudget.id ? updatedBudget : b))
    );
  };
  // Function to delete a budget - directly perform the action without alerts
  const handleDeleteBudget = async (budgetId: string) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const result = await deleteBudget(token, budgetId);

      if (!result.success) {
        throw new Error(result.message || "Failed to delete budget");
      }

      // Remove the budget from state
      setBudgets(budgets.filter((b) => b.id !== budgetId));

      // Success is indicated by the item being removed from the list
    } catch (err: any) {
      console.error("Error deleting budget:", err);
      // Instead of alert, we could set an error state and display it in the UI
      setError(err.message || "Failed to delete budget");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch budget data when component mounts
    const fetchBudgets = async () => {
      try {
        setLoading(true);
        // Get token for authenticated requests
        const token = await AsyncStorage.getItem("userToken");

        if (!token) {
          throw new Error("No authentication token found");
        }

        // Fetch budgets from local storage
        const budgets = await getBudgets(token);
        setBudgets(budgets);
      } catch (err: any) {
        console.error("Error fetching budgets:", err);
        setError(err.message || "An error occurred while fetching budgets");
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Header title="Anggaran" />
        <View style={styles.content}>
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : budgets.length === 0 ? (
            <Text style={styles.noDataText}>
              Belum ada anggaran. Silakan buat rencana anggaran baru.
            </Text>
          ) : (
            budgets.map((budget) => (
              <BudgetCard
                key={budget.id}
                budget={budget}
                onEdit={handleEditBudget}
                onDelete={handleDeleteBudget}
              />
            ))
          )}
        </View>
      </ScrollView>
      {/* Edit Budget Modal */}
      <EditBudgetModal
        isVisible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        budget={selectedBudget}
        onUpdate={handleBudgetUpdate}
      />
      <Link href="/add-plan" asChild>
        <Text style={styles.addPlanButton}>Tambah Anggaran</Text>
      </Link>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
    padding: 20,
  },
  content: {
    gap: 12,
  },
  addPlanButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    color: colors.dark,
    fontSize: 16,
    fontWeight: "bold",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  editButton: {
    backgroundColor: colors.primary,
  },
  deleteButton: {
    backgroundColor: colors.danger,
  },
  buttonText: {
    color: colors.light,
    fontWeight: "bold",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: colors.danger,
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  noDataText: {
    color: colors.light,
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  budgetCard: {
    backgroundColor: colors.gray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  budgetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  budgetTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.light,
    flex: 1,
    marginRight: 8,
  },
  budgetAmount: {
    fontSize: 18,
    fontWeight: "bold",
  },
  budgetMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  budgetCategory: {
    color: colors.light,
    fontSize: 14,
  },
  budgetDate: {
    color: colors.light,
    fontSize: 14,
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressBackground: {
    height: 12,
    backgroundColor: "#444",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 6,
  },
  progressText: {
    color: colors.light,
    fontSize: 14,
    marginTop: 4,
    textAlign: "right",
  },
  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#444",
  },
  expandedLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  detailLabel: {
    color: colors.light,
    fontSize: 14,
  },
  detailValue: {
    color: colors.light,
    fontSize: 14,
    fontWeight: "bold",
  },
  expenseText: {
    color: colors.danger,
  },
  incomeText: {
    color: colors.success,
  },
});
