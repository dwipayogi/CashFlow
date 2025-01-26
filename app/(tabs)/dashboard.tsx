import { View, ScrollView, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";

import { colors } from "@/constants/colors";
import { Card } from "@/components/card";
import { Button } from "@/components/button";

const transactions = [
  {
    id: 1,
    title: "Grocery Shopping",
    date: "2024-03-20T14:30:00",
    category: "Food",
    expense: true,
    amount: 1000000,
  },
  {
    id: 2,
    title: "Salary Deposit",
    date: "2024-03-15T09:00:00",
    category: "Income",
    expense: false,
    amount: 4250000,
  },
  {
    id: 3,
    title: "Netflix Subscription",
    date: "2024-03-14T16:45:00",
    category: "Entertainment",
    expense: true,
    amount: 1599000,
  },
  {
    id: 4,
    title: "Electric Bill",
    date: "2024-03-12T11:20:00",
    category: "Utilities",
    expense: true,
    amount: 853000,
  },
]

export default function Dashboard() {
  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Hello,</Text>
          <Text style={styles.name}>John Doe</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.balance}>Total Balance</Text>
          <Text style={styles.balanceAmount}>Rp100.000.000</Text>
          <View style={styles.income}>
            <View style={styles.incomeItem}>
              <Text style={styles.incomeTitle}>Income</Text>
              <Text style={styles.incomeAmount}>Rp100.000.000</Text>
            </View>
            <View style={styles.incomeItem}>
              <Text style={styles.incomeTitle}>Expense</Text>
              <Text style={styles.expenseAmount}>Rp100.000.000</Text>
            </View>
          </View>
        </View>
        <View style={styles.transaction}>
          <Text style={styles.transactionTitle}>Recent Transactions</Text>
          {transactions.map((transaction) => (
            <Card key={transaction.id} title={transaction.title} date={transaction.date} amount={transaction.amount} expense={transaction.expense} />
          ))}
        </View>
      </ScrollView>
      <Link href="/add-transaction" asChild>
        <Button style={styles.addTransactionButton}>Add Transaction</Button>
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
  header: {
    flexDirection: "column",
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    color: colors.light,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
  },
  content: {
    backgroundColor: colors.light,
    width: "100%",
    padding: 20,
    borderRadius: 12,
  },
  balance: {
    fontSize: 16,
    color: colors.black,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.black,
  },
  income: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  incomeItem: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  incomeTitle: {
    fontSize: 14,
    color: colors.black,
  },
  incomeAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.success,
  },
  expenseAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.danger,
  },
  transaction: {
    marginTop: 20,
    gap: 12,
  },
  transactionTitle: {
    fontSize: 16,
    color: colors.light,
    fontWeight: "bold",
  },
  addTransactionButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});
