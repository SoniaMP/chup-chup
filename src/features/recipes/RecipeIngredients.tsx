import { StyleSheet, Text, View } from "react-native";

import type { Recipe } from "@/domain/recipes/recipe";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

const amountOf = (ingredient: Recipe["ingredients"][number]): string => {
  if (ingredient.quantity === undefined) return "";
  const unit = ingredient.unit === undefined ? "" : ` ${ingredient.unit}`;
  return `${String(ingredient.quantity)}${unit}`;
};

/** Los ingredientes de una receta guardada: cantidad en terracota, nombre al lado. */
export function RecipeIngredients({ ingredients }: { ingredients: Recipe["ingredients"] }) {
  const colors = useColors();

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      {ingredients.map((ingredient, index) => (
        <View
          key={`${ingredient.name}-${String(index)}`}
          style={[styles.row, index > 0 && { borderTopWidth: 1, borderTopColor: colors.border }]}
        >
          <Text style={[styles.amount, { color: colors.primary }]}>{amountOf(ingredient)}</Text>
          <Text style={[styles.name, { color: colors.foreground }]}>{ingredient.name}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: tokens.radius.xl, paddingHorizontal: tokens.spacing.gutter },
  row: { flexDirection: "row", gap: tokens.spacing.row + 4, paddingVertical: tokens.spacing.row + 4 },
  amount: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: tokens.fontSize.body, minWidth: 72 },
  name: { flex: 1, fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.body },
});
