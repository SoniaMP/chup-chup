import { describe, expect, it } from "vitest";
import type { RecipeDraft } from "../../src/domain/recipes/recipeDraft";
import { validateRecipeDraft } from "../../src/domain/recipes/validateRecipeDraft";

const draft = (overrides: Partial<RecipeDraft> = {}): RecipeDraft => ({
  title: "Bizcocho de yogur",
  locale: "es-ES",
  rawInput: "1 yogur, 3 vasos de harina, un chorrito de aceite",
  servings: 8,
  prepMin: 10,
  cookMin: 35,
  ingredients: [{ name: "yogur natural", quantity: 125, unit: "g", note: "" }],
  steps: [{ text: "Bate los huevos con el azúcar y el yogur." }],
  notes: "",
  assumptions: ["He supuesto 15 ml de aceite para el chorrito"],
  ...overrides,
});

describe("validateRecipeDraft", () => {
  it("convierte un borrador completo en una receta lista para guardar", () => {
    const result = validateRecipeDraft(draft());
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.title).toBe("Bizcocho de yogur");
  });

  it("trata las cadenas vacías como campos sin rellenar, no como valores", () => {
    const result = validateRecipeDraft(draft());
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.notes).toBeUndefined();
      expect(result.value.ingredients[0]?.note).toBeUndefined();
    }
  });

  it("acepta un borrador sin raciones ni tiempos todavía", () => {
    const result = validateRecipeDraft(draft({ servings: null, prepMin: null, cookMin: null }));
    expect(result.ok).toBe(true);
  });

  it("dice que falta el título y en qué campo", () => {
    const result = validateRecipeDraft(draft({ title: "" }));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues).toHaveLength(1);
      expect(result.issues[0]).toEqual({
        field: "title",
        message: "La receta necesita un título",
      });
    }
  });

  it("descarta las filas del formulario que no se han tocado", () => {
    const result = validateRecipeDraft(
      draft({
        ingredients: [
          { name: "harina", quantity: 300, unit: "g", note: "" },
          { name: "", quantity: null, unit: "", note: "" },
        ],
        steps: [{ text: "Bate los huevos." }, { text: "   " }],
      }),
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.ingredients).toHaveLength(1);
      expect(result.value.steps).toHaveLength(1);
    }
  });

  it("señala el ingrediente a medias, con cantidad pero sin nombre", () => {
    const result = validateRecipeDraft(
      draft({
        ingredients: [
          { name: "harina", quantity: 300, unit: "g", note: "" },
          { name: "", quantity: 2, unit: "ud", note: "" },
        ],
      }),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.issues[0]?.field).toBe("ingredients.1.name");
  });

  it("deja guardar una receta sin ingredientes o sin pasos: es decisión de la usuaria", () => {
    expect(validateRecipeDraft(draft({ ingredients: [] })).ok).toBe(true);
    expect(validateRecipeDraft(draft({ steps: [] })).ok).toBe(true);
  });

  it("no arrastra las suposiciones de la IA a lo que se guarda", () => {
    const result = validateRecipeDraft(draft());
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).not.toHaveProperty("assumptions");
  });
});
