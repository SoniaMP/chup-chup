import type { Recipe } from "./recipe";
import { savedRecipeSchema, type SavedRecipe } from "./savedRecipe";

/**
 * La misma receta de tu cocina, con el contenido recién cambiado.
 *
 * El contenido se sustituye entero y lo personal se conserva. No vale un `...spread` de lo viejo
 * con lo nuevo encima: lo que se ha vaciado al editar —las raciones, un tiempo, la foto— no
 * aparece en lo nuevo, así que el valor anterior se quedaría puesto.
 */
export function savedRecipeWith(saved: SavedRecipe, recipe: Recipe): SavedRecipe {
  const candidate: Record<string, unknown> = {
    ...recipe,
    isFavorite: saved.isFavorite,
    savedAt: saved.savedAt,
  };

  if (saved.notes !== undefined) candidate.notes = saved.notes;
  if (saved.libraryImage !== undefined) candidate.libraryImage = saved.libraryImage;

  return savedRecipeSchema.parse(candidate);
}
