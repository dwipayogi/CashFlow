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
import { colors } from "@/constants/colors";

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
const BudgetCard = ({ budget }: { budget: Budget }) => {
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
          {budget.categoryData?.name || "No category"}
        </Text>
        <Text style={styles.budgetDate}>
          Until:{" "}
          {budget.endDate
            ? new Date(budget.endDate).toLocaleDateString()
            : "No end date"}
        </Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          {" "}
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
          <Text style={styles.expandedLabel}>Progress Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Current Amount:</Text>
            <Text style={styles.detailValue}>
              Rp {budget.amount.toLocaleString("id-ID")}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Target Amount:</Text>
            <Text style={styles.detailValue}>
              Rp {budget.target.toLocaleString("id-ID")}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Remaining:</Text>
            <Text style={styles.detailValue}>
              Rp {(budget.target - budget.amount).toLocaleString("id-ID")}
            </Text>
          </View>{" "}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Type:</Text>
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
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function Planning() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

        // Fetch budgets
        const response = await fetch("http://localhost:3000/api/budgets", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch budgets");
        }

        // According to API.md, budgets are in data.data
        setBudgets(data.data || []);
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
        <Header title="Budgeting" />
        <View style={styles.content}>
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : budgets.length === 0 ? (
            <Text style={styles.noDataText}>
              No budgets found. Create a new budget plan.
            </Text>
          ) : (
            budgets.map((budget) => (
              <BudgetCard key={budget.id} budget={budget} />
            ))
          )}
        </View>
      </ScrollView>
      <Link href="/add-plan" asChild>
        <Text style={styles.addPlanButton}>Add Plan</Text>
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
