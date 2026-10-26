const FRACTIONS: Record<number, string> = { 0.25: "¼", 0.5: "½", 0.75: "¾" };

/**
 * Una cantidad como se escribe en una receta en español: «1½», «¾», «0,1».
 *
 * Los cuartos y las medias van con su fracción porque es como se leen en una cocina; el resto de
 * decimales, con coma y sin ceros de más.
 */
export function quantityText(quantity: number): string {
  const whole = Math.floor(quantity);
  const fraction = FRACTIONS[Number((quantity - whole).toFixed(2))];

  if (fraction !== undefined) return whole === 0 ? fraction : `${String(whole)}${fraction}`;
  return String(Number(quantity.toFixed(2))).replace(".", ",");
}
