import { describe, expect, it } from "vitest";
import { recipeSchema, type Recipe } from "../../src/domain/recipes/recipe";
import { toggleRecipeFavorite } from "../../src/domain/recipes/toggleRecipeFavorite";

const recipe: Recipe = recipeSchema.parse({
  id: "11111111-1111-4111-8111-111111111111",
  ownerId: "22222222-2222-4222-8222-222222222222",
  title: "Tortilla de patatas",
  locale: "es-ES",
  ingredients: [{ name: "huevos", quantity: 6 }],
  steps: [{ text: "Bate los huevos." }],
  rawInput: "tortilla",
  notes: "menos sal",
  createdAt: "2026-10-01T10:00:00.000Z",
  updatedAt: "2026-10-01T10:00:00.000Z",
});

describe("toggleRecipeFavorite", () => {
  it("la pone en favoritas y la saca", () => {
    const favorite = toggleRecipeFavorite(recipe);
    expect(favorite.isFavorite).toBe(true);
    expect(toggleRecipeFavorite(favorite).isFavorite).toBe(false);
  });

  it("marca la fecha de modificación", () => {
    expect(toggleRecipeFavorite(recipe).updatedAt > recipe.updatedAt).toBe(true);
  });

  it("no toca nada más de la receta", () => {
    const favorite = toggleRecipeFavorite(recipe);
    expect(favorite.title).toBe(recipe.title);
    expect(favorite.notes).toBe(recipe.notes);
    expect(favorite.steps).toEqual(recipe.steps);
  });
});
