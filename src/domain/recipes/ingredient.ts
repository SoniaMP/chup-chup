import { z } from "zod";

/**
 * Un ingrediente de la receta.
 *
 * La cantidad y la unidad van separadas del nombre para poder reescalar por raciones:
 * "250 ml de aceite" se guarda como { quantity: 250, unit: "ml", name: "aceite" }, nunca
 * metiendo la cantidad dentro de `name`.
 */
export const ingredientSchema = z
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

export type Ingredient = z.infer<typeof ingredientSchema>;
