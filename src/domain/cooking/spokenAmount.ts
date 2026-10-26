import type { Ingredient } from "../recipes/ingredient";

type Language = "es" | "en";
type UnitWords = Record<string, [singular: string, plural: string]>;

const UNIT_WORDS: Record<Language, UnitWords> = {
  es: {
    g: ["gramo", "gramos"],
    gr: ["gramo", "gramos"],
    kg: ["kilo", "kilos"],
    ml: ["mililitro", "mililitros"],
    l: ["litro", "litros"],
    cda: ["cucharada", "cucharadas"],
    cdta: ["cucharadita", "cucharaditas"],
    pizca: ["pizca", "pizcas"],
  },
  en: {
    g: ["gram", "grams"],
    kg: ["kilo", "kilos"],
    ml: ["millilitre", "millilitres"],
    l: ["litre", "litres"],
    tbsp: ["tablespoon", "tablespoons"],
    cda: ["tablespoon", "tablespoons"],
    tsp: ["teaspoon", "teaspoons"],
    cdta: ["teaspoon", "teaspoons"],
    pinch: ["pinch", "pinches"],
    cup: ["cup", "cups"],
  },
};

/** «ud» es que se cuenta: «2 ud de zanahorias» se dice «2 zanahorias». */
const COUNTED = new Set(["ud", "uds", "unidad", "unidades"]);

const isFeminine = (word: string): boolean => /as?$/.test(word.normalize("NFD"));

const unitWords = (unit: string, language: Language): [string, string] =>
  UNIT_WORDS[language][unit.toLowerCase()] ?? [unit, unit];

/** La cantidad en español: «una cebolla y media», «medio kilo de lentejas», «250 gramos de harina». */
const spanishAmount = (quantity: number, noun: [string, string], name: string | null): string => {
  const whole = Math.floor(quantity);
  const fraction = Number((quantity - whole).toFixed(2));
  const half = isFeminine(noun[0]) ? "media" : "medio";
  const one = isFeminine(noun[0]) ? "una" : "un";
  const ofName = name === null ? "" : ` de ${name}`;
  const counted = (count: number): string =>
    count === 1 ? `${one} ${noun[0]}` : `${String(count)} ${noun[1]}`;

  if (fraction === 0) return `${counted(whole)}${ofName}`;
  if (fraction === 0.5)
    return whole === 0 ? `${half} ${noun[0]}${ofName}` : `${counted(whole)} y ${half}${ofName}`;
  if (fraction === 0.25 && whole === 0) return `un cuarto de ${noun[0]}${ofName}`;
  if (fraction === 0.75 && whole === 0) return `tres cuartos de ${noun[0]}${ofName}`;
  return `${String(quantity).replace(".", ",")} ${noun[1]}${ofName}`;
};

const englishAmount = (quantity: number, noun: [string, string], name: string | null): string => {
  const ofName = name === null ? "" : ` of ${name}`;
  if (quantity === 0.5) return `half a ${noun[0]}${ofName}`;
  if (quantity === 1) return `one ${noun[0]}${ofName}`;
  if (quantity === 1.5) return `one and a half ${noun[1]}${ofName}`;
  return `${String(quantity)} ${noun[1]}${ofName}`;
};

/**
 * Un ingrediente como se dice en voz alta, en el idioma de la receta. El sintetizador no sabe
 * que «cda» es una cucharada ni que «1½» es «una y media», y «tres ce de» no le sirve a nadie.
 */
export function spokenAmount(ingredient: Ingredient, language: Language): string {
  if (ingredient.quantity === undefined) return ingredient.name;

  const unit = ingredient.unit?.trim();
  const isCounted = unit === undefined || COUNTED.has(unit.toLowerCase());
  const noun: [string, string] = isCounted
    ? [ingredient.name, ingredient.name]
    : unitWords(unit, language);
  const name = isCounted ? null : ingredient.name;

  return language === "es"
    ? spanishAmount(ingredient.quantity, noun, name)
    : englishAmount(ingredient.quantity, noun, name);
}
