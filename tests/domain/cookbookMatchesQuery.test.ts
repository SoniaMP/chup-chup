import { describe, expect, it } from "vitest";

import type { Cookbook } from "@/domain/cookbooks/cookbook";
import { cookbookMatchesQuery } from "@/domain/cookbooks/cookbookMatchesQuery";

const cookbook = (title: string): Cookbook => ({
  id: "11111111-1111-4111-8111-111111111111",
  ownerId: "22222222-2222-4222-8222-222222222222",
  title,
  position: "a",
  isSystem: false,
});

describe("cookbookMatchesQuery", () => {
  it("finds a cookbook by part of its name", () => {
    expect(cookbookMatchesQuery(cookbook("Domingos de horno"), "horno")).toBe(true);
  });

  it("ignores accents and capitals", () => {
    expect(cookbookMatchesQuery(cookbook("Últimos chups"), "ultimos")).toBe(true);
  });

  it("asks for every word, in any order", () => {
    expect(cookbookMatchesQuery(cookbook("Cenas de verano"), "verano cenas")).toBe(true);
    expect(cookbookMatchesQuery(cookbook("Cenas de verano"), "cenas invierno")).toBe(false);
  });

  it("matches everything while nothing is written", () => {
    expect(cookbookMatchesQuery(cookbook("Lo que sea"), "   ")).toBe(true);
  });
});
