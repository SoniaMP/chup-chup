import {
  structuredRecipeSchema,
  type StructuredRecipe,
} from "../../domain/recipes/structuredRecipe";

export type ParsedRecipe =
  | { ok: true; value: StructuredRecipe }
  | { ok: false; error: string };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** Acepta 4 y "4"; lo que no se pueda leer como número se deja en NaN para que Zod lo rechace. */
const asNumber = (value: unknown): number | undefined => {
  if (value === null || value === undefined || value === "") return undefined;
  if (typeof value === "number") return value;
  if (typeof value !== "string") return Number.NaN;
  return Number(value.trim().replace(",", "."));
};

const asText = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const normalizeIngredient = (raw: unknown): unknown => {
  if (!isRecord(raw)) return raw;
  return {
    name: asText(raw.name) ?? raw.name,
    quantity: asNumber(raw.quantity),
    unit: asText(raw.unit)?.toLowerCase(),
    note: asText(raw.note),
  };
};

const normalizeStep = (raw: unknown): unknown => {
  if (typeof raw === "string") return { text: raw };
  if (!isRecord(raw)) return raw;
  return { text: asText(raw.text) ?? raw.text };
};

const normalizeAssumptions = (raw: unknown): string[] => {
  if (!Array.isArray(raw)) return [];
  return raw.map(asText).filter((text): text is string => text !== undefined);
};

/**
 * Normaliza y valida la respuesta de la IA antes de que llegue a la UI.
 *
 * La normalización existe porque el modelo es tolerante con la forma: devuelve "4" en vez de 4,
 * cadenas vacías en vez de omitir un campo, o `null` donde no hay valor. Lo que no se pueda
 * arreglar sin inventar nada se rechaza con un error legible, nunca lanzando.
 */
export function parseStructuredRecipe(raw: unknown): ParsedRecipe {
  if (!isRecord(raw)) return { ok: false, error: "La IA no ha devuelto un objeto" };

  const result = structuredRecipeSchema.safeParse({
    title: asText(raw.title) ?? raw.title,
    locale: raw.locale,
    servings: asNumber(raw.servings),
    prepMin: asNumber(raw.prepMin),
    cookMin: asNumber(raw.cookMin),
    ingredients: Array.isArray(raw.ingredients)
      ? raw.ingredients.map(normalizeIngredient)
      : raw.ingredients,
    steps: Array.isArray(raw.steps) ? raw.steps.map(normalizeStep) : raw.steps,
    assumptions: normalizeAssumptions(raw.assumptions),
  });

  if (result.success) return { ok: true, value: result.data };

  const issue = result.error.issues[0];
  if (!issue) return { ok: false, error: "La receta de la IA no es válida" };
  return { ok: false, error: `${issue.path.join(".") || "receta"}: ${issue.message}` };
}
