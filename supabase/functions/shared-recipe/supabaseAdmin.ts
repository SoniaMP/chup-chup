import { createClient } from "@supabase/supabase-js";

/**
 * El cliente con la clave de servicio, que nunca sale de la función.
 *
 * Aquí sirve para leer la receta compartida saltándose el RLS: quien abre el enlace no tiene
 * sesión, y lo que le da derecho a verla es el testigo, que se comprueba antes.
 */
export const admin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  { auth: { persistSession: false, autoRefreshToken: false } },
);
