import { recipeSchema, type Recipe } from "./recipe";

/** Pone o quita la receta de favoritas. No toca nada más. */
export function toggleRecipeFavorite(recipe: Recipe): Recipe {
  return recipeSchema.parse({
    ...recipe,
    isFavorite: !recipe.isFavorite,
    updatedAt: new Date().toISOString(),
  });
}
