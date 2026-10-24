import { savedRecipeSchema, type SavedRecipe } from "./savedRecipe";

/**
 * Cambia la nota personal de una receta.
 *
 * Una nota en blanco no se guarda vacía: se quita. Así "sin nota" es una sola cosa y la pantalla
 * no tiene que distinguir entre no haber escrito nunca y haber borrado el texto. Tampoco marca la
 * receta como modificada: la nota es de quien la escribe, no de la receta.
 */
export function updateRecipeNotes(saved: SavedRecipe, notes: string): SavedRecipe {
  const trimmed = notes.trim();
  const candidate: Record<string, unknown> = { ...saved };

  if (trimmed === "") delete candidate.notes;
  else candidate.notes = trimmed;

  return savedRecipeSchema.parse(candidate);
}
