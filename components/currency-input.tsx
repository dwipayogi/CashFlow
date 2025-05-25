import { TextInput, StyleSheet, TextInputProps } from "react-native";
import { useState, useEffect } from "react";
import { colors } from "@/constants/colors";

interface CurrencyInputProps
  extends Omit<TextInputProps, "value" | "onChangeText"> {
  value: string;
  onChangeText: (text: string) => void;
}

export const CurrencyInput = ({
  style,
  value,
  onChangeText,
  ...props
}: CurrencyInputProps) => {
  const [displayValue, setDisplayValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Format number with Indonesian thousands separator (.)
  const formatCurrency = (text: string) => {
    // Remove all non-digits
    const numbers = text.replace(/\D/g, "");

    if (!numbers) return "";

    // Add dots as thousands separator
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Remove formatting to get raw number
  const getUnformattedValue = (text: string) => {
    return text.replace(/\./g, "");
  };

  useEffect(() => {
    setDisplayValue(formatCurrency(value));
  }, [value]);

  const handleChangeText = (text: string) => {
    const formatted = formatCurrency(text);
    setDisplayValue(formatted);

    // Pass the unformatted value back to parent
    const unformatted = getUnformattedValue(formatted);
    onChangeText(unformatted);
  };

  return (
    <TextInput
      style={[styles.input, isFocused && styles.inputFocused, style]}
      placeholderTextColor={colors.light}
      value={displayValue}
      onChangeText={handleChangeText}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      keyboardType="numeric"
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 4,
    borderColor: colors.gray,
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    color: colors.primary,
  },
  inputFocused: {
    borderColor: colors.primary,
  },
});
