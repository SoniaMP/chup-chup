import { admin } from "./supabaseAdmin.ts";

/** Cuántas recetas al día puede estructurar una cocinera. Un secreto, para moverlo sin desplegar. */
const DAILY_LIMIT = Number(Deno.env.get("AI_DAILY_LIMIT") ?? "30");

/**
 * Apunta un uso y dice si todavía cabía.
 *
 * Se cuenta con la clave de servicio: si esto se contara desde el cliente, el límite lo pondría
 * quien lo quiere saltar.
 */
export async function claimDailyUse(ownerId: string): Promise<boolean> {
  const { data, error } = await admin.rpc("claim_ai_use", {
    p_owner: ownerId,
    p_limit: DAILY_LIMIT,
  });

  if (error !== null) throw new Error(error.message);
  return data === true;
}
