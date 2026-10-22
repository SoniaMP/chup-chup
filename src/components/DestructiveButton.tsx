import { Pressable, StyleSheet, Text } from "react-native";

import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

/** La misma píldora que el botón principal, en rojo: lo que no tiene vuelta se ve venir. */
export function DestructiveButton({ label, onPress }: { label: string; onPress: () => void }) {
  const colors = useColors();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: colors.destructive },
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.label, { color: colors.primaryForeground }]}>{label}</Text>
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
  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
  label: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: tokens.fontSize.body },
});
