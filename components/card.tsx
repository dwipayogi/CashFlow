import { View, StyleSheet, Text } from "react-native";
import { colors } from "@/constants/colors";

import { formatRupiah } from "@/functions/formatCurrency";

interface Transaction {
  id: string;
  amount: number;
  description: string;
  type: "DEPOSIT" | "WITHDRAWAL";
  categoryName?: string;
  createdAt: string;
  updatedAt: string;
}

export const Card = ({ transaction }: { transaction: Transaction }) => {
  const isExpense = transaction.type === "WITHDRAWAL";

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View
            style={[
              styles.icon,
              isExpense ? styles.expenseIcon : styles.incomeIcon,
            ]}
          ></View>
          <View>
            <Text style={styles.title}>{transaction.description}</Text>
            <Text style={styles.date}>
              {transaction.createdAt.split("T")[0]}
            </Text>
            {transaction.categoryName && (
              <Text style={styles.category}>{transaction.categoryName}</Text>
            )}
          </View>
        </View>
        <View>
          <Text
            style={[
              styles.amount,
              isExpense ? styles.expenseAmount : styles.incomeAmount,
            ]}
          >
            {isExpense ? "-" : "+"}
            {formatRupiah(transaction.amount)}
          </Text>
          <Text style={styles.type}>
            {transaction.type === "DEPOSIT" ? "Income" : "Expense"}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.gray,
    padding: 12,
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  cardHeaderLeft: {
    flexDirection: "row",
    height: "100%",
    gap: 8,
  },
  icon: {
    aspectRatio: 1,
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  expenseIcon: {
    backgroundColor: colors.danger,
  },
  incomeIcon: {
    backgroundColor: colors.success,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.light,
  },
  date: {
    fontSize: 14,
    color: colors.light,
  },
  category: {
    fontSize: 12,
    color: colors.primary,
    fontStyle: "italic",
  },
  amount: {
    fontSize: 18,
    fontWeight: "bold",
  },
  type: {
    fontSize: 12,
    color: colors.light,
    textAlign: "right",
  },
  expenseAmount: {
    color: colors.danger,
  },
  incomeAmount: {
    color: colors.success,
  },
});
