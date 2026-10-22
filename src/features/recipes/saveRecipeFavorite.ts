import type { Recipe } from "@/domain/recipes/recipe";
import { toggleRecipeFavorite } from "@/domain/recipes/toggleRecipeFavorite";
import { supabaseRecipeStore } from "./supabaseRecipeStore";

/** Cambia si la receta es favorita y devuelve la receta ya actualizada. */
export async function saveRecipeFavorite(recipe: Recipe): Promise<Recipe> {
  return supabaseRecipeStore.update(toggleRecipeFavorite(recipe));
}
