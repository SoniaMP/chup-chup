import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import type { ReactNode } from "react";
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

type RecipeRowProps = {
  recipe: Recipe;
  onPress: () => void;
  onLongPress?: () => void;
  /** El asa de arrastrar, cuando el libro está en modo reordenar. */
  handle?: ReactNode;
};

/** Una receta en la lista de la pantalla principal. Sin foto todavía: miniatura en degradado. */
export function RecipeRow({ recipe, onPress, onLongPress, handle }: RecipeRowProps) {
  const colors = useColors();
  const gradient =
    useColorScheme() === "dark" ? tokens.gradient.placeholderDark : tokens.gradient.placeholder;

  const body = (
    <>
      <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.thumbnail} />
      <View style={styles.text}>
        <View style={styles.titleRow}>
          <Text numberOfLines={1} style={[styles.title, { color: colors.foreground }]}>
            {recipe.title}
          </Text>
          {recipe.isFavorite && <MaterialIcons name="favorite" size={16} color={colors.primary} />}
        </View>
        <Text numberOfLines={1} style={[styles.summary, { color: colors.mutedForeground }]}>
          {summaryOf(recipe)}
        </Text>
      </View>
      {handle}
    </>
  );

  if (handle !== undefined) {
    return (
      <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {body}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: colors.card, borderColor: colors.border },
        pressed && styles.pressed,
      ]}
    >
      {body}
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
    // El mismo filo que la tarjeta del libro: todo lo que es una tarjeta se dibuja igual.
    borderWidth: 1,
  },
  pressed: { opacity: 0.85 },
  thumbnail: { width: 64, height: 64, borderRadius: tokens.radius.md },
  text: { flex: 1, gap: 2 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: tokens.spacing.row - 2 },
  title: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: tokens.fontSize.body },
  summary: { fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.label },
});
