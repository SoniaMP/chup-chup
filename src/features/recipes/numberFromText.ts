/** Lo que se escribe en un campo numérico. Vacío o ilegible es "sin rellenar", no cero. */
export function numberFromText(text: string): number | null {
  const trimmed = text.trim().replace(",", ".");
  if (trimmed === "") return null;

  const value = Number(trimmed);
  return Number.isFinite(value) ? value : null;
}
