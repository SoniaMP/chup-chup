import type { Recipe } from "./recipe";

export type RecipeFact = { label: string; value: string };

/**
 * Preparación, cocción y raciones, pero solo las que la receta dice. Un cuadrado con un «—» no
 * informa de nada y afea la ficha: lo que falta no se pinta.
 */
export function recipeFacts(
  recipe: Pick<Recipe, "prepMin" | "cookMin" | "servings">,
): RecipeFact[] {
  const facts: (RecipeFact | null)[] = [
    recipe.prepMin === undefined
      ? null
      : { label: "Preparación", value: `${String(recipe.prepMin)} min` },
    recipe.cookMin === undefined
      ? null
      : { label: "Cocción", value: `${String(recipe.cookMin)} min` },
    recipe.servings === undefined ? null : { label: "Raciones", value: String(recipe.servings) },
  ];

  return facts.filter((fact) => fact !== null);
}
