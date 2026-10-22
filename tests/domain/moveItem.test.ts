import { describe, expect, it } from "vitest";

import { moveItem } from "@/domain/ordering/moveItem";

describe("moveItem", () => {
  it("moves an item down", () => {
    expect(moveItem(["a", "b", "c", "d"], 0, 2)).toEqual(["b", "c", "a", "d"]);
  });

  it("moves an item up", () => {
    expect(moveItem(["a", "b", "c", "d"], 3, 1)).toEqual(["a", "d", "b", "c"]);
  });

  it("leaves the list alone when the item does not move", () => {
    expect(moveItem(["a", "b", "c"], 1, 1)).toEqual(["a", "b", "c"]);
  });

  it("ignores a position that is not in the list", () => {
    expect(moveItem(["a", "b"], 5, 0)).toEqual(["a", "b"]);
  });
});
