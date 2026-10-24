import { describe, expect, it } from "vitest";

import { availableRecipeActions } from "@/domain/recipes/recipeActions";

describe("availableRecipeActions", () => {
  it("offers to reorder when the cookbook has more than one recipe", () => {
    expect(availableRecipeActions({ recipeCount: 4, canDeleteCookbook: true })[0]).toBe("reorder");
  });

  it("does not offer to reorder a cookbook with a single recipe", () => {
    expect(availableRecipeActions({ recipeCount: 1, canDeleteCookbook: true })).not.toContain(
      "reorder",
    );
  });

  it("does not offer to delete the cookbook when it is the default one", () => {
    expect(availableRecipeActions({ recipeCount: 3, canDeleteCookbook: false })).not.toContain(
      "deleteCookbook",
    );
  });

  it("always offers the actions about the recipe itself", () => {
    expect(availableRecipeActions({ recipeCount: 1, canDeleteCookbook: false })).toEqual([
      "cover",
      "addToCookbook",
      "removeFromCookbook",
      "delete",
    ]);
  });

  it("leaves deleting the cookbook for last", () => {
    const actions = availableRecipeActions({ recipeCount: 2, canDeleteCookbook: true });

    expect(actions[actions.length - 1]).toBe("deleteCookbook");
  });
});
