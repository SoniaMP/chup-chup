import type { SavedRecipe } from "@/domain/recipes/savedRecipe";
import { savedRecipeFromRow } from "@/features/recipes/savedRecipeFromRow";
import { supabase } from "@/lib/supabase";

/**
 * Pone o quita la portada de una receta. No toca su foto: esa manda siempre que exista.
 *
 * La portada es de quien tiene la receta guardada, no de la receta: dos cocineras pueden ponerle
 * caras distintas a la misma.
 */
export async function saveRecipeCover(
  recipeId: string,
  imageId: string | null,
): Promise<SavedRecipe> {
  const { data, error } = await supabase
    .from("saved_recipes")
    .update({ library_image: imageId })
    .eq("recipe_id", recipeId)
    .select("*, recipes (*)")
    .single();

  if (error !== null) throw new Error(error.message);
  return savedRecipeFromRow(data);
}
