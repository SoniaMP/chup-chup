import { StyleSheet, View } from "react-native";

import type { Cookbook } from "@/domain/cookbooks/cookbook";
import type { Recipe } from "@/domain/recipes/recipe";
import { tokens } from "@/theme/tokens";
import { CookbookListItem } from "./CookbookListItem";
import { RecipeRow } from "./RecipeRow";

type FilteredLibraryProps = {
  cookbooks: Cookbook[];
  recipeCounts: Map<string, number>;
  recipes: Recipe[];
  onOpenRecipe: (recipeId: string) => void;
};

/**
 * La cocina mientras se busca: la misma lista, con lo que no responde quitado de en medio.
 *
 * Ni otra pantalla ni secciones: se escribe y la biblioteca mengua. Los libros van primero por
 * ser menos y llevar a lo demás, y no hacen falta rótulos porque cada tarjeta ya dice lo que es
 * debajo del nombre: «12 recetas» o «5 ingredientes · 40 min».
 */
export function FilteredLibrary({
  cookbooks,
  recipeCounts,
  recipes,
  onOpenRecipe,
}: FilteredLibraryProps) {
  return (
    <View style={styles.list}>
      {cookbooks.map((cookbook) => (
        <CookbookListItem
          key={cookbook.id}
          cookbook={cookbook}
          recipeCount={recipeCounts.get(cookbook.id) ?? 0}
        />
      ))}

      {recipes.map((recipe) => (
        <RecipeRow
          key={recipe.id}
          recipe={recipe}
          onPress={() => {
            onOpenRecipe(recipe.id);
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: tokens.spacing.row },
});
