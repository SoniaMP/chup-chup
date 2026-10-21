import { z } from "zod";

/** Un paso de la receta. Objeto en vez de cadena para poder crecer sin migrar el jsonb. */
export const stepSchema = z.object({
  text: z.string().trim().min(1, "El paso no puede estar vacío").max(600),
});

export type Step = z.infer<typeof stepSchema>;
