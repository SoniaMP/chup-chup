import { Pressable, StyleSheet, Text, View } from "react-native";

import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

/** Lo que la app cuenta después de hacer algo, cuando el resultado no se ve solo. */
export function Notice({ text, onDismiss }: { text: string; onDismiss: () => void }) {
  const colors = useColors();

  return (
    <View style={[styles.card, { backgroundColor: colors.muted }]}>
      <Text style={[styles.text, { color: colors.foreground }]}>{text}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Entendido"
        onPress={onDismiss}
        style={({ pressed }) => [styles.dismiss, pressed && styles.pressed]}
      >
        <Text style={[styles.dismissLabel, { color: colors.primary }]}>Vale</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.spacing.row,
    padding: tokens.spacing.row + 4,
    borderRadius: tokens.radius.lg,
    marginBottom: tokens.spacing.row,
  },
  text: { flex: 1, fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.label, lineHeight: 20 },
  dismiss: { paddingHorizontal: tokens.spacing.row, paddingVertical: 4 },
  pressed: { opacity: 0.7 },
  dismissLabel: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: tokens.fontSize.label },
});
