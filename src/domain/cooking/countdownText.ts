const twoDigits = (value: number): string => String(value).padStart(2, "0");

/** Lo que queda, como en un reloj de cocina: «32:10», «1:05:00». Nunca por debajo de cero. */
export function countdownText(remainingMs: number): string {
  const totalSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return hours > 0
    ? `${String(hours)}:${twoDigits(minutes)}:${twoDigits(seconds)}`
    : `${String(minutes)}:${twoDigits(seconds)}`;
}
