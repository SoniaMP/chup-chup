import { describe, expect, it } from "vitest";
import { draftFromRecipe } from "../../src/domain/recipes/draftFromRecipe";
import type { Recipe } from "../../src/domain/recipes/recipe";
import { savedRecipeSchema, type SavedRecipe } from "../../src/domain/recipes/savedRecipe";
import { recipeWithChanges } from "../../src/domain/recipes/recipeWithChanges";
import { validateRecipeDraft } from "../../src/domain/recipes/validateRecipeDraft";

const recipe: SavedRecipe = savedRecipeSchema.parse({
  id: "11111111-1111-4111-8111-111111111111",
  ownerId: "22222222-2222-4222-8222-222222222222",
  title: "Tortilla de patatas",
  locale: "es-ES",
  servings: 4,
  prepMin: 15,
  ingredients: [{ name: "patatas", quantity: 700, unit: "g" }, { name: "sal" }],
  steps: [{ text: "Fríe las patatas." }],
  rawInput: "tortilla: huevos patatas",
  notes: "la próxima vez, menos sal",
  photoOriginal: "https://example.com/original.jpg",
  isFavorite: true,
  createdAt: "2026-10-01T10:00:00.000Z",
  updatedAt: "2026-10-01T10:00:00.000Z",
  savedAt: "2026-10-01T10:00:00.000Z",
});

const edited = (changes: Partial<ReturnType<typeof draftFromRecipe>>): Recipe => {
  const validation = validateRecipeDraft({ ...draftFromRecipe(recipe), ...changes });
  if (!validation.ok) throw new Error(validation.issues[0]?.message ?? "borrador inválido");
  return recipeWithChanges(recipe, validation.value);
};

describe("draftFromRecipe", () => {
  it("abre la receta en el formulario sin perder nada", () => {
    const draft = draftFromRecipe(recipe);
    expect(draft.title).toBe("Tortilla de patatas");
    expect(draft.servings).toBe(4);
    expect(draft.ingredients[0]).toEqual({ name: "patatas", quantity: 700, unit: "g", note: "" });
    expect(draft.notes).toBe("la próxima vez, menos sal");
  });

  it("pone a vacío lo que la receta no tiene", () => {
    const draft = draftFromRecipe(recipe);
    expect(draft.cookMin).toBeNull();
    expect(draft.ingredients[1]).toEqual({ name: "sal", quantity: null, unit: "", note: "" });
  });

  it("no arrastra suposiciones: editar a mano no es estructurar con IA", () => {
    expect(draftFromRecipe(recipe).assumptions).toEqual([]);
  });
});

describe("recipeWithChanges", () => {
  it("conserva identidad, propietaria y fecha de creación", () => {
    const updated = edited({ title: "Tortilla con cebolla" });
    expect(updated.id).toBe(recipe.id);
    expect(updated.ownerId).toBe(recipe.ownerId);
    expect(updated.createdAt).toBe(recipe.createdAt);
    expect(updated.title).toBe("Tortilla con cebolla");
  });

  it("conserva la foto, que el formulario no toca", () => {
    expect(edited({ title: "Otra cosa" }).photoOriginal).toBe("https://example.com/original.jpg");
  });

  it("deja fuera la nota y la estrella: no son de la receta, se guardan aparte", () => {
    const updated = edited({ title: "Otra cosa" });
    expect(updated).not.toHaveProperty("notes");
    expect(updated).not.toHaveProperty("isFavorite");
  });

  it("marca la fecha de modificación", () => {
    expect(edited({ title: "Otra cosa" }).updatedAt > recipe.updatedAt).toBe(true);
  });

  it("vaciar un campo lo borra de verdad, no se queda el valor anterior", () => {
    expect(edited({ servings: null })).not.toHaveProperty("servings");
  });

  it("guarda los ingredientes y los pasos nuevos", () => {
    const updated = edited({ steps: [{ text: "Primero." }, { text: "Después." }] });
    expect(updated.steps).toHaveLength(2);
  });
});
