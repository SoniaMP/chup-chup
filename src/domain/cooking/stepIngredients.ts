import type { Ingredient } from "../recipes/ingredient";
import { wordsOf } from "./wordsOf";

/**
 * Palabras de un nombre de ingrediente que describen y no nombran. Si contaran, «añade la levadura
 * en polvo» traería también el «curry en polvo».
 */
const DESCRIBING_WORDS = new Set([
  "polvo",
  "powder",
  "entero",
  "entera",
  "grande",
  "pequeno",
  "pequena",
  "mediano",
  "mediana",
  "fresco",
  "fresca",
  "picado",
  "picada",
  "molido",
  "molida",
  "rallado",
  "rallada",
  "cocido",
  "cocida",
  "cocidos",
  "cocidas",
  "triturado",
  "triturada",
  "gorda",
  "fina",
  "extra",
  "virgen",
]);

/** La palabra tal cual y sin plural: «zanahorias», «zanahoria»; «limones», «limon». */
const formsOf = (word: string): string[] => {
  const forms = [word];
  if (word.endsWith("s")) forms.push(word.slice(0, -1));
  if (word.endsWith("es")) forms.push(word.slice(0, -2));
  return forms;
};

const namingWordsOf = (name: string): string[] => {
  const words = wordsOf(name);
  const naming = words.filter((word) => !DESCRIBING_WORDS.has(word));
  return naming.length > 0 ? naming : words;
};

/**
 * Los ingredientes que nombra un paso, en el orden de la receta.
 *
 * Basta con que una palabra del nombre salga en el paso: «Añade los garbanzos escurridos» trae
 * los «garbanzos cocidos». Ante la duda se enseña, porque un ingrediente de más molesta menos que
 * el que se busca y no está. Lo que no nombra nada («la masa», «la mezcla») no trae nada.
 */
export function stepIngredients(stepText: string, ingredients: Ingredient[]): Ingredient[] {
  const stepForms = new Set(wordsOf(stepText).flatMap(formsOf));

  return ingredients.filter((ingredient) =>
    namingWordsOf(ingredient.name).some((word) =>
      formsOf(word).some((form) => stepForms.has(form)),
    ),
  );
}
