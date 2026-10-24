import { describe, expect, it } from "vitest";
import { savedRecipeSchema } from "../../src/domain/recipes/savedRecipe";
import { updateRecipeNotes } from "../../src/domain/recipes/updateRecipeNotes";

const saved = savedRecipeSchema.parse({
  title: "Tortilla de patatas",
  locale: "es-ES",
  ingredients: [{ name: "huevos", quantity: 6 }],
  steps: [{ text: "Bate los huevos con sal." }],
  rawInput: "tortilla: huevos patatas cebolla",
  id: "11111111-1111-4111-8111-111111111111",
  ownerId: "22222222-2222-4222-8222-222222222222",
  createdAt: "2026-10-21T18:00:00.000Z",
  updatedAt: "2026-10-21T18:00:00.000Z",
  savedAt: "2026-10-21T18:00:00.000Z",
});

describe("updateRecipeNotes", () => {
  it("guarda la nota sin espacios de más", () => {
    expect(updateRecipeNotes(saved, "  menos sal la próxima  ").notes).toBe("menos sal la próxima");
  });

  it("quita la nota cuando se deja en blanco", () => {
    const withNote = updateRecipeNotes(saved, "menos sal");
    expect(updateRecipeNotes(withNote, "   ")).not.toHaveProperty("notes");
  });

  it("no marca la receta como modificada: la nota no es suya", () => {
    expect(updateRecipeNotes(saved, "menos sal").updatedAt).toBe(saved.updatedAt);
  });

  it("no toca nada más", () => {
    const updated = updateRecipeNotes(saved, "menos sal");
    expect(updated.title).toBe(saved.title);
    expect(updated.id).toBe(saved.id);
    expect(updated.createdAt).toBe(saved.createdAt);
  });
});
