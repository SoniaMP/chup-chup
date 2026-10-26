import { describe, expect, it } from "vitest";

import { initialOf } from "@/domain/users/initialOf";

describe("initialOf", () => {
  it("takes the first letter of the name, in capitals", () => {
    expect(initialOf("sonia.cocina")).toBe("S");
  });

  it("skips leading spaces", () => {
    expect(initialOf("  Óscar")).toBe("Ó");
  });

  it("has nothing to show without a name", () => {
    expect(initialOf(null)).toBe(null);
    expect(initialOf("   ")).toBe(null);
  });
});
