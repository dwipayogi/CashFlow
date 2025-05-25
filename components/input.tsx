import { TextInput, StyleSheet, TextInputProps } from "react-native";
import { useState } from "react";
import { colors } from "@/constants/colors";

export const Input = ({ style, ...props }: TextInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TextInput
      style={[styles.input, isFocused && styles.inputFocused, style]}
      placeholderTextColor={colors.light}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
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
