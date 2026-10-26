import { StyleSheet, Text, View } from "react-native";

import { ingredientAmount } from "@/domain/recipes/ingredientAmount";
import type { Ingredient } from "@/domain/recipes/ingredient";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

/**
 * El paso en grande y, debajo, lo que usa con su cantidad: «Sofríe la cebolla» tiene que decir
 * cuánta sin tapar el paso con la lista entera. Se lee a un metro, como el paso.
 */
export function CookStep({ text, ingredients }: { text: string; ingredients: Ingredient[] }) {
  const colors = useColors();

  return (
    <View>
      <Text style={[styles.step, { color: colors.foreground }]}>{text}</Text>
      {ingredients.length > 0 && (
        <View style={styles.ingredients}>
          {ingredients.map((ingredient, index) => (
            <Text key={`${ingredient.name}-${String(index)}`} style={styles.line}>
              <Text style={[styles.amount, { color: colors.primary }]}>
                {ingredientAmount(ingredient)}
              </Text>
              {ingredient.quantity === undefined ? "" : " "}
              <Text style={{ color: colors.foreground }}>{ingredient.name}</Text>
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  step: {
    fontFamily: tokens.fontFamily.bodyStrong,
    fontSize: tokens.fontSize.cookStep,
    lineHeight: 46,
  },
  ingredients: { marginTop: tokens.spacing.block, gap: tokens.spacing.row },
  line: {
    fontFamily: tokens.fontFamily.body,
    fontSize: tokens.fontSize.sectionHeading,
    lineHeight: 32,
  },
  amount: { fontFamily: tokens.fontFamily.bodyStrong },
});
