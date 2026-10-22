import { describe, expect, it } from "vitest";

import { recipesLeftWithoutCookbook } from "@/domain/cookbooks/recipesLeftWithoutCookbook";

describe("recipesLeftWithoutCookbook", () => {
  it("lists the recipes that are only in this cookbook", () => {
    const membership = [
      { cookbookId: "weekend", recipeId: "paella" },
      { cookbookId: "weekend", recipeId: "flan" },
      { cookbookId: "everyday", recipeId: "flan" },
    ];

    expect(recipesLeftWithoutCookbook(membership, "weekend")).toEqual(["paella"]);
  });

  it("returns nothing when every recipe lives somewhere else too", () => {
    const membership = [
      { cookbookId: "weekend", recipeId: "paella" },
      { cookbookId: "everyday", recipeId: "paella" },
    ];

    expect(recipesLeftWithoutCookbook(membership, "weekend")).toEqual([]);
  });

  it("ignores cookbooks that are not the one being deleted", () => {
    const membership = [{ cookbookId: "everyday", recipeId: "paella" }];

    expect(recipesLeftWithoutCookbook(membership, "weekend")).toEqual([]);
  });

  it("names a repeated recipe once", () => {
    const membership = [
      { cookbookId: "weekend", recipeId: "paella" },
      { cookbookId: "weekend", recipeId: "paella" },
    ];

    expect(recipesLeftWithoutCookbook(membership, "weekend")).toEqual(["paella"]);
  });
});
