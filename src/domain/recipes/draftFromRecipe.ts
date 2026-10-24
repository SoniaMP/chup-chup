import type { SavedRecipe } from "./savedRecipe";
import type { RecipeDraft } from "./recipeDraft";

/**
 * Abre una receta ya guardada en el formulario editable: lo que allí es "no tiene" (`undefined`)
 * aquí es "sin rellenar" (`null` o cadena vacía).
 *
 * Sin suposiciones: son cosa de la IA al estructurar, y esto es una edición a mano.
 *
 * Recibe la receta guardada, no solo su contenido, porque el formulario también edita la nota
 * personal, que ya no vive dentro de la receta.
 */
export function draftFromRecipe(recipe: SavedRecipe): RecipeDraft {
  return {
    title: recipe.title,
    locale: recipe.locale,
    rawInput: recipe.rawInput,
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
    notes: recipe.notes ?? "",
    assumptions: [],
  };
}
