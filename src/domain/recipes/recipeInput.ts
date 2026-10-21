import { z } from "zod";
import { ingredientSchema } from "./ingredient";
import { stepSchema } from "./step";
import { structuredRecipeSchema } from "./structuredRecipe";

/**
 * La receta lista para guardar: lo que la usuaria confirma al aceptar el borrador.
 *
 * `assumptions` se cae aquí con el `omit`, que es lo que hace imposible que las suposiciones de
 * la IA acaben en la base de datos.
 *
 * Aquí la receta puede quedarse sin ingredientes o sin pasos: lo que guarda la usuaria es
 * responsabilidad suya. El mínimo de uno sigue existiendo en `structuredRecipeSchema`, porque ahí
 * vigila a la IA: una receta sin ingredientes es una respuesta rota del modelo, no una decisión.
 */
export const recipeInputSchema = structuredRecipeSchema.omit({ assumptions: true }).extend({
  ingredients: z.array(ingredientSchema).max(60),
  steps: z.array(stepSchema).max(60),
  rawInput: z.string().trim().min(1, "Falta el texto original de la receta"),
  notes: z.string().trim().max(2000).optional(),
});

export type RecipeInput = z.infer<typeof recipeInputSchema>;
