/**
 * El libro donde caen las recetas que no se guardan en ninguno concreto.
 *
 * Lo crea la app, no la usuaria, y es el único con `is_system`. Existe para que ninguna receta
 * se quede sin un sitio donde encontrarla.
 */
export const DEFAULT_COOKBOOK_TITLE = "Mis últimas incorporaciones";
