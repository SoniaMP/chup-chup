import type { Recipe } from "@/domain/recipes/recipe";
import { recipeFromRow } from "@/features/recipes/recipeFromRow";
import { supabase } from "@/lib/supabase";

/** Pone o quita la portada de una receta. No toca su foto: esa manda siempre que exista. */
export async function saveRecipeCover(recipeId: string, imageId: string | null): Promise<Recipe> {
  const { data, error } = await supabase
    .from("recipes")
    .update({ library_image: imageId })
    .eq("id", recipeId)
    .select("*")
    .single();

  if (error !== null) throw new Error(error.message);
  return recipeFromRow(data);
}
