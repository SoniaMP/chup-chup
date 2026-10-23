import { describe, expect, it } from "vitest";

import { displayName } from "@/domain/users/displayName";

describe("displayName", () => {
  it("prefers the name when there is one", () => {
    expect(displayName({ email: "sonia@example.com", name: "Sonia" })).toBe("Sonia");
  });

  it("falls back to what comes before the at sign", () => {
    expect(displayName({ email: "sonia.cocina@example.com" })).toBe("sonia.cocina");
  });

  it("ignores a name that is only spaces", () => {
    expect(displayName({ email: "sonia@example.com", name: "   " })).toBe("sonia");
  });

  it("has nothing to show without an email", () => {
    expect(displayName({})).toBe(null);
  });
});
