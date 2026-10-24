import type { AuthError } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";

export type SignInResult = { ok: true } | { ok: false; error: string };

/**
 * Lo que se le dice a la usuaria según por qué ha fallado.
 *
 * Solo se traducen los casos que ella puede arreglar. El resto se enseña tal cual, aunque venga
 * en inglés: esconder el motivo detrás de "revisa la contraseña" es acusarla de teclear mal
 * cuando lo que pasa es que no hay red.
 */
const messageFor = (error: AuthError): string => {
  if (error.code === "invalid_credentials") {
    return "No hemos podido entrar. Revisa el correo y la contraseña.";
  }
  if (error.code === "email_not_confirmed") {
    return "Este correo todavía no está confirmado.";
  }
  if (error.name === "AuthRetryableFetchError") {
    return "No hemos podido hablar con el servidor. Comprueba la conexión.";
  }
  return `No hemos podido entrar: ${error.message}`;
};

/** Entra con correo y contraseña. Crear la cuenta es cosa de `signUp`. */
export async function signIn(email: string, password: string): Promise<SignInResult> {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error === null) return { ok: true };

  console.warn("No se ha podido iniciar sesión", error.name, error.status, error.code);
  return { ok: false, error: messageFor(error) };
}
