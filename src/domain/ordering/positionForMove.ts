import { positionBetween } from "./positionBetween";

/**
 * La clave de orden que le toca a un elemento al soltarlo en otro sitio de la lista.
 *
 * Se calcula entre sus vecinos nuevos, mirando la lista ya sin él. Como las claves son
 * fraccionarias, mover una fila cambia solo esa fila: los demás se quedan como estaban.
 */
export function positionForMove(positions: string[], from: number, to: number): string {
  const rest = positions.filter((_, index) => index !== from);

  return positionBetween(to > 0 ? (rest[to - 1] ?? "") : "", rest[to] ?? "");
}
