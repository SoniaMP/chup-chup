import { createClient } from "@supabase/supabase-js";

/**
 * El cliente con la clave de servicio, que nunca sale de la función.
 *
 * Sirve para dos cosas: comprobar de quién es la sesión que llama y llevar la cuenta de usos,
 * que es precisamente lo que no puede vivir en el cliente.
 */
export const admin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  { auth: { persistSession: false, autoRefreshToken: false } },
);
