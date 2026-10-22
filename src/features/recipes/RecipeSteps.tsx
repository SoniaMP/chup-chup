import { StyleSheet, Text, View } from "react-native";

import type { Recipe } from "@/domain/recipes/recipe";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

/** Los pasos de una receta guardada, numerados y separados. */
export function RecipeSteps({ steps }: { steps: Recipe["steps"] }) {
  const colors = useColors();

  return (
    <View>
      {steps.map((step, index) => (
        <View
          key={`${String(index)}-${step.text.slice(0, 12)}`}
          style={[styles.step, index > 0 && { borderTopWidth: 1, borderTopColor: colors.border }]}
        >
          <View style={[styles.number, { backgroundColor: colors.oliveSoft }]}>
            <Text style={[styles.numberText, { color: colors.olive }]}>{index + 1}</Text>
          </View>
          <Text style={[styles.text, { color: colors.foreground }]}>{step.text}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  step: {
    flexDirection: "row",
    gap: tokens.spacing.row + 4,
    paddingVertical: tokens.spacing.row + 6,
  },
  number: {
    width: 32,
    height: 32,
    borderRadius: tokens.radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  numberText: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: tokens.fontSize.body },
  text: { flex: 1, fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.body, lineHeight: 28 },
});
