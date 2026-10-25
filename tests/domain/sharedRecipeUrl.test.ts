import { describe, expect, it } from "vitest";

import { sharedRecipeUrl } from "@/domain/sharing/sharedRecipeUrl";

const FUNCTIONS = "https://abc.supabase.co";

describe("sharedRecipeUrl", () => {
  it("cuelga del dominio propio cuando lo hay", () => {
    expect(sharedRecipeUrl("tok3n", "https://chup-chup.es", FUNCTIONS)).toBe(
      "https://chup-chup.es/r/tok3n",
    );
  });

  it("no deja dos barras si la base viene con una al final", () => {
    expect(sharedRecipeUrl("tok3n", "https://chup-chup.es/", FUNCTIONS)).toBe(
      "https://chup-chup.es/r/tok3n",
    );
  });

  it("se cae a la Edge Function mientras no haya dominio", () => {
    expect(sharedRecipeUrl("tok3n", "", FUNCTIONS)).toBe(
      "https://abc.supabase.co/functions/v1/shared-recipe?t=tok3n",
    );
  });

  it("escapa el testigo en los dos caminos", () => {
    expect(sharedRecipeUrl("a/b+c", "https://chup-chup.es", FUNCTIONS)).toContain("a%2Fb%2Bc");
    expect(sharedRecipeUrl("a/b+c", "", FUNCTIONS)).toContain("a%2Fb%2Bc");
  });
});
