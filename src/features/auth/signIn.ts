import { supabase } from "@/lib/supabase";

export type SignInResult = { ok: true } | { ok: false; error: string };

/** Entra con correo y contraseña. El registro llegará con la fase 2 (compartir). */
export async function signIn(email: string, password: string): Promise<SignInResult> {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error === null) return { ok: true };
  return { ok: false, error: "No hemos podido entrar. Revisa el correo y la contraseña." };
}
