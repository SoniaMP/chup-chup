import type { Recipe } from "@/domain/recipes/recipe";
import type { Database } from "@/lib/databaseTypes";

type RecipeRow = Database["public"]["Tables"]["recipes"]["Insert"];

/** La receta del dominio como fila de Postgres: camelCase a snake_case, y ausencia a `null`. */
export function rowFromRecipe(recipe: Recipe): RecipeRow {
  return {
    id: recipe.id,
    owner_id: recipe.ownerId,
    title: recipe.title,
    locale: recipe.locale,
    servings: recipe.servings ?? null,
    prep_min: recipe.prepMin ?? null,
    cook_min: recipe.cookMin ?? null,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    raw_input: recipe.rawInput,
    photo_original: recipe.photoOriginal ?? null,
    photo_enhanced: recipe.photoEnhanced ?? null,
    photo_active: recipe.photoActive,
    created_at: recipe.createdAt,
    updated_at: recipe.updatedAt,
  };
}
