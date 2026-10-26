import { describe, expect, it } from "vitest";

import { accountFromUser } from "@/features/auth/accountFromUser";

describe("accountFromUser", () => {
  it("reads the name, email and photo that Google leaves", () => {
    const user = {
      email: "sonia@example.com",
      user_metadata: { name: "Sonia Molina", avatar_url: "https://lh3.example.com/a.jpg" },
    };

    expect(accountFromUser(user)).toEqual({
      name: "Sonia Molina",
      email: "sonia@example.com",
      avatarUrl: "https://lh3.example.com/a.jpg",
    });
  });

  it("falls back to Google's own name for the photo", () => {
    const user = {
      email: "a@example.com",
      user_metadata: { picture: "https://lh3.example.com/p.jpg" },
    };

    expect(accountFromUser(user).avatarUrl).toBe("https://lh3.example.com/p.jpg");
  });

  it("has no photo for an email account, and names it from the address", () => {
    const user = { email: "sonia@example.com", user_metadata: {} };

    expect(accountFromUser(user)).toEqual({
      name: "sonia",
      email: "sonia@example.com",
      avatarUrl: null,
    });
  });

  it("ignores metadata that is not text", () => {
    const user = { email: "a@example.com", user_metadata: { name: 3, avatar_url: "" } };

    expect(accountFromUser(user)).toEqual({ name: "a", email: "a@example.com", avatarUrl: null });
  });
});
