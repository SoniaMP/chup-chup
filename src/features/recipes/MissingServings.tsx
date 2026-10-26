import { Pressable, StyleSheet, Text, View } from "react-native";

import type { SavedRecipe } from "@/domain/recipes/savedRecipe";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";
import { useOpenRecipeEditor } from "./useOpenRecipeEditor";

/**
 * Lo que sale en lugar del selector de raciones cuando la receta no dice para cuántas es: sin
 * ese número no hay de dónde escalar. Decirlo es editar la receta.
 */
export function MissingServings({ recipe }: { recipe: SavedRecipe }) {
  const colors = useColors();
  const openEditor = useOpenRecipeEditor();

  return (
    <View style={styles.row}>
      <Text style={[styles.text, { color: colors.mutedForeground }]}>
        Esta receta no dice para cuántas personas es.
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          void openEditor(recipe);
        }}
      >
        <Text style={[styles.action, { color: colors.primary }]}>Decirlo</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: tokens.spacing.row },
  text: { flex: 1, fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.label },
  action: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: tokens.fontSize.label },
});
