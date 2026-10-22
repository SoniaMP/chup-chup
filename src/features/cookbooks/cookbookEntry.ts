import type { Recipe } from "@/domain/recipes/recipe";

/** Una receta dentro de un libro, con el sitio que ocupa en él. */
export type CookbookEntry = {
  recipe: Recipe;
  position: string;
};
