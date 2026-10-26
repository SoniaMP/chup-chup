/** Expresiones fijas que dicen un tiempo exacto sin cifras. Va antes lo más largo. */
const SPOKEN_TIMES: [RegExp, number][] = [
  [/\bhora y media\b/, 90],
  [/\bmedia hora\b/, 30],
  [/\bcuarto de hora\b/, 15],
  [/\buna hora\b/, 60],
  [/\bun minuto\b/, 1],
  [/\bhalf an hour\b/, 30],
  [/\ban hour\b/, 60],
  [/\ba minute\b/, 1],
];

const MINUTES = "(?:minutos?|min|minutes?|mins?)\\b";
const HOURS = "(?:horas?|h|hours?|hrs?)\\b";
/** «35-40 minutos», «entre 30 y 35 minutos», «3 a 4 minutos»: vale el más largo. */
const NUMBER = "(\\d+)(?:\\s*(?:-|–|a|y|to|or)\\s*(\\d+))?";

const largest = (first: string, second: string | undefined): number =>
  Math.max(Number(first), Number(second ?? first));

/**
 * Los minutos que dice un paso, si los dice: «20 minutos», «40 min», «1 hora y media», «2 h».
 *
 * Solo lo que está escrito como un tiempo. «Un par de minutos» o «hasta que esté dorado» no
 * cuentan: decidir cuánto es eso es interpretar, y aquí no se interpreta. Con varios tiempos en el
 * mismo paso vale el primero, que es el de lo que se hace primero.
 */
export function stepMinutes(text: string): number | null {
  const lower = text.toLowerCase();

  const hoursAndHalf = new RegExp(`(\\d+)\\s*${HOURS}\\s*y\\s*media`).exec(lower);
  if (hoursAndHalf?.[1] !== undefined) return Number(hoursAndHalf[1]) * 60 + 30;

  const candidates = [
    { match: new RegExp(`${NUMBER}\\s*${MINUTES}`).exec(lower), perUnit: 1 },
    { match: new RegExp(`${NUMBER}\\s*${HOURS}`).exec(lower), perUnit: 60 },
  ]
    .filter((candidate) => candidate.match?.[1] !== undefined)
    .sort((a, b) => (a.match?.index ?? 0) - (b.match?.index ?? 0));

  const first = candidates[0];
  if (first?.match?.[1] !== undefined) {
    return largest(first.match[1], first.match[2]) * first.perUnit;
  }

  return SPOKEN_TIMES.find(([pattern]) => pattern.test(lower))?.[1] ?? null;
}
