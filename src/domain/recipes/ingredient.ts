import { z } from "zod";

/** Lo que puede no venir. Vacío y ausente son lo mismo, y conviene que signifiquen lo mismo. */
const OPTIONAL_TEXT = ["unit", "note"] as const;

/**
 * Una cadena vacía en la unidad o en la nota es que no hay unidad ni nota.
 *
 * Lo necesita la IA: el prompt le pide que deje la unidad vacía cuando el ingrediente se cuenta
 * ("3 huevos"), y lo que manda es `unit: ""`. Sin esto, cualquier receta con huevos no pasa la
 * validación de la Edge Function.
 */
const emptyMeansAbsent = (value: unknown): unknown => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return value;

  const entries = Object.entries(value).filter(
    ([key, text]) =>
      !(OPTIONAL_TEXT as readonly string[]).includes(key) ||
      typeof text !== "string" ||
      text.trim() !== "",
  );

  return Object.fromEntries(entries);
};

/**
 * Un ingrediente de la receta.
 *
 * La cantidad y la unidad van separadas del nombre para poder reescalar por raciones:
 * "250 ml de aceite" se guarda como { quantity: 250, unit: "ml", name: "aceite" }, nunca
 * metiendo la cantidad dentro de `name`.
 */
const ingredientFields = z
  .object({
    name: z.string().trim().min(1, "El ingrediente necesita un nombre").max(120),
    quantity: z.number().positive("La cantidad debe ser mayor que cero").max(100_000).optional(),
    unit: z.string().trim().min(1).max(20).optional(),
    note: z.string().trim().min(1).max(200).optional(),
  })
  .refine((ingredient) => ingredient.quantity !== undefined || ingredient.unit === undefined, {
    error: "Una unidad sin cantidad no dice nada",
    path: ["unit"],
  });

export const ingredientSchema = z.preprocess(emptyMeansAbsent, ingredientFields);

export type Ingredient = z.infer<typeof ingredientSchema>;
