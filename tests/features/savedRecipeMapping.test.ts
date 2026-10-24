import { describe, expect, it } from "vitest";
import { rowFromSavedRecipe } from "../../src/features/recipes/rowFromSavedRecipe";
import { savedRecipeFromRow } from "../../src/features/recipes/savedRecipeFromRow";

const recipes = {
  id: "11111111-1111-4111-8111-111111111111",
  owner_id: "22222222-2222-4222-8222-222222222222",
  title: "Tortilla de patatas",
  locale: "es-ES",
  servings: 4,
  prep_min: 15,
  cook_min: null,
  ingredients: [{ name: "patatas", quantity: 700, unit: "g" }],
  steps: [{ text: "Fríe las patatas con la cebolla." }],
  raw_input: "tortilla: huevos patatas cebolla",
  photo_original: null,
  photo_enhanced: null,
  photo_active: "original",
  created_at: "2026-10-22T09:00:00+00:00",
  updated_at: "2026-10-22T09:30:00.123456+00:00",
};

const row = {
  owner_id: "22222222-2222-4222-8222-222222222222",
  recipe_id: recipes.id,
  notes: "la próxima vez, menos sal",
  is_favorite: true,
  library_image: "cream-marble.jpg",
  saved_at: "2026-10-22T09:00:00+00:00",
  recipes,
};

describe("savedRecipeFromRow", () => {
  it("junta el contenido y lo personal en una sola receta", () => {
    const saved = savedRecipeFromRow(row);
    expect(saved.title).toBe("Tortilla de patatas");
    expect(saved.notes).toBe("la próxima vez, menos sal");
    expect(saved.isFavorite).toBe(true);
    expect(saved.libraryImage).toBe("cream-marble.jpg");
  });

  it("la receta conserva su identidad y su dueña, no las de quien la guarda", () => {
    const saved = savedRecipeFromRow(row);
    expect(saved.id).toBe(recipes.id);
    expect(saved.ownerId).toBe(recipes.owner_id);
  });

  it("deja fuera lo personal que viene a null", () => {
    const saved = savedRecipeFromRow({ ...row, notes: null, library_image: null });
    expect(saved).not.toHaveProperty("notes");
    expect(saved).not.toHaveProperty("libraryImage");
  });

  it("convierte las fechas con desplazamiento de Postgres a ISO con Z", () => {
    expect(savedRecipeFromRow(row).savedAt).toBe("2026-10-22T09:00:00.000Z");
  });
});

describe("rowFromSavedRecipe", () => {
  it("guarda la parte personal apuntando a la receta, y sin dueña", () => {
    expect(rowFromSavedRecipe(savedRecipeFromRow(row))).toEqual({
      recipe_id: recipes.id,
      notes: "la próxima vez, menos sal",
      is_favorite: true,
      library_image: "cream-marble.jpg",
      saved_at: "2026-10-22T09:00:00.000Z",
    });
  });

  it("pone a null lo que no tiene", () => {
    const written = rowFromSavedRecipe(savedRecipeFromRow({ ...row, notes: null, library_image: null }));
    expect(written.notes).toBeNull();
    expect(written.library_image).toBeNull();
  });
});
