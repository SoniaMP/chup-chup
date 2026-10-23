import { describe, expect, it } from "vitest";

import type { Cookbook } from "@/domain/cookbooks/cookbook";
import { removalNotice } from "@/features/cookbooks/removalNotice";

const cookbook = (id: string, title: string): Cookbook => ({
  id,
  ownerId: "22222222-2222-4222-8222-222222222222",
  title,
  position: "a",
  isSystem: true,
});

describe("removalNotice", () => {
  it("says nothing when the recipe simply left the cookbook", () => {
    expect(removalNotice({ kind: "removed" }, "weekend")).toBe(null);
  });

  it("says where the recipe went when it had no other cookbook", () => {
    const outcome = { kind: "refiled" as const, cookbook: cookbook("latest", "Últimos chups") };

    expect(removalNotice(outcome, "weekend")).toContain("Últimos chups");
  });

  it("explains why the recipe stayed when it fell back to this very cookbook", () => {
    const outcome = { kind: "refiled" as const, cookbook: cookbook("latest", "Últimos chups") };

    expect(removalNotice(outcome, "latest")).toContain("se queda");
  });

  it("owns up when nothing could be done", () => {
    expect(removalNotice({ kind: "failed" }, "weekend")).toContain("No se ha podido");
  });
});
