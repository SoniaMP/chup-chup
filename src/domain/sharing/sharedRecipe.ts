import type { Ingredient } from "../recipes/ingredient.ts";
import type { Step } from "../recipes/step.ts";

/**
 * Lo que de una receta sale al mundo cuando se comparte.
 *
 * El visor es público, así que esto es una lista cerrada y no un `Recipe` con cosas quitadas: lo
 * que no esté aquí no puede escaparse por descuido el día que la receta crezca. Fuera quedan la
 * nota personal, el texto en bruto con el que se creó, la estrella y la portada del catálogo.
 */
export type SharedRecipe = {
  title: string;
  /** El idioma en que se escribió, para que la página lo declare y no mienta. */
  locale: string;
  /** Con qué nombre se firma. `null` cuando no hay forma de saberlo. */
  author: string | null;
  servings: number | undefined;
  prepMin: number | undefined;
  cookMin: number | undefined;
  ingredients: Ingredient[];
  steps: Step[];
  /** La foto ya firmada, que caduca. `undefined` si la receta no tiene. */
  photoUrl: string | undefined;
};

type Content = {
  title: string;
  locale: string;
  servings?: number | undefined;
  prepMin?: number | undefined;
  cookMin?: number | undefined;
  ingredients: Ingredient[];
  steps: Step[];
};

/** Elige campo a campo lo que viaja. Todo lo demás se queda en casa. */
export function sharedRecipeFrom(
  content: Content,
  author: string | null,
  photoUrl: string | undefined,
): SharedRecipe {
  return {
    title: content.title,
    locale: content.locale,
    author,
    servings: content.servings,
    prepMin: content.prepMin,
    cookMin: content.cookMin,
    ingredients: content.ingredients,
    steps: content.steps,
    photoUrl,
  };
}
