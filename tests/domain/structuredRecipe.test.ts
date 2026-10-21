import { describe, expect, it } from "vitest";
import { structuredRecipeSchema } from "../../src/domain/recipes/structuredRecipe";

const valid = {
  title: "Tortilla de patatas",
  locale: "es-ES",
  servings: 4,
  prepMin: 15,
  cookMin: 25,
  ingredients: [{ name: "patatas", quantity: 700, unit: "g" }],
  steps: [{ text: "Pela las patatas y córtalas en láminas finas." }],
  assumptions: [],
};

describe("structuredRecipeSchema", () => {
  it("acepta una receta completa", () => {
    expect(structuredRecipeSchema.safeParse(valid).success).toBe(true);
  });

  it("acepta una receta sin raciones ni tiempos", () => {
    const { title, locale, ingredients, steps, assumptions } = valid;
    const result = structuredRecipeSchema.safeParse({ title, locale, ingredients, steps, assumptions });
    expect(result.success).toBe(true);
  });

  it("pone la lista de suposiciones vacía si no viene", () => {
    const { title, locale, ingredients, steps } = valid;
    const parsed = structuredRecipeSchema.parse({ title, locale, ingredients, steps });
    expect(parsed.assumptions).toEqual([]);
  });

  it("rechaza una receta sin ingredientes o sin pasos", () => {
    expect(structuredRecipeSchema.safeParse({ ...valid, ingredients: [] }).success).toBe(false);
    expect(structuredRecipeSchema.safeParse({ ...valid, steps: [] }).success).toBe(false);
  });

  it("rechaza el título vacío", () => {
    expect(structuredRecipeSchema.safeParse({ ...valid, title: "  " }).success).toBe(false);
  });

  it("rechaza un idioma que no tiene forma de idioma", () => {
    expect(structuredRecipeSchema.safeParse({ ...valid, locale: "español" }).success).toBe(false);
  });

  it("rechaza raciones o tiempos con decimales", () => {
    expect(structuredRecipeSchema.safeParse({ ...valid, servings: 4.5 }).success).toBe(false);
    expect(structuredRecipeSchema.safeParse({ ...valid, prepMin: 15.5 }).success).toBe(false);
  });

  it("no deja hueco para las notas personales ni para los identificadores", () => {
    const parsed = structuredRecipeSchema.parse({
      ...valid,
      notes: "la próxima vez, menos sal",
      id: "11111111-1111-4111-8111-111111111111",
      ownerId: "22222222-2222-4222-8222-222222222222",
    });
    expect(parsed).not.toHaveProperty("notes");
    expect(parsed).not.toHaveProperty("id");
    expect(parsed).not.toHaveProperty("ownerId");
  });
});
