import { describe, expect, it } from "vitest";
import { numberFromText } from "../../src/features/recipes/numberFromText";

describe("numberFromText", () => {
  it("lee números con coma y con punto", () => {
    expect(numberFromText("1,5")).toBe(1.5);
    expect(numberFromText("1.5")).toBe(1.5);
  });

  it("deja en blanco lo vacío y lo ilegible, nunca en cero", () => {
    expect(numberFromText("")).toBeNull();
    expect(numberFromText("   ")).toBeNull();
    expect(numberFromText("un par")).toBeNull();
  });
});
