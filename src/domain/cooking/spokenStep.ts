import type { Ingredient } from "../recipes/ingredient";
import { spokenAmount } from "./spokenAmount";

const listOf = (items: string[], and: string): string =>
  items.length <= 1
    ? items.join("")
    : `${items.slice(0, -1).join(", ")} ${and} ${items.at(-1) ?? ""}`;

const withFullStop = (text: string): string =>
  /[.!?…]$/.test(text.trim()) ? text.trim() : `${text.trim()}.`;

/**
 * Lo que dice la voz al llegar a un paso: el número, el paso y lo que usa.
 * «Paso 2. Sofríe la cebolla. Necesitas: una cebolla y tres cucharadas de aceite.»
 *
 * Habla en el idioma de la receta: lo que no es español se lee en inglés, que es el otro idioma
 * que la IA devuelve hoy.
 */
export function spokenStep(
  stepNumber: number,
  text: string,
  ingredients: Ingredient[],
  locale: string,
): string {
  const language = locale.toLowerCase().startsWith("es") ? "es" : "en";
  const amounts = ingredients.map((ingredient) => spokenAmount(ingredient, language));
  const [stepWord, needWord, andWord] =
    language === "es" ? ["Paso", "Necesitas", "y"] : ["Step", "You need", "and"];

  const step = `${stepWord} ${String(stepNumber)}. ${withFullStop(text)}`;
  return amounts.length === 0 ? step : `${step} ${needWord}: ${listOf(amounts, andWord)}.`;
}
