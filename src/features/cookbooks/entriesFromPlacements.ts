import type { SavedRecipe } from "@/domain/recipes/savedRecipe";
import type { CookbookEntry } from "./cookbookEntry";
import type { Placement } from "./placement";

/**
 * Las recetas de un libro, armadas con las piezas sueltas de la copia local.
 *
 * Sin red no hay una consulta que las junte, pero la cocina guardada ya tiene las dos mitades:
 * qué receta está en qué libro y el contenido de cada receta. Una receta que falte se queda
 * fuera en vez de inventarse: es lo mismo que haría el servidor.
 */
export function entriesFromPlacements(
  placements: Placement[],
  recipes: SavedRecipe[],
  cookbookId: string,
): CookbookEntry[] {
  const byId = new Map(recipes.map((recipe) => [recipe.id, recipe]));

  return placements
    .filter((placement) => placement.cookbookId === cookbookId)
    .flatMap((placement) => {
      const recipe = byId.get(placement.recipeId);
      return recipe === undefined ? [] : [{ recipe, position: placement.position }];
    })
    .sort((one, other) => (one.position < other.position ? -1 : 1));
}
