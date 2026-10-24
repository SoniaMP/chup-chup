import type { SavedRecipe } from "@/domain/recipes/savedRecipe";
import { toggleRecipeFavorite } from "@/domain/recipes/toggleRecipeFavorite";
import { supabaseRecipeStore } from "./supabaseRecipeStore";

/** Cambia si la receta es favorita y devuelve la receta ya actualizada. */
export async function saveRecipeFavorite(saved: SavedRecipe): Promise<SavedRecipe> {
  return supabaseRecipeStore.savePersonal(toggleRecipeFavorite(saved));
}
