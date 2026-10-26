import type { Ingredient } from "../recipes/ingredient";
import { roundScaledQuantity } from "./roundScaledQuantity";

/**
 * El ingrediente para otras raciones. Sin escalar no se redondea nada, para no tocar lo que
 * escribió la cocinera; sin cantidad («sal al gusto») se queda como está.
 */
export function scaleIngredient(ingredient: Ingredient, factor: number): Ingredient {
  if (factor === 1 || ingredient.quantity === undefined) return ingredient;

  const scaled = ingredient.quantity * factor;
  // Las décimas de kilo se arrastran como 1.2000000000000002 si no se cortan aquí.
  const rounded = Number(roundScaledQuantity(scaled, ingredient.unit, ingredient.name).toFixed(2));

  return { ...ingredient, quantity: rounded };
}
