/** El enlace de una receta compartida: el testigo y hasta cuándo vale. */
export type Share = {
  recipeId: string;
  token: string;
  expiresAt: string;
};
