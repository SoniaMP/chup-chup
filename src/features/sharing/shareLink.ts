const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";

/**
 * La dirección que se manda por ahí.
 *
 * Cuelga del propio proyecto de Supabase porque todavía no hay dominio propio. El día que lo
 * haya, cambia aquí y los enlaces viejos siguen valiendo: el testigo es el mismo.
 */
export function shareLink(token: string): string {
  return `${SUPABASE_URL}/functions/v1/shared-recipe?t=${encodeURIComponent(token)}`;
}
