import type { Recipe } from "@/domain/recipes/recipe";
import { updateRecipeNotes } from "@/domain/recipes/updateRecipeNotes";
import { supabaseRecipeStore } from "./supabaseRecipeStore";

/** Guarda la nota personal de una receta y devuelve la receta ya actualizada. */
export async function saveRecipeNotes(recipe: Recipe, notes: string): Promise<Recipe> {
  return supabaseRecipeStore.update(updateRecipeNotes(recipe, notes));
}
