import type { Ingredient } from "../recipes/ingredient";
import { scaleIngredient } from "./scaleIngredient";

/**
 * Los ingredientes para otras raciones. Si la receta no dice para cuántas es, no hay de dónde
 * escalar y se devuelven tal cual.
 */
export function scaledIngredients(
  ingredients: Ingredient[],
  originalServings: number | undefined,
  chosenServings: number,
): Ingredient[] {
  if (originalServings === undefined) return ingredients;

  const factor = chosenServings / originalServings;
  return ingredients.map((ingredient) => scaleIngredient(ingredient, factor));
}
