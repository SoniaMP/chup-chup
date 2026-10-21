import { z } from "zod";
import { ingredientSchema } from "./ingredient";
import { localeSchema } from "./locale";
import { stepSchema } from "./step";

/**
 * Lo que devuelve la IA al estructurar un texto libre.
 *
 * No tiene `notes`, `id` ni `ownerId`, y es a propósito: la IA no puede escribir las notas
 * personales ni inventarse identificadores porque el contrato no se lo permite. Es una garantía
 * del tipo, no una instrucción del prompt que el modelo pueda ignorar.
 *
 * `assumptions` es lo que la IA ha dado por supuesto. Se muestra encima del borrador como aviso
 * y no se guarda con la receta.
 */
export const structuredRecipeSchema = z.object({
  title: z.string().trim().min(1, "La receta necesita un título").max(120),
  locale: localeSchema,
  servings: z.number().int().positive().max(100).optional(),
  prepMin: z.number().int().nonnegative().max(1440).optional(),
  cookMin: z.number().int().nonnegative().max(1440).optional(),
  ingredients: z
    .array(ingredientSchema)
    .min(1, "La receta necesita al menos un ingrediente")
    .max(60),
  steps: z.array(stepSchema).min(1, "La receta necesita al menos un paso").max(60),
  assumptions: z.array(z.string().trim().min(1).max(200)).max(20).default([]),
});

export type StructuredRecipe = z.infer<typeof structuredRecipeSchema>;
