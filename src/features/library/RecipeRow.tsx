import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View, useColorScheme } from "react-native";

import type { Recipe } from "@/domain/recipes/recipe";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

const summaryOf = (recipe: Recipe): string => {
  const parts = [`${String(recipe.ingredients.length)} ingredientes`];
  const total = (recipe.prepMin ?? 0) + (recipe.cookMin ?? 0);
  if (total > 0) parts.push(`${String(total)} min`);
  if (recipe.servings !== undefined) parts.push(`${String(recipe.servings)} raciones`);
  return parts.join(" · ");
};

/** Una receta en la lista de Mi cocina. Sin foto todavía: miniatura en degradado. */
export function RecipeRow({ recipe, onPress }: { recipe: Recipe; onPress: () => void }) {
  const colors = useColors();
  const gradient =
    useColorScheme() === "dark" ? tokens.gradient.placeholderDark : tokens.gradient.placeholder;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.row, { backgroundColor: colors.card }, pressed && styles.pressed]}
    >
      <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.thumbnail} />
      <View style={styles.text}>
        <Text numberOfLines={1} style={[styles.title, { color: colors.foreground }]}>
          {recipe.title}
        </Text>
        <Text numberOfLines={1} style={[styles.summary, { color: colors.mutedForeground }]}>
          {summaryOf(recipe)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.spacing.row + 4,
    padding: tokens.spacing.row + 2,
    borderRadius: tokens.radius.xl,
  },
  pressed: { opacity: 0.85 },
  thumbnail: { width: 64, height: 64, borderRadius: tokens.radius.md },
  text: { flex: 1, gap: 2 },
  title: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: tokens.fontSize.body },
  summary: { fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.label },
});
