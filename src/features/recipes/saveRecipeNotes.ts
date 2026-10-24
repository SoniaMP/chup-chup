import type { SavedRecipe } from "@/domain/recipes/savedRecipe";
import { updateRecipeNotes } from "@/domain/recipes/updateRecipeNotes";
import { supabaseRecipeStore } from "./supabaseRecipeStore";

/** Guarda la nota personal de una receta y devuelve la receta ya actualizada. */
export async function saveRecipeNotes(saved: SavedRecipe, notes: string): Promise<SavedRecipe> {
  return supabaseRecipeStore.savePersonal(updateRecipeNotes(saved, notes));
}
