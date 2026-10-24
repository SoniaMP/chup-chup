import { recipeSchema, type Recipe } from "@/domain/recipes/recipe";
import type { Database } from "@/lib/databaseTypes";

type RecipeRow = Database["public"]["Tables"]["recipes"]["Row"];

/**
 * Pasa una fila de Postgres a la receta del dominio: snake_case a camelCase, y `null` a ausencia
 * de clave, que es lo que el esquema espera de un campo opcional.
 *
 * Las fechas se renormalizan porque Postgres las devuelve con desplazamiento ("+00:00") y el
 * dominio las quiere en ISO con Z.
 */
export function recipeFromRow(row: RecipeRow): Recipe {
  return recipeSchema.parse({
    id: row.id,
    ownerId: row.owner_id,
    title: row.title,
    locale: row.locale,
    ...(row.servings !== null && { servings: row.servings }),
    ...(row.prep_min !== null && { prepMin: row.prep_min }),
    ...(row.cook_min !== null && { cookMin: row.cook_min }),
    ingredients: row.ingredients,
    steps: row.steps,
    rawInput: row.raw_input,
    ...(row.photo_original !== null && { photoOriginal: row.photo_original }),
    ...(row.photo_enhanced !== null && { photoEnhanced: row.photo_enhanced }),
    photoActive: row.photo_active,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  });
}
