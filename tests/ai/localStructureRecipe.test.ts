import { describe, expect, it } from "vitest";
import { localStructureRecipe } from "../../src/features/ai/localStructureRecipe";

const text = [
  "Tortilla de patatas",
  "6 huevos, 700 g de patatas, 1 cebolla, sal",
  "se fríen las patatas con la cebolla.",
  "se baten los huevos y se cuaja todo en la sartén.",
].join("\n");

describe("localStructureRecipe", () => {
  it("devuelve una receta que cumple el contrato de la IA", () => {
    const result = localStructureRecipe(text);
    expect(result.ok).toBe(true);
  });

  it("separa la cantidad y la unidad del nombre", () => {
    const result = localStructureRecipe(text);
    if (!result.ok) throw new Error(result.error);

    const potatoes = result.value.ingredients.find((i) => i.name === "patatas");
    expect(potatoes).toEqual({ name: "patatas", quantity: 700, unit: "g" });
    expect(result.value.ingredients.every((i) => !/\d/.test(i.name))).toBe(true);
  });

  it("avisa de que no lo ha ordenado la IA", () => {
    const result = localStructureRecipe(text);
    if (!result.ok) throw new Error(result.error);
    expect(result.value.assumptions).toHaveLength(1);
  });

  it("parte en pasos un párrafo escrito del tirón", () => {
    const result = localStructureRecipe(
      "Sopa de calabaza\n800 g de calabaza, 1 puerro\nse sofríe el puerro. se añade la calabaza y se cuece 25 minutos. se tritura hasta que quede fina.",
    );
    if (!result.ok) throw new Error(result.error);
    // Cada acción es un paso: "se añade la calabaza y se cuece 25 minutos" son dos cosas.
    expect(result.value.steps).toHaveLength(4);
    expect(result.value.steps[3]?.text).toBe("se tritura hasta que quede fina.");
  });

  it("no confunde una frase larga sin comas con una lista de ingredientes", () => {
    const result = localStructureRecipe("Arroz\n200 g de arroz\ndeja reposar el arroz tapado unos cinco minutos antes de servirlo");
    if (!result.ok) throw new Error(result.error);
    expect(result.value.steps).toHaveLength(1);
    expect(result.value.ingredients).toHaveLength(1);
  });

  it("no revienta con un texto que no da para una receta", () => {
    const result = localStructureRecipe("   ");
    expect(result.ok).toBe(false);
  });
});

describe("localStructureRecipe con el texto de ejemplo de la app", () => {
  const example = [
    "Tortilla de patatas",
    "",
    "6 huevos, 700gr de patatas, 1 cebolla, aceite, sal",
    "",
    "se fríen las patatas con la cebolla, se baten los huevos y se cuaja todo en la sartén",
  ].join("\n");

  it("saca cinco ingredientes y tres pasos", () => {
    const result = localStructureRecipe(example);
    if (!result.ok) throw new Error(result.error);

    expect(result.value.ingredients).toHaveLength(5);
    expect(result.value.steps.map((step) => step.text)).toEqual([
      "se fríen las patatas con la cebolla",
      "se baten los huevos",
      "se cuaja todo en la sartén",
    ]);
  });

  it("escribe los gramos como g, no como gr", () => {
    const result = localStructureRecipe(example);
    if (!result.ok) throw new Error(result.error);

    expect(result.value.ingredients[1]).toEqual({ name: "patatas", quantity: 700, unit: "g" });
  });
});
