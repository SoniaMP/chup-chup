import { describe, expect, it } from "vitest";

import { escapeHtml } from "../../src/domain/sharing/escapeHtml";
import { isShareExpired } from "../../src/domain/sharing/isShareExpired";
import { sharedRecipeFrom } from "../../src/domain/sharing/sharedRecipe";
import { sharedUntil } from "../../src/domain/sharing/sharedUntil";

const content = {
  title: "Tortilla de patatas",
  servings: 4,
  prepMin: 15,
  cookMin: undefined,
  ingredients: [{ name: "patatas", quantity: 700, unit: "g" }],
  steps: [{ text: "Fríe las patatas." }],
};

describe("sharedRecipeFrom", () => {
  it("deja fuera lo personal, aunque venga en lo que se le pasa", () => {
    const saved = { ...content, notes: "menos sal", rawInput: "tortilla huevos", isFavorite: true };
    const shared = sharedRecipeFrom(saved, "Sonia", undefined);

    expect(shared).not.toHaveProperty("notes");
    expect(shared).not.toHaveProperty("rawInput");
    expect(shared).not.toHaveProperty("isFavorite");
  });

  it("lleva lo que sí viaja", () => {
    const shared = sharedRecipeFrom(content, "Sonia", "https://ejemplo/foto.jpg");

    expect(shared.title).toBe("Tortilla de patatas");
    expect(shared.author).toBe("Sonia");
    expect(shared.ingredients).toHaveLength(1);
    expect(shared.photoUrl).toBe("https://ejemplo/foto.jpg");
  });

  it("aguanta no saber de quién es", () => {
    expect(sharedRecipeFrom(content, null, undefined).author).toBeNull();
  });
});

describe("escapeHtml", () => {
  it("desarma las etiquetas", () => {
    expect(escapeHtml('<script>alert("hola")</script>')).toBe(
      "&lt;script&gt;alert(&quot;hola&quot;)&lt;/script&gt;",
    );
  });

  it("escapa el ampersand primero, para no escapar dos veces", () => {
    expect(escapeHtml("sal & pimienta")).toBe("sal &amp; pimienta");
    expect(escapeHtml("&lt;")).toBe("&amp;lt;");
  });

  it("deja en paz un texto normal", () => {
    expect(escapeHtml("700 g de patatas")).toBe("700 g de patatas");
  });
});

describe("isShareExpired", () => {
  const now = new Date("2026-10-24T18:00:00.000Z");

  it("vale mientras no llegue la fecha", () => {
    expect(isShareExpired("2026-11-23T18:00:00.000Z", now)).toBe(false);
  });

  it("deja de valer al llegar", () => {
    expect(isShareExpired("2026-10-24T18:00:00.000Z", now)).toBe(true);
  });

  it("una fecha ilegible se trata como caducada", () => {
    expect(isShareExpired("el jueves", now)).toBe(true);
  });
});

describe("sharedUntil", () => {
  it("lo dice en español", () => {
    expect(sharedUntil("2026-11-23T18:00:00.000Z")).toBe("23 de noviembre");
  });

  it("devuelve null cuando la fecha no se entiende", () => {
    expect(sharedUntil("cuando sea")).toBeNull();
  });
});
