import { supabase } from "@/lib/supabase";
import { parseStructuredRecipe, type ParsedRecipe } from "./parseStructuredRecipe";

type FunctionAnswer = { ok: true; value: unknown } | { ok: false; error: string };

/**
 * Lo que la función ha contestado cuando contesta con un código de error.
 *
 * `invoke` solo dice "ha fallado" y se guarda el cuerpo dentro: sin abrirlo, un "hoy ya has
 * gastado tus recetas" y un "no hay red" se ven exactamente igual, que es justo lo que no
 * queremos volver a hacer.
 */
const reasonFromError = async (error: unknown): Promise<string | null> => {
  const context: unknown = (error as { context?: unknown }).context;
  if (!(context instanceof Response)) return null;

  const body: unknown = await context.clone().json().catch(() => null);
  const reason = (body as { error?: unknown } | null)?.error;

  return typeof reason === "string" ? reason : null;
};

/**
 * El único sitio por el que la app pide estructurar un texto libre.
 *
 * La clave de la IA no está aquí ni puede estarlo: la llamada va a una Edge Function, que es
 * quien habla con el modelo. Lo que vuelve se valida otra vez contra el esquema, porque lo que
 * entra en la pantalla de revisión tiene que cumplirlo venga de donde venga.
 */
export async function structureRecipe(rawInput: string): Promise<ParsedRecipe> {
  const { data, error } = await supabase.functions.invoke<FunctionAnswer>("structure-recipe", {
    body: { rawInput },
  });

  if (error !== null) {
    console.warn("No se ha podido llamar a la IA", error);
    const reason = await reasonFromError(error);

    return { ok: false, error: reason ?? "No hemos podido hablar con la IA. Comprueba la conexión." };
  }
  if (data === null) return { ok: false, error: "La IA no ha contestado nada." };
  if (!data.ok) return { ok: false, error: data.error };

  return parseStructuredRecipe(data.value);
}
