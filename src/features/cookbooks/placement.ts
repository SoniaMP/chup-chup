/** El sitio de una receta dentro de un libro, sin la receta: lo que ordena la lista. */
export type Placement = {
  cookbookId: string;
  recipeId: string;
  position: string;
};
