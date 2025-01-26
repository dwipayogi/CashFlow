import { View, StyleSheet, Text } from "react-native";
import { colors } from "@/constants/colors";

export const Card = ({ title, date, amount, expense }: { title: string; date: string; amount: number; expense: boolean }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View style={styles.icon}></View>
          <View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.date}>{date.split("T")[0]}</Text>
          </View>
        </View>
        <View>
          <Text style={[styles.amount, expense ? styles.expenseAmount : styles.incomeAmount]}>Rp{amount}</Text>
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
    height: "100%",
    aspectRatio: 1,
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.light,
  },
  date: {
    fontSize: 14,
    color: colors.light,
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  expenseAmount: {
    color: colors.danger,
  },
  incomeAmount: {
    color: colors.success,
  },
});
