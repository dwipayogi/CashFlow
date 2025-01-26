import { View, Text, StyleSheet, ScrollView } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { Link } from "expo-router";

import { Header } from "@/components/header";
import { Button } from "@/components/button";
import { Card } from "@/components/card";

import { colors } from "@/constants/colors";

export default function Transaction() {
  const barData = [
    {
      value: 1000000,
      label: "Jan",
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: { color: "gray" },
      frontColor: colors.success,
    },
    { value: 800000, frontColor: colors.danger },
    {
      value: 1200000,
      label: "Feb",
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: { color: "gray" },
      frontColor: colors.success,
    },
    { value: 900000, frontColor: colors.danger },
    {
      value: 600000,
      label: "Mar",
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: { color: "gray" },
      frontColor: colors.success,
    },
    { value: 600000, frontColor: colors.danger },
    {
      value: 1000000,
      label: "Apr",
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: { color: "gray" },
      frontColor: colors.success,
    },
    { value: 1000000, frontColor: colors.danger },
    {
      value: 1200000,
      label: "May",
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: { color: "gray" },
      frontColor: colors.success,
    },
    { value: 1000000, frontColor: colors.danger },
    {
      value: 1000000,
      label: "Jun",
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: { color: "gray" },
      frontColor: colors.success,
    },
    { value: 1100000, frontColor: colors.danger },
  ];

  return (
    <View style={styles.container}>
      <Header title="Statictics" />
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
                  }}>
                  <Text style={{ color: colors.dark, fontSize: 12 }}>
                    {item.value}
                  </Text>
                </View>
              );
            }}
          />
        </View>
        <View style={styles.transaction}>
          <Text style={styles.transactionTitle}>Transaction</Text>
          <Text style={styles.transactionSubtitle}>Today</Text>
          <Card
            title="Grocery Shopping"
            date="2024-03-20T14:30:00"
            amount={1000000}
            expense={true}
          />
          <Card
            title="Grocery Shopping"
            date="2024-03-20T14:30:00"
            amount={1000000}
            expense={true}
          />
          <Card
            title="Grocery Shopping"
            date="2024-03-20T14:30:00"
            amount={1000000}
            expense={true}
          />
          <Card
            title="Grocery Shopping"
            date="2024-03-20T14:30:00"
            amount={1000000}
            expense={true}
          />
          <Text style={styles.transactionSubtitle}>Yesterday</Text>
          <Card
            title="Grocery Shopping"
            date="2024-03-20T14:30:00"
            amount={1000000}
            expense={true}
          />
          <Card
            title="Grocery Shopping"
            date="2024-03-20T14:30:00"
            amount={1000000}
            expense={true}
          />
          <Card
            title="Grocery Shopping"
            date="2024-03-20T14:30:00"
            amount={1000000}
            expense={true}
          />
        </View>
      </ScrollView>
      <Link href="/add-transaction" asChild>
        <Button style={styles.addTransactionButton}>Add Transaction</Button>
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
  },
});
