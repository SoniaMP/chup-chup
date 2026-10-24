const MONTHS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

/**
 * Hasta cuándo vale el enlace, dicho en español.
 *
 * Los meses van a mano y no con `Intl` porque esto se pinta igual en el móvil y dentro de una
 * Edge Function, y el idioma de la app no depende del que tenga puesto el aparato.
 */
export function sharedUntil(expiresAt: string): string | null {
  const until = new Date(expiresAt);
  if (Number.isNaN(until.getTime())) return null;

  const month = MONTHS[until.getMonth()];
  return month === undefined ? null : `${until.getDate()} de ${month}`;
}
