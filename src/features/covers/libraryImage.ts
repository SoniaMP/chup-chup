/** Una imagen del catálogo del proyecto, con sus dos tamaños ya resueltos. */
export type LibraryImage = {
  id: string;
  /** Para la pantalla del libro o de la receta. */
  url: string;
  /** Para las tarjetas de las listas, que son de 64 px. */
  smallUrl: string;
};
