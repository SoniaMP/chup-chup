import { describe, expect, it } from "vitest";

import { recipeFacts } from "../../src/domain/recipes/recipeFacts";

describe("recipeFacts", () => {
  it("pinta lo que la receta dice", () => {
    expect(recipeFacts({ prepMin: 15, cookMin: 40, servings: 8 })).toEqual([
      { label: "Preparación", value: "15 min" },
      { label: "Cocción", value: "40 min" },
      { label: "Raciones", value: "8" },
    ]);
  });

  it("lo que falta no sale", () => {
    expect(recipeFacts({ cookMin: 40 })).toEqual([{ label: "Cocción", value: "40 min" }]);
  });

  it("sin nada, nada", () => {
    expect(recipeFacts({})).toEqual([]);
  });
});
