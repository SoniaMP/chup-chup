import { MaterialIcons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { coverFor } from "@/domain/covers/coverFor";
import type { SavedRecipe } from "@/domain/recipes/savedRecipe";
import { CoverThumbnail } from "@/features/covers/CoverThumbnail";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

const THUMBNAIL_SIZE = 64;

const summaryOf = (recipe: SavedRecipe): string => {
  const parts = [`${String(recipe.ingredients.length)} ingredientes`];
  const total = (recipe.prepMin ?? 0) + (recipe.cookMin ?? 0);
  if (total > 0) parts.push(`${String(total)} min`);
  if (recipe.servings !== undefined) parts.push(`${String(recipe.servings)} raciones`);
  return parts.join(" · ");
};

type RecipeRowProps = {
  recipe: SavedRecipe;
  onPress: () => void;
  /** Las acciones de la receta, por los tres puntos y dejando el dedo encima. */
  onOpenActions?: () => void;
  /** El asa de arrastrar, cuando el libro está en modo reordenar. */
  handle?: ReactNode;
};

/** Una receta en una lista, con su foto, la portada que haya elegido, o el degradado. */
export function RecipeRow({ recipe, onPress, onOpenActions, handle }: RecipeRowProps) {
  const colors = useColors();

  const body = (
    <>
      <CoverThumbnail cover={coverFor(recipe)} size={THUMBNAIL_SIZE} />
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
    </>
  );

  const card = [styles.row, { backgroundColor: colors.card, borderColor: colors.border }];

  if (handle !== undefined) {
    return (
      <View style={card}>
        {body}
        {handle}
      </View>
    );
  }

  // Dos botones hermanos, nunca uno dentro de otro: en web un Pressable es un <button>.
  return (
    <View style={card}>
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        onLongPress={onOpenActions}
        style={({ pressed }) => [styles.main, pressed && styles.pressed]}
      >
        {body}
      </Pressable>

      {onOpenActions !== undefined && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Acciones de ${recipe.title}`}
          onPress={onOpenActions}
          style={({ pressed }) => [styles.actions, pressed && styles.pressed]}
        >
          <MaterialIcons name="more-vert" size={22} color={colors.mutedForeground} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.spacing.row + 4,
    // Pegada al contenido: lo que llena la fila es la portada y el texto, no el aire de alrededor.
    padding: tokens.spacing.row,
    borderRadius: tokens.radius.card,
    // El mismo filo y el mismo relleno que la tarjeta del libro: todo lo que es una tarjeta se
    // dibuja igual, y la lista no salta al pasar de libros a recetas.
    borderWidth: 1,
  },
  main: { flex: 1, flexDirection: "row", alignItems: "center", gap: tokens.spacing.row + 4 },
  actions: { width: 36, height: 44, alignItems: "center", justifyContent: "center" },
  pressed: { opacity: 0.85 },
  text: { flex: 1, gap: 2 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: tokens.spacing.row - 2 },
  title: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: tokens.fontSize.body },
  summary: { fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.label },
});
