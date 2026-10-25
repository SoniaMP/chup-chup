import { describe, expect, it } from "vitest";

import { recipeViewerHtml } from "../../src/domain/sharing/recipeViewerHtml";
import type { SharedRecipe } from "../../src/domain/sharing/sharedRecipe";

const base: SharedRecipe = {
  title: "Tortilla de patatas",
  locale: "es-ES",
  author: "Sonia",
  servings: 4,
  prepMin: 15,
  cookMin: 25,
  ingredients: [
    { name: "patatas", quantity: 700, unit: "g" },
    { name: "sal" },
    { name: "cebolla", quantity: 1, note: "grande" },
  ],
  steps: [{ text: "Fríe las patatas." }, { text: "Cuaja la tortilla." }],
  photoUrl: undefined,
};

describe("recipeViewerHtml", () => {
  it("pinta el título, la firma y los dos apartados", () => {
    const html = recipeViewerHtml(base);

    expect(html).toContain("<title>Tortilla de patatas</title>");
    expect(html).toContain("Receta de Sonia");
    expect(html).toContain("<h2>Ingredientes</h2>");
    expect(html).toContain("<h2>Preparación</h2>");
  });

  it("escapa lo que escribe la usuaria", () => {
    const html = recipeViewerHtml({ ...base, title: "<script>alert(1)</script>" });

    expect(html).not.toContain("<script>alert(1)</script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("escapa también dentro de los ingredientes y los pasos", () => {
    const html = recipeViewerHtml({
      ...base,
      ingredients: [{ name: "<b>sal</b>" }],
      steps: [{ text: "Mezcla <img src=x onerror=alert(1)>" }],
    });

    expect(html).not.toContain("<b>sal</b>");
    expect(html).not.toContain("<img src=x");
  });

  it("no deja la foto sin escapar", () => {
    const html = recipeViewerHtml({ ...base, photoUrl: 'https://x/f.jpg" onload="alert(1)' });

    expect(html).not.toContain('onload="alert(1)"');
    expect(html).toContain("&quot;");
  });

  it("pone la cantidad con su unidad, y la nota al lado del nombre", () => {
    const html = recipeViewerHtml(base);

    expect(html).toContain("700 g");
    expect(html).toContain("cebolla (grande)");
  });

  it("deja fuera lo que la receta no tiene", () => {
    const html = recipeViewerHtml({
      ...base,
      author: null,
      servings: undefined,
      prepMin: undefined,
      cookMin: undefined,
      steps: [],
    });

    expect(html).not.toContain("Receta de");
    expect(html).not.toContain("raciones");
    expect(html).not.toContain("<h2>Preparación</h2>");
  });

  it("dice una ración en singular", () => {
    expect(recipeViewerHtml({ ...base, servings: 1 })).toContain("1 ración");
  });

  it("no pide nada a servidores de fuera", () => {
    const html = recipeViewerHtml({ ...base, photoUrl: "https://supabase/foto.jpg" });
    const sources = [...html.matchAll(/(?:src|href)="([^"]*)"/g)].map((match) => match[1]);

    expect(sources).toEqual(["https://supabase/foto.jpg"]);
  });
  it("declara el idioma de la receta, no el nuestro", () => {
    expect(recipeViewerHtml({ ...base, locale: "en" })).toContain('<html lang="en">');
    expect(recipeViewerHtml(base)).toContain('<html lang="es-ES">');
  });

  it("se queda en español si la receta no trae idioma", () => {
    expect(recipeViewerHtml({ ...base, locale: "  " })).toContain('<html lang="es">');
  });

  it("lleva la tarjeta para cuando se pega el enlace", () => {
    const html = recipeViewerHtml(base);

    expect(html).toContain('<meta property="og:title" content="Tortilla de patatas">');
    expect(html).toContain("Receta de Sonia · 4 raciones");
    expect(html).toContain('<meta property="og:locale" content="es_ES">');
    expect(html).toContain('<meta name="twitter:card" content="summary">');
  });

  it("pone la foto en la tarjeta cuando la hay, y la anuncia grande", () => {
    const html = recipeViewerHtml({ ...base, photoUrl: "https://firmada/foto.jpg?token=x" });

    expect(html).toContain('<meta property="og:image" content="https://firmada/foto.jpg?token=x">');
    expect(html).toContain('<meta name="twitter:card" content="summary_large_image">');
  });

  it("dice algo en la tarjeta aunque la receta no tenga ni firma ni tiempos", () => {
    const bare = { ...base, author: null, servings: undefined, prepMin: undefined, cookMin: undefined };

    expect(recipeViewerHtml(bare)).toContain("Una receta compartida desde Chup Chup.");
  });
});
