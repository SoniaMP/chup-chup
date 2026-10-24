import { recipeWithoutPhoto } from "@/domain/recipes/recipeWithoutPhoto";
import type { SavedRecipe } from "@/domain/recipes/savedRecipe";
import { savedRecipeWith } from "@/domain/recipes/savedRecipeWith";
import { supabaseRecipeStore } from "@/features/recipes/supabaseRecipeStore";
import { signedPhotoCache } from "./signedPhotoCache";
import { supabaseRecipePhotoStore } from "./supabaseRecipePhotoStore";

/**
 * Quita la foto de la receta y borra los ficheros.
 *
 * Primero la fila y después los ficheros: al revés, si el borrado de la fila fallara, la receta
 * se quedaría apuntando a una foto que ya no está.
 */
export async function removeRecipePhoto(saved: SavedRecipe): Promise<SavedRecipe> {
  const paths = [saved.photoOriginal, saved.photoEnhanced].filter(
    (path): path is string => path !== undefined,
  );

  const updated = savedRecipeWith(saved, await supabaseRecipeStore.update(recipeWithoutPhoto(saved)));

  await supabaseRecipePhotoStore.remove(paths);
  for (const path of paths) signedPhotoCache.forget(path);

  return updated;
}
