import { StyleSheet, Text, View } from "react-native";

import { ingredientAmount } from "@/domain/recipes/ingredientAmount";
import type { Ingredient } from "@/domain/recipes/ingredient";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

const amountAndName = (ingredient: Ingredient): string =>
  [ingredientAmount(ingredient), ingredient.name].filter((part) => part !== "").join(" ");

/**
 * El paso siguiente en pequeño, encima de los botones, para ir preparándolo mientras se sofríe
 * el actual. Con sus cantidades, que es lo que hace falta para adelantarlo.
 */
export function CookNextStep({ text, ingredients }: { text: string; ingredients: Ingredient[] }) {
  const colors = useColors();
  const details = [text, ...ingredients.map(amountAndName)].join(" · ");

  return (
    <View style={[styles.box, { borderTopColor: colors.border }]}>
      <Text style={[styles.label, { color: colors.mutedForeground }]}>DESPUÉS</Text>
      <Text numberOfLines={2} style={[styles.text, { color: colors.mutedForeground }]}>
        {details}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: "row",
    gap: tokens.spacing.row + 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: tokens.spacing.row + 4,
    marginBottom: tokens.spacing.row + 4,
  },
  label: {
    fontFamily: tokens.fontFamily.bodyStrong,
    fontSize: tokens.fontSize.label,
    letterSpacing: 0.6,
  },
  text: {
    flex: 1,
    fontFamily: tokens.fontFamily.body,
    fontSize: tokens.fontSize.label,
    lineHeight: 20,
  },
});
