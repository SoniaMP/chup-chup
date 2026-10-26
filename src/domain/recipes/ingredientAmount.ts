import type { Ingredient } from "./ingredient";
import { quantityText } from "./quantityText";

/** «1½ cda», «250 g», «3»; vacío cuando no hay cantidad («sal al gusto»). */
export function ingredientAmount(ingredient: Ingredient): string {
  if (ingredient.quantity === undefined) return "";
  const unit = ingredient.unit === undefined ? "" : ` ${ingredient.unit}`;
  return `${quantityText(ingredient.quantity)}${unit}`;
}
