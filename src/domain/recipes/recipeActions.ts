/** Lo que se puede hacer con una receta desde el menú de un libro. */
export type RecipeAction = "reorder" | "addToCookbook" | "removeFromCookbook" | "delete";

/**
 * Qué acciones ofrece una receta dentro de un libro.
 *
 * Reordenar es de la lista, no de la receta, y con una sola receta no hay nada que ordenar: en
 * ese caso la opción se queda fuera en vez de enseñarse sin efecto.
 */
export function availableRecipeActions(recipeCount: number): RecipeAction[] {
  const actions: RecipeAction[] = ["addToCookbook", "removeFromCookbook", "delete"];

  return recipeCount > 1 ? ["reorder", ...actions] : actions;
}
