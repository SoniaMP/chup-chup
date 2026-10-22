import { describe, expect, it } from "vitest";

import { availableRecipeActions } from "@/domain/recipes/recipeActions";

describe("availableRecipeActions", () => {
  it("offers to reorder when the cookbook has more than one recipe", () => {
    expect(availableRecipeActions(4)[0]).toBe("reorder");
  });

  it("does not offer to reorder a cookbook with a single recipe", () => {
    expect(availableRecipeActions(1)).not.toContain("reorder");
  });

  it("always offers the actions about the recipe itself", () => {
    expect(availableRecipeActions(1)).toEqual(["addToCookbook", "removeFromCookbook", "delete"]);
  });
});
