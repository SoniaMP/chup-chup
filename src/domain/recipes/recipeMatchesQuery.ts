import { matchesAllWords } from "@/domain/search/matchesAllWords";
import type { Recipe } from "./recipe";

/** Si una receta responde a lo que se está buscando, por título o por ingrediente. */
export function recipeMatchesQuery(recipe: Recipe, query: string): boolean {
  return matchesAllWords(
    [recipe.title, ...recipe.ingredients.map((ingredient) => ingredient.name)],
    query,
  );
}
