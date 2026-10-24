import { describe, expect, it } from "vitest";

import type { Cookbook } from "@/domain/cookbooks/cookbook";
import { availableCookbookActions } from "@/domain/cookbooks/cookbookActions";

const cookbook = (isSystem: boolean): Cookbook => ({
  id: "11111111-1111-4111-8111-111111111111",
  ownerId: "22222222-2222-4222-8222-222222222222",
  title: "Para el finde",
  position: "a",
  isSystem,
});

describe("availableCookbookActions", () => {
  it("lets any cookbook be renamed", () => {
    expect(availableCookbookActions(cookbook(false))).toContain("rename");
    expect(availableCookbookActions(cookbook(true))).toContain("rename");
  });

  it("does not offer to delete the default cookbook", () => {
    expect(availableCookbookActions(cookbook(true))).not.toContain("delete");
  });

  it("offers to delete any other cookbook", () => {
    expect(availableCookbookActions(cookbook(false))).toEqual([
      "rename",
      "cover",
      "reorder",
      "delete",
    ]);
  });

  it("lets any cookbook get a cover, the default one included", () => {
    expect(availableCookbookActions(cookbook(true))).toContain("cover");
    expect(availableCookbookActions(cookbook(false))).toContain("cover");
  });

  it("lets the library be reordered from any cookbook", () => {
    expect(availableCookbookActions(cookbook(true))).toContain("reorder");
    expect(availableCookbookActions(cookbook(false))).toContain("reorder");
  });
});
