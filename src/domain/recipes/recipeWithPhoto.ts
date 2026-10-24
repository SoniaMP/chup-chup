import { recipeSchema, type Recipe } from "./recipe";

/**
 * La receta con su foto recién puesta.
 *
 * La foto nueva manda y se enseña sin retocar: si había una mejorada, deja de ser la activa,
 * porque era el retoque de otra foto.
 */
export function recipeWithPhoto(recipe: Recipe, path: string): Recipe {
  const candidate: Record<string, unknown> = {
    ...recipe,
    photoOriginal: path,
    photoActive: "original",
    updatedAt: new Date().toISOString(),
  };
  delete candidate.photoEnhanced;

  return recipeSchema.parse(candidate);
}
