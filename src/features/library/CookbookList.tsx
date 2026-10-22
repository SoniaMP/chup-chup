import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

import type { Cookbook } from "@/domain/cookbooks/cookbook";
import type { Recipe } from "@/domain/recipes/recipe";
import { tokens } from "@/theme/tokens";
import { CookbookListItem } from "./CookbookListItem";

type CookbookListProps = {
  cookbooks: Cookbook[];
  recipes: Recipe[];
  /** Identificadores de receta por libro, en el orden del libro. */
  membership: Map<string, string[]>;
};

/** La biblioteca: tus libros a lo ancho, cada uno con sus recetas dentro. */
export function CookbookList({ cookbooks, recipes, membership }: CookbookListProps) {
  const byId = useMemo(() => new Map(recipes.map((recipe) => [recipe.id, recipe])), [recipes]);

  return (
    <View style={styles.list}>
      {cookbooks.map((cookbook) => (
        <CookbookListItem
          key={cookbook.id}
          cookbook={cookbook}
          recipes={(membership.get(cookbook.id) ?? [])
            .map((id) => byId.get(id))
            .filter((recipe): recipe is Recipe => recipe !== undefined)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: tokens.spacing.row / 2 },
});
