import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";
import { describe, expect, it } from "vitest";
import type { StructuredRecipe } from "../../src/domain/recipes/structuredRecipe";
import { parseStructuredRecipe } from "../../src/features/ai/parseStructuredRecipe";

const INPUTS_DIR = join(import.meta.dirname, "../fixtures/inputs");
const OUTPUTS_DIR = join(import.meta.dirname, "../fixtures/outputs");

const everyWord = (recipe: StructuredRecipe): string =>
  [
    recipe.title,
    ...recipe.ingredients.map((i) => `${i.name} ${i.note ?? ""}`),
    ...recipe.steps.map((s) => s.text),
  ]
    .join(" ")
    .toLowerCase();

const ingredient = (recipe: StructuredRecipe, needle: string) =>
  recipe.ingredients.find((i) => i.name.toLowerCase().includes(needle));

/** Sólidos que nunca se miden en volumen, por mucho que el texto venga en tazas. */
const SOLIDS = ["harina", "flour", "azúcar", "sugar", "arroz", "rice", "pan rallado", "lenteja"];

/** Lo que tiene que cumplir cualquier receta, venga del texto que venga. */
const checkAlways = (recipe: StructuredRecipe): void => {
  // Un sólido en mililitros no se puede pesar ni comprar: va en gramos.
  for (const { name, unit } of recipe.ingredients) {
    const isSolid = SOLIDS.some((solid) => name.toLowerCase().includes(solid));
    if (isSolid) expect(unit, `"${name}" viene en ${unit ?? "nada"}`).not.toMatch(/^(ml|l)$/);
  }

  // La cantidad va en `quantity`, nunca dentro del nombre.
  for (const { name } of recipe.ingredients) {
    expect(name, `"${name}" lleva cifras en el nombre`).not.toMatch(/\d/);
  }
  expect(recipe.title.toLowerCase()).not.toContain("receta");
  expect(recipe.steps.length).toBeGreaterThanOrEqual(2);
};

const CHECKS: Record<string, (recipe: StructuredRecipe) => void> = {
  "tortilla-no-quantities": (recipe) => {
    expect(recipe.locale.startsWith("es")).toBe(true);
    for (const needle of ["patata", "cebolla", "huevo", "aceite"]) {
      expect(ingredient(recipe, needle), `falta el ingrediente "${needle}"`).toBeDefined();
    }
    // El texto no traía ni una cantidad: la IA las concreta todas.
    expect(ingredient(recipe, "patata")?.quantity).toBeGreaterThan(0);
    expect(ingredient(recipe, "huevo")?.quantity).toBeGreaterThan(0);
    expect(recipe.assumptions.length).toBeGreaterThan(0);
  },

  "lentils-typos-abbreviations": (recipe) => {
    expect(recipe.locale.startsWith("es")).toBe(true);
    // Faltas corregidas y abreviaturas desarrolladas.
    expect(everyWord(recipe)).toContain("zanahoria");
    expect(everyWord(recipe)).not.toContain("zanaoria");
    expect(everyWord(recipe)).toContain("pimentón");
    expect(everyWord(recipe)).not.toContain("cuchrada");
    const lentejas = ingredient(recipe, "lenteja");
    expect(lentejas?.quantity).toBeGreaterThan(0);
    expect(["g", "kg"]).toContain(lentejas?.unit);
  },

  "sponge-cake-vague-amounts": (recipe) => {
    expect(recipe.locale.startsWith("es")).toBe(true);
    // "un chorrito" y "un sobre" pasan a valores utilizables.
    expect(ingredient(recipe, "aceite")?.quantity).toBeGreaterThan(0);
    expect(ingredient(recipe, "levadura")?.quantity).toBeGreaterThan(0);
    expect(recipe.assumptions.length).toBeGreaterThan(0);
  },

  "roast-missing-obvious-steps": (recipe) => {
    expect(recipe.locale.startsWith("es")).toBe(true);
    // El texto no dice precalentar: es el paso obvio que falta.
    expect(everyWord(recipe)).toMatch(/precali|precalent/);
    expect(recipe.cookMin).toBeGreaterThan(60);
  },

  "curry-with-personal-note": (recipe) => {
    expect(recipe.locale.startsWith("es")).toBe(true);
    // El recado personal del final no entra en la receta por ninguna puerta.
    const text = everyWord(recipe);
    expect(text).not.toContain("salado");
    expect(text).not.toContain("menos sal");
    expect(text).not.toContain("la última vez");
    expect(ingredient(recipe, "garbanzo")).toBeDefined();
  },

  "pancakes-english": (recipe) => {
    // El idioma de entrada se respeta.
    expect(recipe.locale.startsWith("en")).toBe(true);
    expect(everyWord(recipe)).toContain("flour");
  },
};

const fixtureNames = readdirSync(INPUTS_DIR)
  .filter((file) => file.endsWith(".txt"))
  .map((file) => basename(file, ".txt"))
  .sort();

describe("STRUCTURE_RECIPE_PROMPT sobre textos escritos deprisa", () => {
  it("tiene una comprobación escrita para cada texto de ejemplo", () => {
    expect(Object.keys(CHECKS).sort()).toEqual(fixtureNames);
  });

  for (const name of fixtureNames) {
    const outputPath = join(OUTPUTS_DIR, `${name}.json`);

    if (!existsSync(outputPath)) {
      it.skip(`${name} — sin grabar, ejecuta "npm run record:fixtures"`, () => {});
      continue;
    }

    it(name, () => {
      const recorded: unknown = JSON.parse(readFileSync(outputPath, "utf-8"));
      const result = parseStructuredRecipe(recorded);
      expect(result.ok, result.ok ? "" : result.error).toBe(true);
      if (!result.ok) return;
      checkAlways(result.value);
      CHECKS[name]?.(result.value);
    });
  }
});
