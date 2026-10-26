import type { Ingredient } from "../recipes/ingredient";
import type { Recipe } from "../recipes/recipe";
import { spokenStep } from "./spokenStep";
import { stepIngredients } from "./stepIngredients";
import { stepMinutes } from "./stepMinutes";

/** Lo que propone un temporizador cuando el paso no dice ningún tiempo. */
const DEFAULT_TIMER_MINUTES = 5;

type CookingStep = { text: string; ingredients: Ingredient[] };

export type CookingView = {
  total: number;
  isLast: boolean;
  current: CookingStep;
  next: CookingStep | undefined;
  /** Lo que dice la voz al llegar a este paso. */
  speech: string;
  timer: {
    minutes: number;
    /** Si el tiempo lo dice el paso. Si no, el temporizador se ofrece discreto y en 5 minutos. */
    isFromStep: boolean;
    /** Cómo se llama en la franja de temporizadores: lo primero que usa el paso, o su número. */
    label: string;
  };
};

const capitalized = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1);

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
  const minutes = stepMinutes(current.text);
  const firstIngredient = current.ingredients[0];

  return {
    total,
    isLast: position === total - 1,
    current,
    next: stepAt(position + 1),
    speech: spokenStep(position + 1, current.text, current.ingredients, recipe.locale),
    timer: {
      minutes: minutes ?? DEFAULT_TIMER_MINUTES,
      isFromStep: minutes !== null,
      label:
        firstIngredient === undefined
          ? `Paso ${String(position + 1)}`
          : capitalized(firstIngredient.name),
    },
  };
}
