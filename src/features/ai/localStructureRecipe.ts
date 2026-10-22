import { parseStructuredRecipe, type ParsedRecipe } from "./parseStructuredRecipe";
import { splitIntoSteps } from "./splitIntoSteps";

/**
 * Sustituto local de la IA, para poder recorrer el flujo de crear antes de que exista la
 * Edge Function (paso 3 del plan). Parte el texto a ojo y avisa de ello en `assumptions`,
 * que es lo que la pantalla de revisión enseña arriba.
 *
 * No tiene ninguna ambición: cuando llegue la Edge Function, este fichero se borra.
 */
const QUANTITY = /^(\d+(?:[.,]\d+)?)\s*([a-zA-Zñ]{1,8})?\s+(?:de\s+)?(.+)$/;
const COOKING_VERB =
  /\b(se|luego|después|hasta|mezcla|bate|corta|pela|añade|echa|hornea|cuece|sofríe|fríe|tritura|reserva|sirve|deja)\b/i;
const SHORT_LINE_WORDS = 6;

/** Una línea es de ingredientes si enumera cosas, no si cuenta lo que hay que hacer. */
const isIngredientLine = (line: string): boolean => {
  if (COOKING_VERB.test(line)) return false;
  return line.includes(",") || line.split(/\s+/).length <= SHORT_LINE_WORDS;
};

/** "700gr" y "700 grs" son lo mismo que "700 g". */
const UNITS: Record<string, string> = {
  gr: "g",
  grs: "g",
  gramos: "g",
  kgs: "kg",
  kilos: "kg",
  mls: "ml",
  litros: "l",
  cdas: "cda",
  cucharada: "cda",
  cucharadas: "cda",
  cdtas: "cdta",
  cucharadita: "cdta",
  cucharaditas: "cdta",
  uds: "ud",
};

const parseIngredient = (text: string): Record<string, unknown> => {
  const match = QUANTITY.exec(text);
  if (!match) return { name: text };

  const [, amount, rawUnit, name] = match;
  const quantity = Number(String(amount).replace(",", "."));
  if (rawUnit === undefined) return { name, quantity };

  const unit = UNITS[rawUnit.toLowerCase()] ?? rawUnit;
  return { name, quantity, unit };
};

export function localStructureRecipe(rawInput: string): ParsedRecipe {
  const lines = rawInput
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const [title = "Receta sin título", ...rest] = lines;
  const ingredients: unknown[] = [];
  const steps: { text: string }[] = [];

  for (const line of rest) {
    if (isIngredientLine(line)) {
      for (const piece of line.split(",")) {
        const text = piece.trim();
        if (text.length > 0) ingredients.push(parseIngredient(text));
      }
      continue;
    }

    // Un párrafo entero escrito del tirón es lo normal en el móvil: una frase, un paso.
    for (const text of splitIntoSteps(line)) {
      steps.push({ text });
    }
  }

  return parseStructuredRecipe({
    title,
    locale: "es-ES",
    ingredients,
    steps,
    assumptions: ["Este borrador lo ha ordenado un sustituto local, todavía no la IA."],
  });
}
