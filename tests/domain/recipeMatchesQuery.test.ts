import { describe, expect, it } from "vitest";
import { recipeSchema, type Recipe } from "../../src/domain/recipes/recipe";
import { recipeMatchesQuery } from "../../src/domain/recipes/recipeMatchesQuery";

const recipe: Recipe = recipeSchema.parse({
  id: "11111111-1111-4111-8111-111111111111",
  ownerId: "22222222-2222-4222-8222-222222222222",
  title: "Pollo al horno",
  locale: "es-ES",
  ingredients: [{ name: "pollo" }, { name: "limón" }, { name: "patatas" }],
  steps: [{ text: "Hornea el pollo con el limón." }],
  rawInput: "pollo al horno con limon",
  createdAt: "2026-10-22T09:00:00.000Z",
  updatedAt: "2026-10-22T09:00:00.000Z",
});

describe("recipeMatchesQuery", () => {
  it("sin búsqueda, entran todas", () => {
    expect(recipeMatchesQuery(recipe, "")).toBe(true);
    expect(recipeMatchesQuery(recipe, "   ")).toBe(true);
  });

  it("busca por título, sin importar mayúsculas", () => {
    expect(recipeMatchesQuery(recipe, "POLLO")).toBe(true);
    expect(recipeMatchesQuery(recipe, "horno")).toBe(true);
  });

  it("busca por ingrediente", () => {
    expect(recipeMatchesQuery(recipe, "patatas")).toBe(true);
  });

  it("encuentra con y sin tilde, en los dos sentidos", () => {
    expect(recipeMatchesQuery(recipe, "limon")).toBe(true);
    expect(recipeMatchesQuery(recipe, "limón")).toBe(true);
  });

  it("encuentra por un trozo de palabra", () => {
    expect(recipeMatchesQuery(recipe, "pata")).toBe(true);
  });

  it("pide que estén todas las palabras, aunque sea en sitios distintos", () => {
    expect(recipeMatchesQuery(recipe, "pollo limon")).toBe(true);
    expect(recipeMatchesQuery(recipe, "pollo merluza")).toBe(false);
  });

  it("no encuentra lo que no está", () => {
    expect(recipeMatchesQuery(recipe, "lentejas")).toBe(false);
  });

  it("no busca en los pasos: se busca qué cocinar, no cómo", () => {
    expect(recipeMatchesQuery(recipe, "hornea")).toBe(false);
  });
});
