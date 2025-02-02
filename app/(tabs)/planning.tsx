import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Link } from "expo-router";

import { Header } from "@/components/header";
import { Card } from "@/components/card";
import { colors } from "@/constants/colors";

export default function Planning() {
  return (
    <>
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Header title="Planning" />
      <View style={styles.content}>
        <Card title="Monthly Budget" date="2025-01-01" amount={100000} expense={false} />
        <Card title="Monthly Budget" date="2025-01-01" amount={100000} expense={false} />
        <Card title="Monthly Budget" date="2025-01-01" amount={100000} expense={false} />
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
});

