import { describe, expect, it } from "vitest";
import { parseStructuredRecipe } from "../../src/features/ai/parseStructuredRecipe";

const response = {
  title: "Tortilla de patatas",
  locale: "es-ES",
  servings: 4,
  prepMin: 15,
  cookMin: 25,
  ingredients: [{ name: "patatas", quantity: 700, unit: "g" }],
  steps: [{ text: "Pela las patatas." }],
  assumptions: [],
};

describe("parseStructuredRecipe", () => {
  it("acepta una respuesta ya correcta", () => {
    const result = parseStructuredRecipe(response);
    expect(result.ok).toBe(true);
  });

  it("convierte los números que llegan como texto", () => {
    const result = parseStructuredRecipe({
      ...response,
      servings: "4",
      ingredients: [{ name: "patatas", quantity: "700", unit: "g" }],
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.servings).toBe(4);
      expect(result.value.ingredients[0]?.quantity).toBe(700);
    }
  });

  it("lee la coma decimal", () => {
    const result = parseStructuredRecipe({
      ...response,
      ingredients: [{ name: "levadura", quantity: "0,5", unit: "cdta" }],
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.ingredients[0]?.quantity).toBe(0.5);
  });

  it("trata null y cadena vacía como campo ausente", () => {
    const result = parseStructuredRecipe({ ...response, servings: null, cookMin: "" });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.servings).toBeUndefined();
      expect(result.value.cookMin).toBeUndefined();
    }
  });

  it("descarta la unidad vacía en vez de romper la regla de unidad sin cantidad", () => {
    const result = parseStructuredRecipe({
      ...response,
      ingredients: [{ name: "sal", quantity: null, unit: "" }],
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.ingredients[0]?.unit).toBeUndefined();
  });

  it("normaliza las unidades a minúsculas", () => {
    const result = parseStructuredRecipe({
      ...response,
      ingredients: [{ name: "leche", quantity: 750, unit: "ML" }],
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.ingredients[0]?.unit).toBe("ml");
  });

  it("acepta un paso que llega como cadena suelta", () => {
    const result = parseStructuredRecipe({ ...response, steps: ["Bate los huevos."] });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.steps[0]?.text).toBe("Bate los huevos.");
  });

  it("pone la lista de suposiciones vacía si falta, y tira las que vienen en blanco", () => {
    const sinLista = parseStructuredRecipe({ ...response, assumptions: undefined });
    expect(sinLista.ok && sinLista.value.assumptions).toEqual([]);

    const conBlancos = parseStructuredRecipe({ ...response, assumptions: ["   ", "He supuesto 4 raciones"] });
    expect(conBlancos.ok && conBlancos.value.assumptions).toEqual(["He supuesto 4 raciones"]);
  });

  it("rechaza lo que no es un objeto, sin lanzar", () => {
    expect(parseStructuredRecipe("una tortilla")).toEqual({
      ok: false,
      error: "La IA no ha devuelto un objeto",
    });
    expect(parseStructuredRecipe(null).ok).toBe(false);
    expect(parseStructuredRecipe([]).ok).toBe(false);
  });

  it("rechaza una cantidad que no es un número", () => {
    const result = parseStructuredRecipe({
      ...response,
      ingredients: [{ name: "aceite", quantity: "un chorrito" }],
    });
    expect(result.ok).toBe(false);
  });

  it("dice qué campo falla cuando la receta no es válida", () => {
    const result = parseStructuredRecipe({ ...response, ingredients: [] });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("ingredients: La receta necesita al menos un ingrediente");
  });
});
