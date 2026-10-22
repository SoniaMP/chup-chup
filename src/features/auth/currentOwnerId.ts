import { supabase } from "@/lib/supabase";

/**
 * El identificador de la usuaria de la sesión, que es el `owner_id` de todo lo que crea.
 *
 * Lanza si no hay sesión: las pantallas que guardan están detrás del login, así que llegar aquí
 * sin sesión es un error de programación, no algo que la usuaria pueda provocar.
 */
export async function currentOwnerId(): Promise<string> {
  const { data, error } = await supabase.auth.getSession();

  if (error !== null) throw new Error(error.message);
  if (data.session === null) throw new Error("No hay sesión abierta");
  return data.session.user.id;
}
