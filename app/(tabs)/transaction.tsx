import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Header } from "@/components/header";
import { Card } from "@/components/card";

import { colors } from "@/constants/colors";
import { formatRupiah } from "@/functions/formatCurrency";

// Define the transaction type
interface Transaction {
  id: string;
  amount: number;
  description: string;
  type: "DEPOSIT" | "WITHDRAWAL";
  category: string;
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

export default function Transaction() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");

        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch("http://localhost:3000/api/transactions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch transactions");
        }

        // According to API.md, transactions are in data.data
        // Sort transactions by date (newest first)
        const sortedTransactions = (data.data || []).sort(
          (a: Transaction, b: Transaction) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setTransactions(sortedTransactions);
      } catch (err: any) {
        console.error("Error fetching transactions:", err);
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Group transactions by date
  const groupTransactionsByDate = (transactions: Transaction[]) => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

    const todayTransactions = transactions.filter(
      (t) => new Date(t.createdAt).toDateString() === today
    );
    const yesterdayTransactions = transactions.filter(
      (t) => new Date(t.createdAt).toDateString() === yesterday
    );
    const olderTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.createdAt).toDateString();
      return transactionDate !== today && transactionDate !== yesterday;
    });

    return { todayTransactions, yesterdayTransactions, olderTransactions };
  };

  // Group transactions by month for chart data
  const generateChartData = (transactions: Transaction[]) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentYear = new Date().getFullYear();

    // Initialize monthly data
    const monthlyData = months.map((month, index) => ({
      month,
      monthIndex: index,
      income: 0,
      expense: 0,
    }));

    // Process transactions
    transactions.forEach((transaction) => {
      const date = new Date(transaction.createdAt);
      // Only count transactions from current year
      if (date.getFullYear() === currentYear) {
        const monthIndex = date.getMonth();
        if (transaction.type === "DEPOSIT") {
          monthlyData[monthIndex].income += transaction.amount;
        } else {
          monthlyData[monthIndex].expense += transaction.amount;
        }
      }
    });

    // Convert to chart data format
    const chartData: any[] = [];

    monthlyData.forEach((data, index) => {
      // Add income bar
      chartData.push({
        value: data.income,
        label: index % 2 === 0 ? data.month : "", // Show label for every other month
        spacing: 2,
        labelWidth: 30,
        labelTextStyle: { color: "gray" },
        frontColor: colors.success,
      });

      // Add expense bar
      chartData.push({
        value: data.expense,
        frontColor: colors.danger,
      });
    });

    return chartData;
  };
  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }
  const barData = generateChartData(transactions);

  const { todayTransactions, yesterdayTransactions, olderTransactions } =
    groupTransactionsByDate(transactions);

  return (
    <View style={styles.container}>
      <Header title="Statistik" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.chart}>
          <BarChart
            data={barData}
            barWidth={12}
            spacing={24}
            roundedTop
            roundedBottom
            xAxisThickness={0}
            yAxisThickness={0}
            yAxisTextStyle={{ color: colors.light }}
            noOfSections={3}
            hideRules
            isAnimated
            leftShiftForTooltip={12}
            leftShiftForLastIndexTooltip={24}
            renderTooltip={(item: any, index: any) => {
              return (
                <View
                  style={{
                    backgroundColor: colors.light,
                    paddingHorizontal: 6,
                    paddingVertical: 4,
                    borderRadius: 4,
                  }}
                >
                  <Text style={{ color: colors.dark, fontSize: 12 }}>
                    {formatRupiah(item.value)}
                  </Text>
                </View>
              );
            }}
          />
        </View>
        <View style={styles.transaction}>
          <Text style={styles.transactionTitle}>Transaksi</Text>

          {todayTransactions.length > 0 && (
            <>
              <Text style={styles.transactionSubtitle}>Hari Ini</Text>{" "}
              {todayTransactions.map((transaction) => (
                <Card key={transaction.id} transaction={transaction} />
              ))}
            </>
          )}

          {yesterdayTransactions.length > 0 && (
            <>
              <Text style={styles.transactionSubtitle}>Kemarin</Text>
              {yesterdayTransactions.map((transaction) => (
                <Card key={transaction.id} transaction={transaction} />
              ))}
            </>
          )}

          {olderTransactions.length > 0 && (
            <>
              <Text style={styles.transactionSubtitle}>Sebelumnya</Text>
              {olderTransactions.map((transaction) => (
                <Card key={transaction.id} transaction={transaction} />
              ))}
            </>
          )}

          {transactions.length === 0 && (
            <Text style={styles.noTransactions}>
              Tidak ada transaksi ditemukan
            </Text>
          )}
        </View>
      </ScrollView>
      <Link href="/add-transaction" asChild>
        <Text style={styles.addTransactionButton}>Tambah Transaksi</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
    padding: 20,
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.white,
    alignSelf: "center",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "center",
  },
  chart: {
    marginTop: 20,
    alignItems: "center",
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
  transactionSubtitle: {
    fontSize: 12,
    color: colors.light,
    fontWeight: "bold",
  },
  addTransactionButton: {
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
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: colors.danger,
    fontSize: 16,
    textAlign: "center",
  },
  noTransactions: {
    color: colors.light,
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});
