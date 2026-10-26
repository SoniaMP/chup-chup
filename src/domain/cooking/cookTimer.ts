/** Un temporizador en marcha del modo cocina. */
export type CookTimer = {
  id: string;
  /** Lo que se está haciendo: «Lentejas», o «Paso 5» si el paso no nombra nada. */
  label: string;
  /** Cuándo acaba, en milisegundos desde 1970. */
  endsAt: number;
};

const MINUTE_MS = 60_000;

/**
 * El temporizador con un minuto más o menos. Quitar nunca lo deja por debajo de cero: lo más que
 * hace es acabarlo ahora. Sumar a uno que ya ha acabado cuenta desde ahora, no desde que acabó.
 */
export function adjustedTimer(timer: CookTimer, minutes: number, now: number): CookTimer {
  const from = Math.max(timer.endsAt, now);
  return { ...timer, endsAt: Math.max(now, from + minutes * MINUTE_MS) };
}
