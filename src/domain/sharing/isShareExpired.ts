/** Si el enlace ya no vale. La fecha viene de la base, en ISO. */
export function isShareExpired(expiresAt: string, now: Date): boolean {
  const until = Date.parse(expiresAt);

  // Una fecha que no se entiende se trata como caducada: ante la duda, el enlace no se abre.
  return Number.isNaN(until) || until <= now.getTime();
}
