import { recipePhotoPath } from "@/domain/photos/recipePhotoPath";
import { recipeWithPhoto } from "@/domain/recipes/recipeWithPhoto";
import type { SavedRecipe } from "@/domain/recipes/savedRecipe";
import { savedRecipeWith } from "@/domain/recipes/savedRecipeWith";
import { supabaseRecipeStore } from "@/features/recipes/supabaseRecipeStore";
import { signedPhotoCache } from "./signedPhotoCache";
import { supabaseRecipePhotoStore } from "./supabaseRecipePhotoStore";

/**
 * Sube la foto y la cuelga de la receta.
 *
 * Primero el fichero y después la fila: si la subida falla, la receta sigue apuntando a la foto
 * que tenía, y no a una que no existe. La ruta no cambia al cambiar de foto, así que hay que
 * olvidar la firma vieja o se seguiría viendo la anterior.
 */
export async function saveRecipePhoto(saved: SavedRecipe, base64: string): Promise<SavedRecipe> {
  const path = recipePhotoPath(saved.ownerId, saved.id, "original");

  await supabaseRecipePhotoStore.upload(path, base64);
  signedPhotoCache.forget(path);

  return savedRecipeWith(saved, await supabaseRecipeStore.update(recipeWithPhoto(saved, path)));
}
