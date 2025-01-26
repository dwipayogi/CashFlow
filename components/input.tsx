import { TextInput, StyleSheet, TextInputProps } from "react-native";
import { colors } from "@/constants/colors";

export const Input = ({ style, ...props }: TextInputProps) => {
  return <TextInput style={[styles.input, style]} placeholderTextColor={colors.light} {...props} />;
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 4,
    borderColor: colors.gray,
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    color: colors.primary,
    fontStyle: "italic",
  },
});
