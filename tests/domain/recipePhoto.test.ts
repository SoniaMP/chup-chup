import { describe, expect, it } from "vitest";

import { recipeSchema, type Recipe } from "@/domain/recipes/recipe";
import { recipeWithPhoto } from "@/domain/recipes/recipeWithPhoto";
import { recipeWithoutPhoto } from "@/domain/recipes/recipeWithoutPhoto";

const owner = "22222222-2222-4222-8222-222222222222";
const id = "11111111-1111-4111-8111-111111111111";

const recipe: Recipe = recipeSchema.parse({
  id,
  ownerId: owner,
  title: "Tortilla de patatas",
  locale: "es-ES",
  ingredients: [{ name: "huevos", quantity: 6 }],
  steps: [{ text: "Bate los huevos." }],
  rawInput: "tortilla",
  createdAt: "2026-10-01T10:00:00.000Z",
  updatedAt: "2026-10-01T10:00:00.000Z",
});

const retouched: Recipe = recipeSchema.parse({
  ...recipe,
  photoOriginal: `${owner}/${id}/original.jpg`,
  photoEnhanced: `${owner}/${id}/enhanced.jpg`,
  photoActive: "enhanced",
});

describe("recipeWithPhoto", () => {
  it("guarda la ruta de la foto y la pone como activa", () => {
    const withPhoto = recipeWithPhoto(recipe, `${owner}/${id}/original.jpg`);
    expect(withPhoto.photoOriginal).toBe(`${owner}/${id}/original.jpg`);
    expect(withPhoto.photoActive).toBe("original");
  });

  it("tira el retoque anterior: era el de otra foto", () => {
    expect(recipeWithPhoto(retouched, `${owner}/${id}/original.jpg`)).not.toHaveProperty(
      "photoEnhanced",
    );
  });

  it("marca la receta como modificada", () => {
    expect(recipeWithPhoto(recipe, `${owner}/${id}/original.jpg`).updatedAt).not.toBe(
      recipe.updatedAt,
    );
  });
});

describe("recipeWithoutPhoto", () => {
  it("se lleva las dos fotos por delante", () => {
    const bare = recipeWithoutPhoto(retouched);
    expect(bare).not.toHaveProperty("photoOriginal");
    expect(bare).not.toHaveProperty("photoEnhanced");
    expect(bare.photoActive).toBe("original");
  });

  it("no toca el resto de la receta", () => {
    expect(recipeWithoutPhoto(retouched).title).toBe(recipe.title);
  });
});
