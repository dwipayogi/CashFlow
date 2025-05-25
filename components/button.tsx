import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
} from "react-native";
import { colors } from "@/constants/colors";

// Extend TouchableOpacityProps to include textColor
interface ButtonProps extends TouchableOpacityProps {
  textColor?: string;
  loading?: boolean;
}

export const Button = ({
  children,
  style,
  textColor,
  loading = false,
  ...props
}: ButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      {...props}
      disabled={loading || props.disabled}
    >
      <Text style={[styles.text, textColor ? { color: textColor } : null]}>
        {loading ? "Loading..." : children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  text: {
    color: colors.dark,
    fontSize: 16,
    fontWeight: "bold",
  },
});
