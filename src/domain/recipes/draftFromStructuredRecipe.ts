import type { RecipeDraft } from "./recipeDraft";
import type { StructuredRecipe } from "./structuredRecipe";

/**
 * Pasa la respuesta de la IA al borrador editable: lo que allí es "no viene" (`undefined`)
 * aquí es "sin rellenar" (`null` o cadena vacía), que es lo que entienden los campos.
 */
export function draftFromStructuredRecipe(recipe: StructuredRecipe, rawInput: string): RecipeDraft {
  return {
    title: recipe.title,
    locale: recipe.locale,
    rawInput,
    servings: recipe.servings ?? null,
    prepMin: recipe.prepMin ?? null,
    cookMin: recipe.cookMin ?? null,
    ingredients: recipe.ingredients.map((ingredient) => ({
      name: ingredient.name,
      quantity: ingredient.quantity ?? null,
      unit: ingredient.unit ?? "",
      note: ingredient.note ?? "",
    })),
    steps: recipe.steps.map((step) => ({ text: step.text })),
    notes: "",
    assumptions: recipe.assumptions,
  };
}
