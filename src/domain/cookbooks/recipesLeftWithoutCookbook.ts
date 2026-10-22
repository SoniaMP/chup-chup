type Membership = { cookbookId: string; recipeId: string };

/**
 * Las recetas que se quedarían sin ningún libro si se borrara este.
 *
 * Borrar un libro no borra sus recetas, pero una receta sin libro no aparece en ninguna parte
 * de la biblioteca. Las que solo estaban aquí hay que recolocarlas antes de borrar.
 */
export function recipesLeftWithoutCookbook(membership: Membership[], cookbookId: string): string[] {
  const elsewhere = new Set(
    membership.filter((row) => row.cookbookId !== cookbookId).map((row) => row.recipeId),
  );

  const left = membership
    .filter((row) => row.cookbookId === cookbookId && !elsewhere.has(row.recipeId))
    .map((row) => row.recipeId);

  return [...new Set(left)];
}
