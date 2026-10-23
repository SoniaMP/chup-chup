import { describe, expect, it } from "vitest";
import { ingredientSchema } from "../../src/domain/recipes/ingredient";

describe("ingredientSchema", () => {
  it("acepta un ingrediente con cantidad y unidad", () => {
    const result = ingredientSchema.safeParse({ name: "patatas", quantity: 700, unit: "g" });
    expect(result.success).toBe(true);
  });

  it("acepta un ingrediente que se cuenta, sin unidad", () => {
    const result = ingredientSchema.safeParse({ name: "huevos", quantity: 6 });
    expect(result.success).toBe(true);
  });

  it("acepta un ingrediente al gusto, sin cantidad", () => {
    const result = ingredientSchema.safeParse({ name: "sal" });
    expect(result.success).toBe(true);
  });

  it("recorta los espacios del nombre", () => {
    const result = ingredientSchema.parse({ name: "  cebolla  " });
    expect(result.name).toBe("cebolla");
  });

  it("rechaza el nombre vacío", () => {
    const result = ingredientSchema.safeParse({ name: "   " });
    expect(result.success).toBe(false);
  });

  it("rechaza una cantidad de cero o negativa", () => {
    expect(ingredientSchema.safeParse({ name: "harina", quantity: 0 }).success).toBe(false);
    expect(ingredientSchema.safeParse({ name: "harina", quantity: -200 }).success).toBe(false);
  });

  it("rechaza una unidad sin cantidad, que no dice nada", () => {
    const result = ingredientSchema.safeParse({ name: "aceite", unit: "ml" });
    expect(result.success).toBe(false);
  });

  it("ignora las claves que no conoce", () => {
    const result = ingredientSchema.parse({ name: "azúcar", quantity: 300, unit: "g", color: "blanco" });
    expect(result).not.toHaveProperty("color");
  });

  it("takes an empty unit as no unit, which is what the AI sends for things you count", () => {
    const result = ingredientSchema.safeParse({ name: "huevos", quantity: 3, unit: "" });

    expect(result.success).toBe(true);
    expect(result.data).toEqual({ name: "huevos", quantity: 3 });
  });

  it("takes an empty note as no note", () => {
    const result = ingredientSchema.safeParse({ name: "sal", note: "   " });

    expect(result.success).toBe(true);
    expect(result.data).toEqual({ name: "sal" });
  });
});
