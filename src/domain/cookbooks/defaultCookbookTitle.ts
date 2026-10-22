/**
 * El libro donde caen las recetas que no se guardan en ninguno concreto.
 *
 * Lo crea la app, no la usuaria, y es el único con `is_system`. Existe para que ninguna receta
 * se quede sin un sitio donde encontrarla. El nombre se puede cambiar: la app lo reconoce por
 * la marca, no por cómo se llame.
 */
export const DEFAULT_COOKBOOK_TITLE = "Últimos chups";
