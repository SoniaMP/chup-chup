import { describe, expect, it } from "vitest";

import { recipeSchema } from "@/domain/recipes/recipe";
import { savedRecipeSchema } from "@/domain/recipes/savedRecipe";
import { savedRecipeWith } from "@/domain/recipes/savedRecipeWith";

const content = {
  id: "11111111-1111-4111-8111-111111111111",
  ownerId: "22222222-2222-4222-8222-222222222222",
  title: "Tortilla de patatas",
  locale: "es-ES",
  ingredients: [{ name: "huevos", quantity: 6 }],
  steps: [{ text: "Bate los huevos." }],
  rawInput: "tortilla",
  createdAt: "2026-10-01T10:00:00.000Z",
  updatedAt: "2026-10-01T10:00:00.000Z",
};

/** La receta de partida sí tiene raciones; el contenido nuevo del último test, no. */
const base = { ...content, servings: 4 };

const saved = savedRecipeSchema.parse({
  ...base,
  notes: "menos sal",
  isFavorite: true,
  libraryImage: "cream-marble.jpg",
  savedAt: "2026-10-01T10:00:00.000Z",
});

describe("savedRecipeWith", () => {
  it("conserva lo que es de quien la tiene guardada", () => {
    const updated = savedRecipeWith(saved, recipeSchema.parse({ ...base, title: "Otra" }));
    expect(updated.notes).toBe("menos sal");
    expect(updated.isFavorite).toBe(true);
    expect(updated.libraryImage).toBe("cream-marble.jpg");
    expect(updated.savedAt).toBe(saved.savedAt);
  });

  it("se queda con el contenido nuevo", () => {
    const updated = savedRecipeWith(saved, recipeSchema.parse({ ...base, title: "Otra" }));
    expect(updated.title).toBe("Otra");
  });

  it("lo que se ha vaciado se va de verdad, no se queda el valor de antes", () => {
    const updated = savedRecipeWith(saved, recipeSchema.parse(content));
    expect(updated).not.toHaveProperty("servings");
  });
});
