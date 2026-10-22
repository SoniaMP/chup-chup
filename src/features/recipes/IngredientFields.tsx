import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import type { RecipeDraft } from "@/domain/recipes/recipeDraft";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";
import { webFocusReset } from "@/theme/webFocusReset";
import { numberFromText } from "./numberFromText";

type Ingredients = RecipeDraft["ingredients"];

const EMPTY = { name: "", quantity: null, unit: "", note: "" };

/** Los ingredientes del borrador, con la cantidad y la unidad separadas del nombre. */
export function IngredientFields({
  ingredients,
  onChange,
}: {
  ingredients: Ingredients;
  onChange: (ingredients: Ingredients) => void;
}) {
  const colors = useColors();

  const replace = (index: number, patch: Partial<Ingredients[number]>): void => {
    onChange(ingredients.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  return (
    <View style={styles.list}>
      {ingredients.map((ingredient, index) => (
        <View key={index} style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TextInput
            value={ingredient.quantity === null ? "" : String(ingredient.quantity)}
            onChangeText={(text) => {
              replace(index, { quantity: numberFromText(text) });
            }}
            keyboardType="decimal-pad"
            placeholder="—"
            placeholderTextColor={colors.mutedForeground}
            style={[styles.quantity, webFocusReset, { color: colors.primary }]}
          />
          <TextInput
            value={ingredient.unit}
            onChangeText={(unit) => {
              replace(index, { unit });
            }}
            placeholder="ud"
            placeholderTextColor={colors.mutedForeground}
            style={[styles.unit, webFocusReset, { color: colors.mutedForeground }]}
          />
          <TextInput
            value={ingredient.name}
            onChangeText={(name) => {
              replace(index, { name });
            }}
            placeholder="ingrediente"
            placeholderTextColor={colors.mutedForeground}
            style={[styles.name, webFocusReset, { color: colors.foreground }]}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Quitar ${ingredient.name || "ingrediente"}`}
            onPress={() => {
              onChange(ingredients.filter((_, i) => i !== index));
            }}
            style={styles.remove}
          >
            <Text style={[styles.removeMark, { color: colors.mutedForeground }]}>×</Text>
          </Pressable>
        </View>
      ))}

      <Pressable
        accessibilityRole="button"
        onPress={() => {
          onChange([...ingredients, EMPTY]);
        }}
      >
        <Text style={[styles.add, { color: colors.primary }]}>+ Añadir ingrediente</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: tokens.spacing.row / 2 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.spacing.row,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    paddingHorizontal: tokens.spacing.row + 4,
    minHeight: tokens.touch.headerButton,
  },
  quantity: { width: 52, fontFamily: tokens.fontFamily.bodyStrong, fontSize: tokens.fontSize.body },
  unit: { width: 64, fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.label },
  name: { flex: 1, fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.body },
  remove: { width: 28, alignItems: "center" },
  removeMark: { fontFamily: tokens.fontFamily.body, fontSize: 20 },
  add: {
    fontFamily: tokens.fontFamily.bodyStrong,
    fontSize: tokens.fontSize.label,
    paddingVertical: tokens.spacing.row + 4,
  },
});
