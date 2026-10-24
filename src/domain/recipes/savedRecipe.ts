import { z } from "zod";
import { recipeSchema } from "./recipe";

/**
 * Una receta en la cocina de alguien: su contenido, más lo que esa cocinera ha hecho con ella.
 *
 * Es plana a propósito. Las pantallas leen `recipe.title` y `recipe.isFavorite` sin enterarse de
 * que vienen de dos tablas; quién puede cambiar qué lo decide el repositorio, que es quien
 * escribe. Tener esto guardado es lo que significa «está en mi cocina», seas o no su dueña.
 */
export const savedRecipeSchema = recipeSchema.extend({
  notes: z.string().trim().max(2000).optional(),
  isFavorite: z.boolean().default(false),
  /** Imagen del catálogo, para cuando no hay foto. La foto de la receta manda siempre. */
  libraryImage: z.string().trim().min(1).max(120).optional(),
  savedAt: z.iso.datetime(),
});

export type SavedRecipe = z.infer<typeof savedRecipeSchema>;
