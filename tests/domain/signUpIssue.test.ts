import { describe, expect, it } from "vitest";

import { signUpIssue } from "@/domain/users/signUpIssue";

const good = { email: "sonia@example.com", password: "tortilla2026" };

describe("signUpIssue", () => {
  it("no pone pegas a un registro completo", () => {
    expect(signUpIssue(good)).toBeNull();
  });

  it("pide el correo cuando no hay", () => {
    expect(signUpIssue({ ...good, email: "   " })).toBe("Falta el correo.");
  });

  it("rechaza un correo sin arroba o sin dominio", () => {
    expect(signUpIssue({ ...good, email: "sonia" })).not.toBeNull();
    expect(signUpIssue({ ...good, email: "sonia@casa" })).not.toBeNull();
  });

  it("pide una contraseña de al menos ocho caracteres", () => {
    expect(signUpIssue({ ...good, password: "corta" })).toContain("8");
  });

  it("no se queja de espacios de más alrededor del correo", () => {
    expect(signUpIssue({ ...good, email: "  sonia@example.com  " })).toBeNull();
  });
});
