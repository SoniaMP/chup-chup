import { describe, expect, it } from "vitest";
import { recipeFromRow } from "../../src/features/recipes/recipeFromRow";
import { rowFromRecipe } from "../../src/features/recipes/rowFromRecipe";

const row = {
  id: "11111111-1111-4111-8111-111111111111",
  owner_id: "22222222-2222-4222-8222-222222222222",
  title: "Tortilla de patatas",
  locale: "es-ES",
  servings: 4,
  prep_min: 15,
  cook_min: 25,
  ingredients: [{ name: "patatas", quantity: 700, unit: "g" }],
  steps: [{ text: "Fríe las patatas con la cebolla." }],
  raw_input: "tortilla: huevos patatas cebolla",
  photo_original: null,
  photo_enhanced: null,
  photo_active: "original",
  created_at: "2026-10-22T09:00:00+00:00",
  updated_at: "2026-10-22T09:30:00.123456+00:00",
};

describe("recipeFromRow", () => {
  it("pasa la fila a camelCase", () => {
    const recipe = recipeFromRow(row);
    expect(recipe.ownerId).toBe(row.owner_id);
    expect(recipe.prepMin).toBe(15);
    expect(recipe.cookMin).toBe(25);
    expect(recipe.rawInput).toBe(row.raw_input);
  });

  it("convierte las fechas con desplazamiento de Postgres a ISO con Z", () => {
    const recipe = recipeFromRow(row);
    expect(recipe.createdAt).toBe("2026-10-22T09:00:00.000Z");
    expect(recipe.updatedAt).toBe("2026-10-22T09:30:00.123Z");
  });

  it("deja fuera las claves que vienen a null, en vez de ponerlas a null", () => {
    const recipe = recipeFromRow({ ...row, servings: null, prep_min: null });
    expect(recipe).not.toHaveProperty("servings");
    expect(recipe).not.toHaveProperty("prepMin");
  });

  it("rechaza una fila que el dominio no acepta", () => {
    expect(() => recipeFromRow({ ...row, title: "   " })).toThrow();
  });
});

describe("rowFromRecipe", () => {
  it("vuelve a snake_case y a null, sin perder nada por el camino", () => {
    expect(rowFromRecipe(recipeFromRow(row))).toEqual({
      ...row,
      created_at: "2026-10-22T09:00:00.000Z",
      updated_at: "2026-10-22T09:30:00.123Z",
    });
  });

  it("pone a null lo que la receta no tiene", () => {
    expect(rowFromRecipe(recipeFromRow({ ...row, cook_min: null })).cook_min).toBeNull();
  });
});
