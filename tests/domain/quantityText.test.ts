import { describe, expect, it } from "vitest";

import { ingredientAmount } from "../../src/domain/recipes/ingredientAmount";
import { quantityText } from "../../src/domain/recipes/quantityText";

describe("quantityText", () => {
  it("los enteros, tal cual", () => {
    expect(quantityText(250)).toBe("250");
  });

  it("las medias y los cuartos, con su fracción", () => {
    expect(quantityText(1.5)).toBe("1½");
    expect(quantityText(0.5)).toBe("½");
    expect(quantityText(0.75)).toBe("¾");
  });

  it("el resto de decimales, con coma", () => {
    expect(quantityText(1.3)).toBe("1,3");
    expect(quantityText(0.1)).toBe("0,1");
  });
});

describe("ingredientAmount", () => {
  it("junta la cantidad y la unidad", () => {
    expect(ingredientAmount({ name: "azúcar", quantity: 1.5, unit: "cda" })).toBe("1½ cda");
  });

  it("sin unidad, solo la cantidad", () => {
    expect(ingredientAmount({ name: "huevos", quantity: 3 })).toBe("3");
  });

  it("sin cantidad, nada", () => {
    expect(ingredientAmount({ name: "sal al gusto" })).toBe("");
  });
});
