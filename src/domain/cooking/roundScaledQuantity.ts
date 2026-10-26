/** Unidades que se miden al gramo o al mililitro. */
const FINE_UNITS = new Set(["g", "gr", "gramo", "gramos", "ml", "mililitro", "mililitros"]);
/** Unidades grandes, que se quedan con un decimal. */
const LARGE_UNITS = new Set(["kg", "kilo", "kilos", "l", "litro", "litros"]);
/** Lo que no se parte: no hay media lata ni media pizca. */
const WHOLE_UNITS = new Set([
  "lata",
  "latas",
  "sobre",
  "sobres",
  "bote",
  "botes",
  "paquete",
  "paquetes",
  "tarro",
  "tarros",
  "pizca",
  "pizcas",
  "pinch",
  "pinches",
  "can",
  "cans",
]);
/** Lo que se cuenta sin unidad y tampoco se parte: medio huevo no lo casca nadie. */
const WHOLE_THINGS = /\b(huevos?|yemas?|claras?|eggs?|yolks?)\b/i;

const roundTo = (value: number, step: number, minimum: number): number =>
  Math.max(minimum, Math.round(value / step) * step);

const roundFine = (value: number): number => {
  if (value <= 20) return roundTo(value, 1, 1);
  if (value <= 100) return roundTo(value, 5, 5);
  return roundTo(value, 10, 10);
};

/**
 * Redondea una cantidad escalada a algo que se pueda medir en una cocina.
 *
 * Nadie pesa 373 g ni casca 4,5 huevos. Gramos y mililitros, al entero hasta 20, de 5 en 5 hasta
 * 100 y de 10 en 10 por encima; kilos y litros, a la décima; lo que no se parte, a la unidad; y
 * el resto (cucharadas, tazas, cebollas, dientes de ajo), a la media.
 */
export function roundScaledQuantity(
  quantity: number,
  unit: string | undefined,
  name: string,
): number {
  const normalizedUnit = unit?.trim().toLowerCase();

  if (normalizedUnit !== undefined && FINE_UNITS.has(normalizedUnit)) return roundFine(quantity);
  if (normalizedUnit !== undefined && LARGE_UNITS.has(normalizedUnit)) {
    return roundTo(quantity, 0.1, 0.1);
  }
  if (normalizedUnit !== undefined && WHOLE_UNITS.has(normalizedUnit)) {
    return roundTo(quantity, 1, 1);
  }
  if (WHOLE_THINGS.test(name)) return roundTo(quantity, 1, 1);
  return roundTo(quantity, 0.5, 0.5);
}
