import { admin } from "./supabaseAdmin.ts";

/**
 * Devuelve al cupo un intento que no ha dado receta.
 *
 * Si esto falla no se le cuenta a nadie: no vamos a convertir un problema de contabilidad en un
 * error en la cara de quien solo quería escribir una receta.
 */
export async function releaseDailyUse(ownerId: string): Promise<void> {
  const { error } = await admin.rpc("release_ai_use", { p_owner: ownerId });

  if (error !== null) console.error("No se ha podido devolver el uso al cupo", error);
}
