import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View, useColorScheme } from "react-native";

import { EmptyState } from "@/components/EmptyState";
import type { Cookbook } from "@/domain/cookbooks/cookbook";
import type { Recipe } from "@/domain/recipes/recipe";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";
import { RecipeRow } from "./RecipeRow";

const countLabel = (total: number): string =>
  total === 1 ? "Libro · 1 receta" : `Libro · ${String(total)} recetas`;

/** Un libro de la biblioteca, con sus recetas dentro al desplegarlo. */
export function CookbookListItem({ cookbook, recipes }: { cookbook: Cookbook; recipes: Recipe[] }) {
  const colors = useColors();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const gradient =
    useColorScheme() === "dark" ? tokens.gradient.placeholderDark : tokens.gradient.placeholder;

  return (
    <View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={cookbook.title}
        accessibilityState={{ expanded: isOpen }}
        onPress={() => {
          setIsOpen((open) => !open);
        }}
        style={({ pressed }) => [
          styles.row,
          { backgroundColor: colors.card },
          pressed && styles.pressed,
        ]}
      >
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cover}
        />
        <View style={styles.text}>
          <Text numberOfLines={1} style={[styles.title, { color: colors.foreground }]}>
            {cookbook.title}
          </Text>
          <Text style={[styles.summary, { color: colors.mutedForeground }]}>
            {countLabel(recipes.length)}
          </Text>
        </View>
        <MaterialIcons
          name={isOpen ? "expand-less" : "expand-more"}
          size={26}
          color={colors.mutedForeground}
        />
      </Pressable>

      {isOpen && (
        <View style={[styles.children, { borderLeftColor: colors.oliveSoft }]}>
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
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              router.push({ pathname: "/cookbook/[id]", params: { id: cookbook.id } });
            }}
            style={styles.open}
          >
            <Text style={[styles.openLabel, { color: colors.primary }]}>Abrir el libro</Text>
          </Pressable>
        </View>
      )}
    </View>
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
  cover: { width: 64, height: 64, borderRadius: tokens.radius.md },
  text: { flex: 1, gap: 2 },
  title: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: tokens.fontSize.body },
  summary: { fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.label },
  children: {
    marginLeft: tokens.spacing.block,
    paddingLeft: tokens.spacing.row + 4,
    borderLeftWidth: 2,
    gap: tokens.spacing.row / 2,
    paddingVertical: tokens.spacing.row / 2,
  },
  open: { alignSelf: "flex-start", padding: tokens.spacing.row },
  openLabel: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: tokens.fontSize.label },
});
