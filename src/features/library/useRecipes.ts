import type { SavedRecipe } from "@/domain/recipes/savedRecipe";
import { cachedKitchen } from "@/features/offline/cachedKitchen";
import { useCachedRead } from "@/features/offline/useCachedRead";
import { supabaseRecipeStore } from "@/features/recipes/supabaseRecipeStore";

type LoadedRecipes = {
  recipes: SavedRecipe[] | null;
  /** Lo que se ve salió del disco: el servidor no ha contestado. */
  isStale: boolean;
  /** Para releerlas sin salir de la pantalla, después de borrar una o cambiarle la portada. */
  reload: () => void;
};

const NONE: SavedRecipe[] = [];
const readRecipes = (): Promise<SavedRecipe[]> => supabaseRecipeStore.list();

/** Las recetas guardadas, recargadas cada vez que se vuelve a la pantalla. */
export function useRecipes(): LoadedRecipes {
  const { value, isStale, reload } = useCachedRead(cachedKitchen.what.recipes, cachedKitchen.schema.recipes, readRecipes, NONE);

  return { recipes: value, isStale, reload };
}
