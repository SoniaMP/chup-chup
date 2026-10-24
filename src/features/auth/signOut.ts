import { localCache } from "@/features/offline/localCache";
import { supabase } from "@/lib/supabase";

/** Cierra la sesión en este dispositivo. Las recetas siguen donde están. */
export async function signOut(): Promise<void> {
  // La copia local se borra antes de cerrar: después ya no se sabe de quién era.
  const { data } = await supabase.auth.getSession();
  const ownerId = data.session?.user.id;
  if (ownerId !== undefined) await localCache.forget(ownerId);

  // Local: solo se borra la sesión de aquí, sin pedirle permiso al servidor. Así también
  // funciona cuando el testigo guardado ya no vale.
  await supabase.auth.signOut({ scope: "local" });
}
