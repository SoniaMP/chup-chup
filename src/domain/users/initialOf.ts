/** La letra del círculo de la cuenta: la primera del nombre, en mayúscula. */
export function initialOf(name: string | null): string | null {
  const first = name?.trim().charAt(0);
  if (first === undefined || first === "") return null;

  return first.toLocaleUpperCase("es");
}
