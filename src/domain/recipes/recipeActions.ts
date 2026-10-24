/** Lo que se puede hacer desde el menú de una receta dentro de un libro. */
export type RecipeAction =
  | "reorder"
  | "cover"
  | "addToCookbook"
  | "removeFromCookbook"
  | "delete"
  | "deleteCookbook";

type RecipeActionsContext = {
  recipeCount: number;
  canDeleteCookbook: boolean;
};

/**
 * Qué acciones ofrece una receta dentro de un libro.
 *
 * Hay dos que no van de la receta sino del libro entero, reordenar y borrarlo, porque es aquí
 * donde se piden. Reordenar sobra con una sola receta, y el libro por defecto no se borra.
 */
export function availableRecipeActions({
  recipeCount,
  canDeleteCookbook,
}: RecipeActionsContext): RecipeAction[] {
  return [
    ...(recipeCount > 1 ? (["reorder"] as const) : []),
    "cover",
    "addToCookbook",
    "removeFromCookbook",
    "delete",
    ...(canDeleteCookbook ? (["deleteCookbook"] as const) : []),
  ];
}
