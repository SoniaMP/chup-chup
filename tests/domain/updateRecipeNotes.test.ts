import { describe, expect, it } from "vitest";
import { recipeSchema } from "../../src/domain/recipes/recipe";
import { updateRecipeNotes } from "../../src/domain/recipes/updateRecipeNotes";

const recipe = recipeSchema.parse({
  title: "Tortilla de patatas",
  locale: "es-ES",
  ingredients: [{ name: "huevos", quantity: 6 }],
  steps: [{ text: "Bate los huevos con sal." }],
  rawInput: "tortilla: huevos patatas cebolla",
  id: "11111111-1111-4111-8111-111111111111",
  ownerId: "22222222-2222-4222-8222-222222222222",
  createdAt: "2026-10-21T18:00:00.000Z",
  updatedAt: "2026-10-21T18:00:00.000Z",
});

describe("updateRecipeNotes", () => {
  it("guarda la nota sin espacios de más", () => {
    expect(updateRecipeNotes(recipe, "  menos sal la próxima  ").notes).toBe("menos sal la próxima");
  });

  it("quita la nota cuando se deja en blanco", () => {
    const withNote = updateRecipeNotes(recipe, "menos sal");
    expect(updateRecipeNotes(withNote, "   ")).not.toHaveProperty("notes");
  });

  it("marca la receta como modificada", () => {
    expect(updateRecipeNotes(recipe, "menos sal").updatedAt).not.toBe(recipe.updatedAt);
  });

  it("no toca nada más de la receta", () => {
    const updated = updateRecipeNotes(recipe, "menos sal");
    expect(updated.title).toBe(recipe.title);
    expect(updated.id).toBe(recipe.id);
    expect(updated.createdAt).toBe(recipe.createdAt);
  });
});
