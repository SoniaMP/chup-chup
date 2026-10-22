import { Pressable, StyleSheet, Text, View } from "react-native";

import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

/** La barra que recuerda cómo se ordena y deja salir del modo. */
export function ReorderBar({ hint, onDone }: { hint: string; onDone: () => void }) {
  const colors = useColors();

  return (
    <View style={styles.bar}>
      <Text style={[styles.hint, { color: colors.mutedForeground }]}>{hint}</Text>
      <Pressable
        accessibilityRole="button"
        onPress={onDone}
        style={({ pressed }) => [
          styles.done,
          { backgroundColor: colors.primary },
          pressed && styles.pressed,
        ]}
      >
        <Text style={[styles.label, { color: colors.primaryForeground }]}>Hecho</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: tokens.spacing.row,
    paddingBottom: tokens.spacing.row,
  },
  hint: { flex: 1, fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.label },
  done: {
    height: tokens.touch.headerButton,
    paddingHorizontal: tokens.spacing.block,
    borderRadius: tokens.radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: { opacity: 0.9 },
  label: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: tokens.fontSize.body },
});
