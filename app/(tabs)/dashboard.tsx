import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { colors } from "@/constants/colors";
import { Card } from "@/components/card";
import { getTransactions } from "@/functions/localStorage";

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

// Define user type
interface User {
  id: string;
  username: string;
  email: string;
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  const fetchUserData = useCallback(async () => {
    try {
      // Get stored user data
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        setUser(JSON.parse(userData));
      }

      // Get token for authenticated requests
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        throw new Error("No authentication token found");
      }

      // Fetch transactions from local storage
      const transactions = await getTransactions(token);
      setTransactions(transactions);

      // Calculate totals
      let income = 0;
      let expense = 0;

      transactions.forEach((transaction: Transaction) => {
        if (transaction.type === "DEPOSIT") {
          income += transaction.amount;
        } else {
          expense += transaction.amount;
        }
      });

      setTotalIncome(income);
      setTotalExpense(expense);
      setTotalBalance(income - expense);
      setError("");
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchUserData();
    }, [fetchUserData])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUserData();
  }, [fetchUserData]);

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, styles.loadingContainer]}
        edges={["top"]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={[styles.container, styles.errorContainer]}
        edges={["top"]}
      >
        <Text style={styles.errorText}>Kesalahan: {error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Halo,</Text>
          <Text style={styles.name}>{user?.username || "Pengguna"}</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.balance}>Total Saldo</Text>
          <Text style={styles.balanceAmount}>
            Rp{totalBalance.toLocaleString("id-ID")}
          </Text>
          <View style={styles.income}>
            <View style={styles.incomeItem}>
              <Text style={styles.incomeTitle}>Pemasukan</Text>
              <Text style={styles.incomeAmount}>
                Rp{totalIncome.toLocaleString("id-ID")}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.incomeItem}>
              <Text style={styles.incomeTitle}>Pengeluaran</Text>
              <Text style={styles.expenseAmount}>
                Rp{totalExpense.toLocaleString("id-ID")}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.transaction}>
          <Text style={styles.transactionTitle}>Transaksi Terbaru</Text>
          {transactions.length === 0 ? (
            <Text style={styles.noTransactions}>
              Tidak ada transaksi ditemukan
            </Text>
          ) : (
            transactions
              .slice(0, 5)
              .map((transaction) => (
                <Card key={transaction.id} transaction={transaction} />
              ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
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
    fontSize: 18,
    color: colors.light,
  },
  name: {
    fontSize: 32,
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
    fontSize: 16,
    color: colors.black,
  },
  incomeAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.success,
  },
  divider: {
    width: 1,
    height: "100%",
    backgroundColor: "#DFDFDF",
  },
  expenseAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.danger,
  },
  transaction: {
    marginTop: 20,
    gap: 12,
  },
  transactionTitle: {
    fontSize: 18,
    color: colors.light,
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
