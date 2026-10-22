import type { Recipe } from "@/domain/recipes/recipe";
import { updateRecipeNotes } from "@/domain/recipes/updateRecipeNotes";
import { localRecipeStore } from "./localRecipeStore";

/** Guarda la nota personal de una receta y devuelve la receta ya actualizada. */
export async function saveRecipeNotes(recipe: Recipe, notes: string): Promise<Recipe> {
  const updated = updateRecipeNotes(recipe, notes);
  await localRecipeStore.update(updated);
  return updated;
}
