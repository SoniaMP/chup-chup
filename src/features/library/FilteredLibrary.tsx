import { useState } from "react";
import { StyleSheet, View } from "react-native";

import type { Cookbook } from "@/domain/cookbooks/cookbook";
import type { Recipe } from "@/domain/recipes/recipe";
import { useDisplayName } from "@/features/auth/useDisplayName";
import { RecipeActions } from "@/features/recipes/RecipeActions";
import { tokens } from "@/theme/tokens";
import { CookbookListItem } from "./CookbookListItem";
import { RecipeRow } from "./RecipeRow";

type FilteredLibraryProps = {
  cookbooks: Cookbook[];
  recipeCounts: Map<string, number>;
  recipes: Recipe[];
  onOpenRecipe: (recipeId: string) => void;
  onAddToCookbook: (recipeId: string) => void;
  /** Para releer la cocina cuando una receta se borra o cambia de portada. */
  onChanged: () => void;
};

/**
 * La cocina mientras se busca o se filtra: la misma lista, con lo que no responde quitado de en
 * medio.
 *
 * Ni otra pantalla ni secciones: se escribe y la biblioteca mengua. Los libros van primero por
 * ser menos y llevar a lo demás, y no hacen falta rótulos porque cada tarjeta ya dice lo que es
 * debajo del nombre: «12 recetas» o «5 ingredientes · 40 min».
 *
 * Las recetas traen aquí su menú, como dentro de un libro: lo que se ve se maneja donde se ve.
 */
export function FilteredLibrary({
  cookbooks,
  recipeCounts,
  recipes,
  onOpenRecipe,
  onAddToCookbook,
  onChanged,
}: FilteredLibraryProps) {
  const ownerName = useDisplayName();
  const [chosen, setChosen] = useState<Recipe | null>(null);

  return (
    <View style={styles.list}>
      {cookbooks.map((cookbook) => (
        <CookbookListItem
          key={cookbook.id}
          cookbook={cookbook}
          recipeCount={recipeCounts.get(cookbook.id) ?? 0}
          ownerName={ownerName}
        />
      ))}

      {recipes.map((recipe) => (
        <RecipeRow
          key={recipe.id}
          recipe={recipe}
          onPress={() => {
            onOpenRecipe(recipe.id);
          }}
          onOpenActions={() => {
            setChosen(recipe);
          }}
        />
      ))}

      {chosen !== null && (
        <RecipeActions
          recipeId={chosen.id}
          recipeCover={chosen.libraryImage}
          isOpen
          onClose={() => {
            setChosen(null);
          }}
          onAddToCookbook={() => {
            const recipeId = chosen.id;
            setChosen(null);
            onAddToCookbook(recipeId);
          }}
          onCoverChanged={() => {
            setChosen(null);
            onChanged();
          }}
          onDeleted={() => {
            setChosen(null);
            onChanged();
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: tokens.spacing.row },
});
