import { supabase } from "@/lib/supabase";

/** Cierra la sesión en este dispositivo. Las recetas siguen donde están. */
export async function signOut(): Promise<void> {
  // Local: solo se borra la sesión de aquí, sin pedirle permiso al servidor. Así también
  // funciona cuando el testigo guardado ya no vale.
  await supabase.auth.signOut({ scope: "local" });
}
