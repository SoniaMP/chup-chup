import { describe, expect, it } from "vitest";

import { stepIngredients } from "../../src/domain/cooking/stepIngredients";
import type { Ingredient } from "../../src/domain/recipes/ingredient";

const lentils: Ingredient[] = [
  { name: "lentejas pardinas", quantity: 1, unit: "kg" },
  { name: "zanahorias", quantity: 2, unit: "ud" },
  { name: "cebolla", quantity: 1, unit: "ud" },
  { name: "chorizo", quantity: 1, unit: "ud" },
  { name: "pimentón de la Vera", quantity: 15, unit: "g" },
  { name: "aceite", quantity: 15, unit: "ml" },
];

const namesIn = (step: string, ingredients: Ingredient[] = lentils): string[] =>
  stepIngredients(step, ingredients).map((ingredient) => ingredient.name);

describe("stepIngredients", () => {
  it("encuentra lo que nombra el paso, en el orden de la receta", () => {
    expect(namesIn("Sofríe la cebolla y la zanahoria en el aceite a fuego medio.")).toEqual([
      "zanahorias",
      "cebolla",
      "aceite",
    ]);
  });

  it("no distingue tildes ni mayúsculas", () => {
    expect(namesIn("Añade el PIMENTON y remueve.")).toEqual(["pimentón de la Vera"]);
  });

  it("quita el plural de los dos lados", () => {
    const ingredients: Ingredient[] = [{ name: "limón", quantity: 1 }];
    expect(namesIn("Exprime los limones.", ingredients)).toEqual(["limón"]);
  });

  it("le basta una palabra del nombre", () => {
    const ingredients: Ingredient[] = [{ name: "garbanzos cocidos", quantity: 400, unit: "g" }];
    expect(namesIn("Añade los garbanzos escurridos.", ingredients)).toEqual(["garbanzos cocidos"]);
  });

  it("no se deja llevar por lo que solo describe", () => {
    const ingredients: Ingredient[] = [
      { name: "curry en polvo", quantity: 2, unit: "cdta" },
      { name: "levadura en polvo", quantity: 16, unit: "g" },
    ];
    expect(namesIn("Añade la levadura en polvo.", ingredients)).toEqual(["levadura en polvo"]);
  });

  it("ante la duda enseña los dos", () => {
    const ingredients: Ingredient[] = [
      { name: "aceite de oliva", quantity: 30, unit: "ml" },
      { name: "aceite para freír", quantity: 500, unit: "ml" },
    ];
    expect(namesIn("Calienta el aceite.", ingredients)).toHaveLength(2);
  });

  it("no trae nada cuando el paso no nombra ningún ingrediente", () => {
    expect(namesIn("Deja reposar la masa diez minutos.")).toEqual([]);
  });

  it("no confunde palabras que solo empiezan igual", () => {
    const ingredients: Ingredient[] = [{ name: "sal", quantity: 1, unit: "pizca" }];
    expect(namesIn("Sirve con la salsa por encima.", ingredients)).toEqual([]);
  });
});
