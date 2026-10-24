import { recipeSchema, type Recipe } from "./recipe";

/** La receta sin foto: se van las dos, la que se hizo y la retocada. */
export function recipeWithoutPhoto(recipe: Recipe): Recipe {
  const candidate: Record<string, unknown> = {
    ...recipe,
    photoActive: "original",
    updatedAt: new Date().toISOString(),
  };
  delete candidate.photoOriginal;
  delete candidate.photoEnhanced;

  return recipeSchema.parse(candidate);
}
