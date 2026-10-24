import { describe, expect, it } from "vitest";
import { savedRecipeSchema, type SavedRecipe } from "../../src/domain/recipes/savedRecipe";
import { toggleRecipeFavorite } from "../../src/domain/recipes/toggleRecipeFavorite";

const saved: SavedRecipe = savedRecipeSchema.parse({
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
  savedAt: "2026-10-01T10:00:00.000Z",
});

describe("toggleRecipeFavorite", () => {
  it("la pone en favoritas y la saca", () => {
    const favorite = toggleRecipeFavorite(saved);
    expect(favorite.isFavorite).toBe(true);
    expect(toggleRecipeFavorite(favorite).isFavorite).toBe(false);
  });

  it("no marca la receta como modificada: la estrella no es suya", () => {
    expect(toggleRecipeFavorite(saved).updatedAt).toBe(saved.updatedAt);
  });

  it("no toca nada más", () => {
    const favorite = toggleRecipeFavorite(saved);
    expect(favorite.title).toBe(saved.title);
    expect(favorite.notes).toBe(saved.notes);
    expect(favorite.steps).toEqual(saved.steps);
  });
});
