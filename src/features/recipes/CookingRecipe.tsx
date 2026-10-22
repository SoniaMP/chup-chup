import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, StyleSheet, Text, View, useColorScheme } from "react-native";

import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

/** La espera mientras se estructura el texto. */
export function CookingRecipe() {
  const colors = useColors();
  const gradient =
    useColorScheme() === "dark" ? tokens.gradient.placeholderDark : tokens.gradient.placeholder;

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 0.8, y: 1 }} style={styles.circle}>
        <ActivityIndicator size="large" color={colors.primary} />
      </LinearGradient>
      <Text style={[styles.title, { color: colors.foreground }]}>Cocinando tu receta…</Text>
      <Text style={[styles.line, { color: colors.mutedForeground }]}>
        Ordenando ingredientes, calculando tiempos y afinando cantidades.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", gap: tokens.spacing.row + 4 },
  circle: {
    width: 144,
    height: 144,
    borderRadius: tokens.radius.pill,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: tokens.spacing.row,
  },
  title: { fontFamily: tokens.fontFamily.display, fontSize: tokens.fontSize.sectionHeading },
  line: {
    fontFamily: tokens.fontFamily.body,
    fontSize: tokens.fontSize.body,
    textAlign: "center",
    maxWidth: 280,
    lineHeight: 24,
  },
});
