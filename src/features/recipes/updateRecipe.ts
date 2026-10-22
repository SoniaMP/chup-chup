import type { Recipe } from "@/domain/recipes/recipe";
import type { RecipeInput } from "@/domain/recipes/recipeInput";
import { recipeWithChanges } from "@/domain/recipes/recipeWithChanges";
import { supabaseRecipeStore } from "./supabaseRecipeStore";

/** Guarda los cambios de una receta que ya existía, sin tocar lo que el formulario no edita. */
export async function updateRecipe(id: string, input: RecipeInput): Promise<Recipe> {
  const current = await supabaseRecipeStore.getById(id);
  if (current === null) throw new Error("Esta receta ya no está");

  return supabaseRecipeStore.update(recipeWithChanges(current, input));
}
