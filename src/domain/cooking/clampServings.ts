/** Lo que admite el esquema de la receta: de 1 a 100 raciones. */
const FEWEST = 1;
const MOST = 100;

/** Unas raciones que se pueden elegir: ni cero ni más de las que admite una receta. */
export function clampServings(servings: number): number {
  return Math.min(MOST, Math.max(FEWEST, Math.round(servings)));
}
