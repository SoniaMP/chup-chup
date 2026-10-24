import type { AuthError } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";

export type SignUpResult =
  /** `needsConfirmation` manda a la usuaria a su correo en vez de a su cocina. */
  | { ok: true; needsConfirmation: boolean }
  | { ok: false; error: string };

/**
 * Lo que se le dice según por qué ha fallado.
 *
 * Igual que al entrar: solo se traduce lo que ella puede arreglar, y lo demás se enseña tal cual
 * aunque venga en inglés. Un mensaje amable que esconde el motivo no ayuda a nadie.
 */
const messageFor = (error: AuthError): string => {
  if (error.code === "user_already_exists" || error.code === "email_exists") {
    return "Ya hay una cuenta con ese correo. Prueba a entrar.";
  }
  if (error.code === "weak_password") return "Esa contraseña es demasiado fácil.";
  if (error.code === "over_email_send_rate_limit") {
    return "Demasiados intentos seguidos. Espera un minuto y vuelve a probar.";
  }
  if (error.name === "AuthRetryableFetchError") {
    return "No hemos podido hablar con el servidor. Comprueba la conexión.";
  }
  return `No hemos podido crear la cuenta: ${error.message}`;
};

/**
 * Crea la cuenta y, si el proyecto no pide confirmar el correo, deja la sesión abierta.
 *
 * El nombre se guarda en los metadatos de la usuaria, que es de donde sale la firma de lo suyo
 * («Sonia · 12 recetas») mientras no haya pantalla de perfil.
 */
export async function signUp(email: string, password: string, name: string): Promise<SignUpResult> {
  const chosen = name.trim();
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    ...(chosen === "" ? {} : { options: { data: { name: chosen } } }),
  });

  if (error !== null) {
    console.warn("No se ha podido crear la cuenta", error.name, error.status, error.code);
    return { ok: false, error: messageFor(error) };
  }

  return { ok: true, needsConfirmation: data.session === null };
}
