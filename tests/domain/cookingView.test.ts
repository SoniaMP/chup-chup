import { describe, expect, it } from "vitest";

import { cookingView } from "../../src/domain/cooking/cookingView";

const recipe = {
  locale: "es-ES",
  ingredients: [
    { name: "cebolla", quantity: 1 },
    { name: "chorizo", quantity: 150, unit: "g" },
  ],
  steps: [{ text: "Sofríe la cebolla." }, { text: "Corta el chorizo en rodajas." }],
};

describe("cookingView", () => {
  it("trae el paso con sus cantidades y el siguiente con las suyas", () => {
    const view = cookingView(recipe, 0);

    expect(view?.current.ingredients.map((i) => i.name)).toEqual(["cebolla"]);
    expect(view?.next?.ingredients.map((i) => i.name)).toEqual(["chorizo"]);
    expect(view?.isLast).toBe(false);
  });

  it("en el último paso no hay siguiente", () => {
    const view = cookingView(recipe, 1);

    expect(view?.next).toBeUndefined();
    expect(view?.isLast).toBe(true);
  });

  it("prepara lo que va a decir la voz", () => {
    expect(cookingView(recipe, 1)?.speech).toBe(
      "Paso 2. Corta el chorizo en rodajas. Necesitas: 150 gramos de chorizo.",
    );
  });

  it("propone el tiempo del paso, con el nombre de lo que se cocina", () => {
    const withTime = { ...recipe, steps: [{ text: "Sofríe la cebolla 10 minutos." }] };

    expect(cookingView(withTime, 0)?.timer).toEqual({
      minutes: 10,
      isFromStep: true,
      label: "Cebolla",
    });
  });

  it("sin tiempo en el paso, cinco minutos y el número del paso", () => {
    const plain = { ...recipe, steps: [{ text: "Precalienta el horno." }] };

    expect(cookingView(plain, 0)?.timer).toEqual({
      minutes: 5,
      isFromStep: false,
      label: "Paso 1",
    });
  });

  it("sin pasos no hay nada que cocinar", () => {
    expect(cookingView({ ...recipe, steps: [] }, 0)).toBeNull();
  });
});
