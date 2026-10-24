import type { RecipeInput } from "@/domain/recipes/recipeInput";
import { recipeWithChanges } from "@/domain/recipes/recipeWithChanges";
import { savedRecipeWith } from "@/domain/recipes/savedRecipeWith";
import type { SavedRecipe } from "@/domain/recipes/savedRecipe";
import { updateRecipeNotes } from "@/domain/recipes/updateRecipeNotes";
import { supabaseRecipeStore } from "./supabaseRecipeStore";

/**
 * Guarda los cambios de una receta que ya existía, sin tocar lo que el formulario no edita.
 *
 * El formulario edita dos cosas que viven en sitios distintos: el contenido de la receta y la
 * nota de quien la tiene guardada. Se guardan por separado, cada una donde le toca.
 */
export async function updateRecipe(id: string, input: RecipeInput): Promise<SavedRecipe> {
  const current = await supabaseRecipeStore.getById(id);
  if (current === null) throw new Error("Esta receta ya no está");

  const recipe = await supabaseRecipeStore.update(recipeWithChanges(current, input));

  return supabaseRecipeStore.savePersonal(
    updateRecipeNotes(savedRecipeWith(current, recipe), input.notes ?? ""),
  );
}
