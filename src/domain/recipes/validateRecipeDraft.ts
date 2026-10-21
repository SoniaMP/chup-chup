import { recipeInputSchema, type RecipeInput } from "./recipeInput";
import type { RecipeDraft } from "./recipeDraft";

export type DraftIssue = { field: string; message: string };

export type DraftValidation =
  | { ok: true; value: RecipeInput }
  | { ok: false; issues: DraftIssue[] };

const textOrNothing = (value: string): string | undefined => {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

/** Una fila del formulario que no se ha tocado. Se descarta en vez de dar error. */
const isBlankIngredient = (ingredient: RecipeDraft["ingredients"][number]): boolean =>
  ingredient.name.trim() === "" &&
  ingredient.quantity === null &&
  ingredient.unit.trim() === "" &&
  ingredient.note.trim() === "";

/**
 * Convierte el borrador de pantalla en una receta lista para guardar, o dice qué falta.
 * Es lo que decide si el botón de guardar está activo y qué errores se pintan en el formulario.
 */
export function validateRecipeDraft(draft: RecipeDraft): DraftValidation {
  const candidate = {
    title: draft.title,
    locale: draft.locale,
    rawInput: draft.rawInput,
    servings: draft.servings ?? undefined,
    prepMin: draft.prepMin ?? undefined,
    cookMin: draft.cookMin ?? undefined,
    notes: textOrNothing(draft.notes),
    ingredients: draft.ingredients.filter((i) => !isBlankIngredient(i)).map((ingredient) => ({
      name: ingredient.name,
      quantity: ingredient.quantity ?? undefined,
      unit: textOrNothing(ingredient.unit),
      note: textOrNothing(ingredient.note),
    })),
    steps: draft.steps.filter((step) => step.text.trim() !== ""),
  };

  const result = recipeInputSchema.safeParse(candidate);
  if (result.success) return { ok: true, value: result.data };

  return {
    ok: false,
    issues: result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    })),
  };
}
