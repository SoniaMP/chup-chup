import { describe, expect, it } from "vitest";

import { clampServings } from "../../src/domain/cooking/clampServings";
import { scaledIngredients } from "../../src/domain/cooking/scaledIngredients";
import { peopleText } from "../../src/domain/cooking/peopleText";
import { servingsNote } from "../../src/domain/cooking/servingsNote";

describe("clampServings", () => {
  it("no baja de una ración", () => {
    expect(clampServings(0)).toBe(1);
  });

  it("no pasa de cien", () => {
    expect(clampServings(101)).toBe(100);
  });
});

describe("scaledIngredients", () => {
  const ingredients = [
    { name: "cebolla", quantity: 1 },
    { name: "harina", quantity: 250, unit: "g" },
  ];

  it("escala de las raciones de la receta a las elegidas", () => {
    expect(scaledIngredients(ingredients, 2, 3).map((i) => i.quantity)).toEqual([1.5, 380]);
  });

  it("sin raciones en la receta no escala", () => {
    expect(scaledIngredients(ingredients, undefined, 6)).toBe(ingredients);
  });

  it("con las mismas raciones no toca nada", () => {
    expect(scaledIngredients(ingredients, 4, 4)).toEqual(ingredients);
  });
});

describe("peopleText", () => {
  it("en singular y en plural", () => {
    expect(peopleText(1)).toBe("1 persona");
    expect(peopleText(6)).toBe("6 personas");
  });
});

describe("servingsNote", () => {
  it("avisa de que las cantidades se han ajustado", () => {
    expect(servingsNote(6, 8)).toBe(
      "Cantidades ajustadas para 6 personas. La receta original es para 8 personas.",
    );
  });

  it("sin cambios no dice nada", () => {
    expect(servingsNote(8, 8)).toBeNull();
  });
});
