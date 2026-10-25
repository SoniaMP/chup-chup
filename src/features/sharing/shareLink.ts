import { sharedRecipeUrl } from "@/domain/sharing/sharedRecipeUrl";

/** El dominio desde el que se sirve el visor. Vacío mientras no haya dominio propio. */
const SHARE_BASE = process.env.EXPO_PUBLIC_SHARE_BASE_URL ?? "";
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";

/** La dirección que se manda por ahí, armada con lo que diga el entorno. */
export function shareLink(token: string): string {
  return sharedRecipeUrl(token, SHARE_BASE, SUPABASE_URL);
}
