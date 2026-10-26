import { describe, expect, it } from "vitest";

import { roundScaledQuantity } from "../../src/domain/cooking/roundScaledQuantity";
import { scaleIngredient } from "../../src/domain/cooking/scaleIngredient";

describe("roundScaledQuantity", () => {
  it("los gramos, al entero hasta 20, de 5 en 5 hasta 100 y de 10 en 10 después", () => {
    expect(roundScaledQuantity(7.5, "g", "sal")).toBe(8);
    expect(roundScaledQuantity(22, "g", "pimentón")).toBe(20);
    expect(roundScaledQuantity(373, "g", "harina")).toBe(370);
    expect(roundScaledQuantity(375, "ml", "leche")).toBe(380);
  });

  it("kilos y litros, a la décima", () => {
    expect(roundScaledQuantity(1.33, "kg", "lentejas")).toBeCloseTo(1.3);
  });

  it("lo que se cuenta, a la media y nunca por debajo de media", () => {
    expect(roundScaledQuantity(1.5, undefined, "cebolla")).toBe(1.5);
    expect(roundScaledQuantity(1.33, "ud", "zanahoria")).toBe(1.5);
    expect(roundScaledQuantity(0.25, undefined, "cebolla")).toBe(0.5);
  });

  it("las cucharadas, a la media", () => {
    expect(roundScaledQuantity(2.67, "cda", "azúcar")).toBe(2.5);
  });

  it("los huevos y las latas, a la unidad", () => {
    expect(roundScaledQuantity(4.5, undefined, "huevos")).toBe(5);
    expect(roundScaledQuantity(0.5, undefined, "huevo")).toBe(1);
    expect(roundScaledQuantity(1.5, "lata", "tomate")).toBe(2);
  });

  it("una pizca no se parte", () => {
    expect(roundScaledQuantity(0.5, "pizca", "sal")).toBe(1);
  });
});

describe("scaleIngredient", () => {
  it("multiplica y redondea", () => {
    expect(scaleIngredient({ name: "harina", quantity: 250, unit: "g" }, 1.5).quantity).toBe(380);
  });

  it("sin escalar no toca lo que se escribió", () => {
    const original = { name: "harina", quantity: 373, unit: "g" };
    expect(scaleIngredient(original, 1)).toBe(original);
  });

  it("deja en paz lo que no tiene cantidad", () => {
    const original = { name: "sal al gusto" };
    expect(scaleIngredient(original, 2)).toBe(original);
  });

  it("no arrastra decimales de coma flotante", () => {
    expect(scaleIngredient({ name: "lentejas", quantity: 1, unit: "kg" }, 1.2).quantity).toBe(1.2);
  });
});
