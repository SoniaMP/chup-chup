import type { SavedRecipe } from "@/domain/recipes/savedRecipe";
import type { Database } from "@/lib/databaseTypes";

type SavedRecipeRow = Database["public"]["Tables"]["saved_recipes"]["Insert"];

/**
 * La parte personal, como fila de `saved_recipes`.
 *
 * Sin `owner_id`: lo pone Postgres con `auth.uid()`, que es la única respuesta correcta a «de
 * quién es esto» y no se la puede inventar el cliente.
 */
export function rowFromSavedRecipe(saved: SavedRecipe): SavedRecipeRow {
  return {
    recipe_id: saved.id,
    notes: saved.notes ?? null,
    is_favorite: saved.isFavorite,
    library_image: saved.libraryImage ?? null,
    saved_at: saved.savedAt,
  };
}
