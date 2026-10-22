import { StyleSheet, Text, View } from "react-native";

import type { Recipe } from "@/domain/recipes/recipe";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

const show = (value: number | undefined, suffix: string): string =>
  value === undefined ? "—" : `${String(value)}${suffix}`;

/** Preparación · Cocción · Raciones, en los tres bloques del diseño. */
export function RecipeFacts({ recipe }: { recipe: Recipe }) {
  const colors = useColors();
  const facts = [
    { label: "Preparación", value: show(recipe.prepMin, " min") },
    { label: "Cocción", value: show(recipe.cookMin, " min") },
    { label: "Raciones", value: show(recipe.servings, "") },
  ];

  return (
    <View style={styles.row}>
      {facts.map((fact) => (
        <View key={fact.label} style={[styles.block, { backgroundColor: colors.muted }]}>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>{fact.label}</Text>
          <Text style={[styles.value, { color: colors.foreground }]}>{fact.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: tokens.spacing.row },
  block: { flex: 1, borderRadius: tokens.radius.lg, padding: tokens.spacing.row + 4 },
  label: { fontFamily: tokens.fontFamily.body, fontSize: 12, marginBottom: 2 },
  value: { fontFamily: tokens.fontFamily.display, fontSize: tokens.fontSize.sectionHeading },
});
