/**
 * Parte en pasos una línea que cuenta lo que hay que hacer.
 *
 * En el móvil se escribe del tirón: sin saltos de línea, a veces sin punto final, y muy a
 * menudo encadenando con comas y con "y" — "se fríen las patatas, se baten los huevos y se
 * cuaja todo". Esto cubre esos casos y el del punto sin espacio detrás.
 */

/** El principio de una instrucción nueva: "se baten…" o un imperativo de cocina. */
const INSTRUCTION =
  "(?:se\\s+[a-záéíóúñ]{3,}|pela|corta|pica|lava|bate|mezcla|añade|anade|echa|incorpora|remueve|sofríe|sofrie|fríe|frie|cuece|hornea|hierve|tritura|tapa|calienta|escurre|reserva|sirve|deja|amasa|estira|unta|salpimienta)";

/** Punto, punto y coma o signo de cierre seguido de letra. El `[^\d]` evita partir "1.5". */
const SENTENCE_END = /(?<=[^\d][.;!?])\s*(?=[a-záéíóúñ])/i;

/** Coma o "y" cuando lo que viene detrás es otra instrucción, no otro ingrediente. */
const CLAUSE = new RegExp(`[,;]\\s*(?=${INSTRUCTION}\\b)|\\s+y\\s+(?=${INSTRUCTION}\\b)`, "i");

const CONNECTOR =
  /[\s,]+(?=(?:y\s+)?(?:luego|después|despues|a continuación|a continuacion|por último|por ultimo|finalmente|entonces|mientras tanto|al final|cuando esté|cuando este)\b)/i;

const tidy = (text: string): string => text.trim().replace(/^y\s+/i, "");

/** La "y" de "y luego" se queda suelta al partir: no es un paso. */
const isLeftover = (text: string): boolean => /^[yoe]$/i.test(text) || text.length === 0;

export function splitIntoSteps(line: string): string[] {
  return line
    .split(SENTENCE_END)
    .flatMap((sentence) => sentence.split(CONNECTOR))
    .flatMap((sentence) => sentence.split(CLAUSE))
    .map(tidy)
    .filter((text) => !isLeftover(text));
}
