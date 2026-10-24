import { describe, expect, it } from "vitest";

import type { SavedRecipe } from "../../src/domain/recipes/savedRecipe";
import { entriesFromPlacements } from "../../src/features/cookbooks/entriesFromPlacements";

const recipe = (id: string, title: string): SavedRecipe =>
  ({ id, title, isFavorite: false }) as unknown as SavedRecipe;

const recipes = [recipe("r1", "Tortilla"), recipe("r2", "Gazpacho"), recipe("r3", "Croquetas")];

const placements = [
  { cookbookId: "b1", recipeId: "r2", position: "n" },
  { cookbookId: "b1", recipeId: "r1", position: "a" },
  { cookbookId: "b2", recipeId: "r3", position: "a" },
];

describe("entriesFromPlacements", () => {
  it("se queda con las recetas de ese libro y en su orden", () => {
    const entries = entriesFromPlacements(placements, recipes, "b1");

    expect(entries.map((entry) => entry.recipe.title)).toEqual(["Tortilla", "Gazpacho"]);
  });

  it("deja el libro vacío cuando no hay nada suyo", () => {
    expect(entriesFromPlacements(placements, recipes, "b3")).toEqual([]);
  });

  it("deja fuera la receta que no está guardada, en vez de inventarla", () => {
    const entries = entriesFromPlacements(placements, [recipe("r1", "Tortilla")], "b1");

    expect(entries).toHaveLength(1);
  });

  it("conserva la posición, que es lo que ordena al arrastrar", () => {
    expect(entriesFromPlacements(placements, recipes, "b2")[0]?.position).toBe("a");
  });
});
