/** Palabras que no dicen qué ingrediente es: artículos, preposiciones y conjunciones. */
const FILLER_WORDS = new Set([
  "de",
  "del",
  "la",
  "las",
  "el",
  "los",
  "un",
  "una",
  "unos",
  "unas",
  "y",
  "o",
  "con",
  "sin",
  "en",
  "para",
  "por",
  "al",
  "a",
  "lo",
  "su",
  "sus",
  "que",
  "se",
  "of",
  "the",
  "and",
  "or",
  "an",
  "to",
  "in",
  "with",
  "for",
  "on",
]);

/**
 * Las palabras con sentido de un texto, sin tildes ni mayúsculas.
 *
 * Es lo que comparan el paso y el ingrediente: «Sofríe la Cebolla» y «cebolla» tienen que dar la
 * misma palabra. Las de menos de tres letras se descartan porque casi nunca nombran nada.
 */
export function wordsOf(text: string): string[] {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter((word) => word.length >= 3 && !FILLER_WORDS.has(word));
}
