import { StyleSheet, Text, View } from "react-native";

import { recipeFacts } from "@/domain/recipes/recipeFacts";
import type { Recipe } from "@/domain/recipes/recipe";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

/**
 * Preparación · Cocción · Raciones, en los bloques del diseño, solo con lo que la receta dice.
 * Sin nada que contar no se pinta nada: un tiempo que falta no impide cocinar, y un aviso ahí
 * solo es ruido. Para añadirlo está el lápiz de arriba.
 */
export function RecipeFacts({ recipe }: { recipe: Recipe }) {
  const colors = useColors();
  const facts = recipeFacts(recipe);

  if (facts.length === 0) return null;

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
