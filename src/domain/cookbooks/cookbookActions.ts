import type { Cookbook } from "./cookbook";

/** Lo que se puede hacer con un libro desde su menú. */
export type CookbookAction = "rename" | "reorder" | "delete";

/**
 * Qué acciones ofrece un libro.
 *
 * El libro por defecto se puede renombrar pero no borrar: es donde caen las recetas que no se
 * guardan en ningún otro, así que sin él habría recetas sin sitio. La base de datos lo impide
 * igualmente; esto es para no enseñar una opción que va a fallar.
 */
export function availableCookbookActions(cookbook: Cookbook): CookbookAction[] {
  return cookbook.isSystem ? ["rename", "reorder"] : ["rename", "reorder", "delete"];
}
