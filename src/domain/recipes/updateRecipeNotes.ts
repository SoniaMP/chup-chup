import { recipeSchema, type Recipe } from "./recipe";

/**
 * Cambia la nota personal de una receta.
 *
 * Una nota en blanco no se guarda vacía: se quita. Así "sin nota" es una sola cosa y la
 * pantalla no tiene que distinguir entre no haber escrito nunca y haber borrado el texto.
 */
export function updateRecipeNotes(recipe: Recipe, notes: string): Recipe {
  const trimmed = notes.trim();
  const candidate: Record<string, unknown> = {
    ...recipe,
    updatedAt: new Date().toISOString(),
  };

  if (trimmed === "") delete candidate.notes;
  else candidate.notes = trimmed;

  return recipeSchema.parse(candidate);
}
