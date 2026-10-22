import { recipeSchema, type Recipe } from "./recipe";
import type { RecipeInput } from "./recipeInput";

/**
 * La receta guardada después de editarla.
 *
 * Todo lo que se edita viene del formulario, y lo que no se edita se conserva: identidad,
 * propietaria, fecha de creación, fotos y si es favorita. Se construye campo a campo a propósito:
 * con un `...spread` sobre la receta anterior, vaciar las raciones o los tiempos no las borraría,
 * se quedarían las de antes.
 */
export function recipeWithChanges(recipe: Recipe, input: RecipeInput): Recipe {
  const candidate: Record<string, unknown> = {
    ...input,
    id: recipe.id,
    ownerId: recipe.ownerId,
    createdAt: recipe.createdAt,
    updatedAt: new Date().toISOString(),
    photoActive: recipe.photoActive,
    isFavorite: recipe.isFavorite,
  };

  if (recipe.photoOriginal !== undefined) candidate.photoOriginal = recipe.photoOriginal;
  if (recipe.photoEnhanced !== undefined) candidate.photoEnhanced = recipe.photoEnhanced;

  // Un campo opcional vacío se va, no se queda puesto a `undefined`: en el dominio, opcional
  // significa que la clave no está.
  for (const [field, value] of Object.entries(candidate)) {
    if (value === undefined) delete candidate[field];
  }

  return recipeSchema.parse(candidate);
}
