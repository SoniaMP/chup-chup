import { savedRecipeSchema, type SavedRecipe } from "@/domain/recipes/savedRecipe";
import type { Database } from "@/lib/databaseTypes";
import { recipeFromRow } from "./recipeFromRow";

type Tables = Database["public"]["Tables"];

/** Lo que devuelve leer `saved_recipes` con su receta incrustada. */
export type SavedRecipeRow = Tables["saved_recipes"]["Row"] & {
  recipes: Tables["recipes"]["Row"];
};

/** Junta las dos tablas en la receta plana que leen las pantallas. */
export function savedRecipeFromRow(row: SavedRecipeRow): SavedRecipe {
  return savedRecipeSchema.parse({
    ...recipeFromRow(row.recipes),
    ...(row.notes !== null && { notes: row.notes }),
    ...(row.library_image !== null && { libraryImage: row.library_image }),
    isFavorite: row.is_favorite,
    savedAt: new Date(row.saved_at).toISOString(),
  });
}
