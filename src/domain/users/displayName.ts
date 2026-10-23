type UserIdentity = {
  email?: string | undefined;
  name?: string | undefined;
};

/**
 * Con qué nombre se firma lo que una usuaria crea.
 *
 * Mientras no haya perfil, el nombre sale del correo: lo de antes de la arroba, que es lo que la
 * gente reconoce como suyo. Si algún día hay nombre de verdad, manda ese.
 */
export function displayName({ email, name }: UserIdentity): string | null {
  const chosen = name?.trim();
  if (chosen !== undefined && chosen !== "") return chosen;

  const local = email?.split("@")[0]?.trim();
  if (local === undefined || local === "") return null;

  return local;
}
