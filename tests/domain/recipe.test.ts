import { describe, expect, it } from "vitest";
import { recipeSchema } from "../../src/domain/recipes/recipe";
import { recipeInputSchema } from "../../src/domain/recipes/recipeInput";

const base = {
  title: "Tortilla de patatas",
  locale: "es-ES",
  ingredients: [{ name: "huevos", quantity: 6 }],
  steps: [{ text: "Bate los huevos con sal." }],
  rawInput: "tortilla: huevos patatas cebolla",
};

const saved = {
  ...base,
  id: "11111111-1111-4111-8111-111111111111",
  ownerId: "22222222-2222-4222-8222-222222222222",
  createdAt: "2026-10-21T18:00:00.000Z",
  updatedAt: "2026-10-21T18:00:00.000Z",
};

describe("recipeInputSchema", () => {
  it("acepta la receta lista para guardar, con sus notas", () => {
    const parsed = recipeInputSchema.parse({ ...base, notes: "la próxima vez, menos sal" });
    expect(parsed.notes).toBe("la próxima vez, menos sal");
  });

  it("exige el texto original", () => {
    const { title, locale, ingredients, steps } = base;
    const result = recipeInputSchema.safeParse({ title, locale, ingredients, steps });
    expect(result.success).toBe(false);
  });

  it("descarta las suposiciones de la IA: no se guardan", () => {
    const parsed = recipeInputSchema.parse({ ...base, assumptions: ["He supuesto 6 huevos"] });
    expect(parsed).not.toHaveProperty("assumptions");
  });
});

describe("recipeSchema", () => {
  it("acepta una receta guardada y pone los valores de serie", () => {
    const parsed = recipeSchema.parse(saved);
    expect(parsed.photoActive).toBe("original");
    expect(parsed.isFavorite).toBe(false);
  });

  it("rechaza un identificador que no es un UUID", () => {
    expect(recipeSchema.safeParse({ ...saved, id: "tortilla" }).success).toBe(false);
  });

  it("rechaza activar la foto mejorada cuando no existe", () => {
    const result = recipeSchema.safeParse({ ...saved, photoActive: "enhanced" });
    expect(result.success).toBe(false);
  });

  it("acepta la foto mejorada cuando sí existe", () => {
    const result = recipeSchema.safeParse({
      ...saved,
      photoActive: "enhanced",
      photoOriginal: "https://example.com/original.jpg",
      photoEnhanced: "https://example.com/enhanced.jpg",
    });
    expect(result.success).toBe(true);
  });
});
