import { savedRecipeSchema, type SavedRecipe } from "./savedRecipe";

/**
 * Pone o quita la receta de favoritas. No toca nada más.
 *
 * No marca fecha de modificación: la estrella es tuya, no de la receta, y una receta no cambia
 * porque a alguien le guste.
 */
export function toggleRecipeFavorite(saved: SavedRecipe): SavedRecipe {
  return savedRecipeSchema.parse({ ...saved, isFavorite: !saved.isFavorite });
}
