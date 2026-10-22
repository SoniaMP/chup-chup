import { describe, expect, it } from "vitest";
import { draftFromStructuredRecipe } from "../../src/domain/recipes/draftFromStructuredRecipe";
import { recipeDraftSchema } from "../../src/domain/recipes/recipeDraft";
import { structuredRecipeSchema } from "../../src/domain/recipes/structuredRecipe";

const structured = structuredRecipeSchema.parse({
  title: "Tortilla de patatas",
  locale: "es-ES",
  servings: 4,
  ingredients: [{ name: "patatas", quantity: 700, unit: "g" }, { name: "sal" }],
  steps: [{ text: "Pela las patatas." }],
  assumptions: ["He supuesto 4 raciones"],
});

describe("draftFromStructuredRecipe", () => {
  it("produce un borrador válido", () => {
    const draft = draftFromStructuredRecipe(structured, "tortilla: patatas, sal");
    expect(recipeDraftSchema.safeParse(draft).success).toBe(true);
  });

  it("convierte lo que no viene en campos vacíos, no en ceros", () => {
    const draft = draftFromStructuredRecipe(structured, "tortilla");
    expect(draft.prepMin).toBeNull();
    expect(draft.cookMin).toBeNull();
    expect(draft.ingredients[1]?.quantity).toBeNull();
    expect(draft.ingredients[1]?.unit).toBe("");
  });

  it("guarda el texto original y deja las notas en blanco", () => {
    const draft = draftFromStructuredRecipe(structured, "tortilla: patatas, sal");
    expect(draft.rawInput).toBe("tortilla: patatas, sal");
    expect(draft.notes).toBe("");
    expect(draft.assumptions).toEqual(["He supuesto 4 raciones"]);
  });
});
