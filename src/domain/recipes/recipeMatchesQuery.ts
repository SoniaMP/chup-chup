import type { Recipe } from "./recipe";

/** "Limón" y "limon" son la misma búsqueda: fuera mayúsculas y fuera tildes. */
const normalize = (text: string): string =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

/**
 * Si una receta responde a lo que se está buscando, por título o por ingrediente.
 *
 * Cada palabra tiene que aparecer en algún sitio, pero no en el mismo: "pollo limon" encuentra
 * la receta que se llama "Pollo al horno" y lleva limón entre los ingredientes.
 */
export function recipeMatchesQuery(recipe: Recipe, query: string): boolean {
  const words = normalize(query).split(/\s+/).filter((word) => word.length > 0);
  if (words.length === 0) return true;

  const haystacks = [recipe.title, ...recipe.ingredients.map((ingredient) => ingredient.name)].map(
    normalize,
  );

  return words.every((word) => haystacks.some((haystack) => haystack.includes(word)));
}
