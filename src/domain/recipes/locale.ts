import { z } from "zod";

/**
 * Etiqueta de idioma estilo BCP 47, en la forma que necesita la app: "es", "es-ES", "en".
 * La receta conserva el idioma en que se escribió, que es la base para traducir en la fase 2.
 */
export const localeSchema = z
  .string()
  .trim()
  .regex(/^[a-z]{2}(-[A-Z]{2})?$/, 'El idioma debe ser como "es" o "es-ES"');

export type Locale = z.infer<typeof localeSchema>;
