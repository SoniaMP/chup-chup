import { z } from "zod";

/**
 * El borrador que se edita en pantalla, entre la respuesta de la IA y el guardado.
 *
 * Es permisivo a propósito: mientras escribes puedes dejar un campo vacío o a medias, y la
 * pantalla no debe romperse por eso. Cadena vacía y `null` significan "sin rellenar".
 *
 * Vive en el dispositivo y nunca viaja a la base de datos.
 */
export const recipeDraftSchema = z.object({
  title: z.string(),
  locale: z.string(),
  rawInput: z.string(),
  servings: z.number().nullable(),
  prepMin: z.number().nullable(),
  cookMin: z.number().nullable(),
  ingredients: z.array(
    z.object({
      name: z.string(),
      quantity: z.number().nullable(),
      unit: z.string(),
      note: z.string(),
    }),
  ),
  steps: z.array(z.object({ text: z.string() })),
  notes: z.string(),
  assumptions: z.array(z.string()),
});

export type RecipeDraft = z.infer<typeof recipeDraftSchema>;
