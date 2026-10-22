import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View, useColorScheme } from "react-native";

import { EmptyState } from "@/components/EmptyState";
import type { Cookbook } from "@/domain/cookbooks/cookbook";
import type { Recipe } from "@/domain/recipes/recipe";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";
import { RecipeRow } from "./RecipeRow";

const countLabel = (total: number): string =>
  total === 1 ? "1 receta" : `${String(total)} recetas`;

type CookbookListItemProps = {
  cookbook: Cookbook;
  recipes: Recipe[];
  onOpenActions: () => void;
};

/**
 * Un libro de la biblioteca: un rótulo, no un objeto.
 *
 * El libro separa y las recetas mandan, así que el encabezado va sin tarjeta y discreto, y las
 * recetas conservan la suya. El contador va en su propia línea: compartiéndola con el título,
 * un nombre largo no cabe nunca en un móvil.
 *
 * Tocar el encabezado despliega; tocar la portada entra en el libro; dejar el dedo encima abre
 * las acciones del libro, como en las listas de Spotify.
 */
export function CookbookListItem({ cookbook, recipes, onOpenActions }: CookbookListItemProps) {
  const colors = useColors();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const gradient =
    useColorScheme() === "dark" ? tokens.gradient.placeholderDark : tokens.gradient.placeholder;

  return (
    <View style={styles.group}>
      {/* Dos botones hermanos, nunca uno dentro de otro: en web un Pressable es un <button>. */}
      <View style={styles.heading}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Abrir el libro ${cookbook.title}`}
          onPress={() => {
            router.push({ pathname: "/cookbook/[id]", params: { id: cookbook.id } });
          }}
          onLongPress={onOpenActions}
          style={({ pressed }) => pressed && styles.pressed}
        >
          <LinearGradient
            colors={gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cover}
          />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={cookbook.title}
          accessibilityState={{ expanded: isOpen }}
          onPress={() => {
            setIsOpen((open) => !open);
          }}
          onLongPress={onOpenActions}
          style={({ pressed }) => [styles.headingBody, pressed && styles.pressed]}
        >
          <View style={styles.text}>
            <Text numberOfLines={2} style={[styles.title, { color: colors.foreground }]}>
              {cookbook.title}
            </Text>
            <Text style={[styles.count, { color: colors.mutedForeground }]}>
              {countLabel(recipes.length)}
            </Text>
          </View>

          <MaterialIcons
            name={isOpen ? "expand-less" : "expand-more"}
            size={24}
            color={colors.mutedForeground}
          />
        </Pressable>
      </View>

      {isOpen && (
        <View style={styles.children}>
          {recipes.length === 0 && (
            <EmptyState
              isCompact
              title="Este libro está vacío"
              line="Se llena desde la receta, con «Añadir a un libro»."
            />
          )}
          {recipes.map((recipe) => (
            <RecipeRow
              key={recipe.id}
              recipe={recipe}
              onPress={() => {
                router.push({ pathname: "/recipe/[id]", params: { id: recipe.id } });
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { paddingTop: tokens.spacing.row },
  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.spacing.row + 2,
    paddingVertical: tokens.spacing.row,
  },
  headingBody: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.spacing.row + 2,
  },
  pressed: { opacity: 0.85 },
  cover: { width: 44, height: 44, borderRadius: tokens.radius.md },
  text: { flex: 1, gap: 1 },
  title: {
    fontFamily: tokens.fontFamily.display,
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: -0.2,
  },
  count: { fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.label },
  children: { gap: tokens.spacing.row / 2, marginTop: tokens.spacing.row / 2 },
});
