import type { SavedRecipe } from "@/domain/recipes/savedRecipe";

/** Una receta dentro de un libro, con el sitio que ocupa en él. */
export type CookbookEntry = {
  recipe: SavedRecipe;
  position: string;
};
