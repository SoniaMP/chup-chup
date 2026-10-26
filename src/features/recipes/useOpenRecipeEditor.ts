import { useRouter } from "expo-router";

import { draftFromRecipe } from "@/domain/recipes/draftFromRecipe";
import type { SavedRecipe } from "@/domain/recipes/savedRecipe";
import { draftStore } from "@/features/drafts/draftStore";

/** Abre la receta en el mismo formulario de la revisión, pero para cambiarla. */
export function useOpenRecipeEditor(): (recipe: SavedRecipe) => Promise<void> {
  const router = useRouter();

  return async (recipe) => {
    const draftId = await draftStore.create(draftFromRecipe(recipe));
    router.push({ pathname: "/review", params: { draftId, recipeId: recipe.id } });
  };
}
