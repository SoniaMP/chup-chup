import type { Ingredient } from "../recipes/ingredient.ts";
import { escapeHtml } from "./escapeHtml.ts";
import type { SharedRecipe } from "./sharedRecipe.ts";

// Los colores son los de la app (`src/theme/palette.ts`), copiados a mano: esta página se sirve
// desde una Edge Function y no puede importar nada de React Native.
const STYLE = `
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 24px 20px 64px;
    background: #FDF6EA;
    color: #2C1A14;
    font: 17px/1.6 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }
  main { max-width: 40rem; margin: 0 auto; }
  h1 { font-family: Georgia, "Times New Roman", serif; font-size: 2rem; line-height: 1.2; margin: 0 0 4px; }
  .author { color: #725F54; font-size: 0.95rem; margin: 0 0 20px; }
  .photo { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: 16px; display: block; margin-bottom: 24px; }
  .facts { display: flex; flex-wrap: wrap; gap: 8px; padding: 0; margin: 0 0 28px; list-style: none; }
  .facts li { background: #F4E6D2; border-radius: 999px; padding: 6px 14px; font-size: 0.9rem; }
  h2 { font-family: Georgia, "Times New Roman", serif; font-size: 1.3rem; margin: 0 0 12px; }
  .ingredients { background: #FFFDF8; border-radius: 20px; padding: 4px 20px; margin: 0 0 32px; list-style: none; }
  .ingredients li { display: flex; gap: 14px; padding: 12px 0; border-top: 1px solid #E5D8C9; }
  .ingredients li:first-child { border-top: 0; }
  .amount { color: #CF542C; font-weight: 600; min-width: 72px; }
  .steps { margin: 0 0 40px; padding-left: 1.3em; }
  .steps li { margin-bottom: 14px; padding-left: 6px; }
  footer { color: #725F54; font-size: 0.85rem; text-align: center; border-top: 1px solid #E5D8C9; padding-top: 20px; }
`;

const amountOf = (ingredient: Ingredient): string => {
  if (ingredient.quantity === undefined) return "";

  const unit = ingredient.unit === undefined ? "" : ` ${ingredient.unit}`;
  return `${String(ingredient.quantity)}${unit}`;
};

const nameOf = (ingredient: Ingredient): string =>
  ingredient.note === undefined ? ingredient.name : `${ingredient.name} (${ingredient.note})`;

const factsOf = (recipe: SharedRecipe): string[] => {
  const facts: string[] = [];

  if (recipe.servings !== undefined) {
    facts.push(recipe.servings === 1 ? "1 ración" : `${String(recipe.servings)} raciones`);
  }
  if (recipe.prepMin !== undefined) facts.push(`${String(recipe.prepMin)} min de preparación`);
  if (recipe.cookMin !== undefined) facts.push(`${String(recipe.cookMin)} min de cocción`);

  return facts;
};

const listOf = (items: string[], tag: string, className: string): string =>
  items.length === 0 ? "" : `<${tag} class="${className}">${items.join("")}</${tag}>`;

const photoOf = (recipe: SharedRecipe): string =>
  recipe.photoUrl === undefined
    ? ""
    : `<img class="photo" src="${escapeHtml(recipe.photoUrl)}" alt="${escapeHtml(recipe.title)}">`;

const authorOf = (recipe: SharedRecipe): string =>
  recipe.author === null ? "" : `<p class="author">Receta de ${escapeHtml(recipe.author)}</p>`;

/** El idioma de la receta, o español si viniera vacío: una página sin `lang` no la lee nadie bien. */
const langOf = (recipe: SharedRecipe): string =>
  recipe.locale.trim() === "" ? "es" : recipe.locale.trim();

/** La línea que se lee en la vista previa de WhatsApp, debajo del título. */
const descriptionOf = (recipe: SharedRecipe): string => {
  const author = recipe.author === null ? [] : [`Receta de ${recipe.author}`];
  const line = [...author, ...factsOf(recipe)].join(" · ");

  return line === "" ? "Una receta compartida desde Chup Chup." : line;
};

/**
 * Lo que hace que el enlace se vea como una tarjeta al pegarlo, en vez de como una línea de texto.
 *
 * No lleva `og:url`: detrás de nginx la función no sabe desde qué dirección la están sirviendo, y
 * adivinarla a partir de una cabecera que cualquiera puede poner es peor que no decirlo. La imagen
 * es la foto firmada, así que la tarjeta se arma mientras la firma viva; después, el enlace sigue
 * funcionando pero se queda sin foto.
 */
const socialTags = (recipe: SharedRecipe, title: string): string => {
  const photo =
    recipe.photoUrl === undefined
      ? ""
      : `<meta property="og:image" content="${escapeHtml(recipe.photoUrl)}">`;

  return `<meta property="og:type" content="article">
<meta property="og:site_name" content="Chup Chup">
<meta property="og:locale" content="${escapeHtml(langOf(recipe).replace("-", "_"))}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${escapeHtml(descriptionOf(recipe))}">
${photo}
<meta name="twitter:card" content="${recipe.photoUrl === undefined ? "summary" : "summary_large_image"}">`;
};

/**
 * La receta compartida, como página de solo lectura.
 *
 * Todo lo que viene de la usuaria pasa por `escapeHtml`, incluida la dirección de la foto. La
 * página no trae ni tipografías ni scripts de fuera: se abre entera con lo que ya tiene, y así
 * tampoco le cuenta a nadie quién la está leyendo.
 */
export function recipeViewerHtml(recipe: SharedRecipe): string {
  const title = escapeHtml(recipe.title);
  const facts = factsOf(recipe).map((fact) => `<li>${escapeHtml(fact)}</li>`);
  const ingredients = recipe.ingredients.map(
    (ingredient) =>
      `<li><span class="amount">${escapeHtml(amountOf(ingredient))}</span>` +
      `<span>${escapeHtml(nameOf(ingredient))}</span></li>`,
  );
  const steps = recipe.steps.map((step) => `<li>${escapeHtml(step.text)}</li>`);

  return `<!doctype html>
<html lang="${escapeHtml(langOf(recipe))}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${title}</title>
${socialTags(recipe, title)}
<style>${STYLE}</style>
</head>
<body>
<main>
<h1>${title}</h1>
${authorOf(recipe)}
${photoOf(recipe)}
${listOf(facts, "ul", "facts")}
${ingredients.length === 0 ? "" : `<h2>Ingredientes</h2>${listOf(ingredients, "ul", "ingredients")}`}
${steps.length === 0 ? "" : `<h2>Preparación</h2>${listOf(steps, "ol", "steps")}`}
<footer>Compartido desde Chup Chup</footer>
</main>
</body>
</html>`;
}
