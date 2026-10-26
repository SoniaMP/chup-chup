import type { Ingredient } from "../recipes/ingredient";
import type { Recipe } from "../recipes/recipe";
import { spokenStep } from "./spokenStep";
import { stepIngredients } from "./stepIngredients";

type CookingStep = { text: string; ingredients: Ingredient[] };

export type CookingView = {
  total: number;
  isLast: boolean;
  current: CookingStep;
  next: CookingStep | undefined;
  /** Lo que dice la voz al llegar a este paso. */
  speech: string;
};

/**
 * Lo que enseña y lo que dice el modo cocina en un paso: el paso con sus cantidades, el siguiente
 * con las suyas y la frase para la voz. Sin pasos no hay nada que cocinar, y devuelve null.
 */
export function cookingView(
  recipe: Pick<Recipe, "steps" | "ingredients" | "locale">,
  index: number,
): CookingView | null {
  const total = recipe.steps.length;
  if (total === 0) return null;

  const position = Math.min(Math.max(index, 0), total - 1);
  const stepAt = (at: number): CookingStep | undefined => {
    const step = recipe.steps[at];
    return step === undefined
      ? undefined
      : { text: step.text, ingredients: stepIngredients(step.text, recipe.ingredients) };
  };
  const current = stepAt(position) ?? { text: "", ingredients: [] };

  return {
    total,
    isLast: position === total - 1,
    current,
    next: stepAt(position + 1),
    speech: spokenStep(position + 1, current.text, current.ingredients, recipe.locale),
  };
}
