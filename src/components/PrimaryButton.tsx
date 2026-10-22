import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text } from "react-native";

import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

/** El botón principal de una pantalla: píldora con el degradado cálido. */
export function PrimaryButton({
  label,
  onPress,
  isDisabled = false,
}: {
  label: string;
  onPress: () => void;
  isDisabled?: boolean;
}) {
  const colors = useColors();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [isDisabled && styles.disabled, pressed && styles.pressed]}
    >
      <LinearGradient
        colors={tokens.gradient.warm}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.button}
      >
        <Text style={[styles.label, { color: colors.primaryForeground }]}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: tokens.touch.primaryButton,
    borderRadius: tokens.radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  label: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: tokens.fontSize.body },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
});
