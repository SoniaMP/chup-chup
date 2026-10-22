import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

/** Los dos botones gigantes del modo cocina: atrás redondo, siguiente en píldora. */
export function CookNavigation({
  isFirst,
  isLast,
  onPrevious,
  onNext,
}: {
  isFirst: boolean;
  isLast: boolean;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const colors = useColors();

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Paso anterior"
        accessibilityState={{ disabled: isFirst }}
        disabled={isFirst}
        onPress={onPrevious}
        style={[styles.previous, { backgroundColor: colors.muted }, isFirst && styles.disabled]}
      >
        <Text style={[styles.arrow, { color: colors.foreground }]}>←</Text>
      </Pressable>

      <Pressable accessibilityRole="button" onPress={onNext} style={styles.next}>
        <LinearGradient
          colors={tokens.gradient.warm}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.nextFill}
        >
          <Text style={[styles.nextLabel, { color: colors.primaryForeground }]}>
            {isLast ? "¡Terminado!" : "Siguiente"}
          </Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: tokens.spacing.row + 4, alignItems: "center" },
  previous: {
    width: tokens.touch.cookStepButton,
    height: tokens.touch.cookStepButton,
    borderRadius: tokens.radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: { opacity: 0.4 },
  arrow: { fontFamily: tokens.fontFamily.body, fontSize: 26 },
  next: { flex: 1, height: tokens.touch.cookStepButton },
  nextFill: {
    flex: 1,
    borderRadius: tokens.radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  nextLabel: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: 20 },
});
