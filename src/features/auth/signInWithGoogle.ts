import { supabase } from "@/lib/supabase";
import type { SignInResult } from "./signIn";
import { oauthReturnUrl } from "./oauthReturnUrl";

/**
 * Entra con Google, en la web: el navegador se va a Google y vuelve a la raíz con la sesión.
 *
 * Si va bien, esta función no llega a ver el resultado, porque la página ya se ha ido. Solo
 * vuelve con algo cuando Supabase no ha podido ni empezar, que suele ser que Google no está
 * activado en el proyecto. En el móvil irá el selector de cuentas del sistema, que es otra cosa.
 */
export async function signInWithGoogle(): Promise<SignInResult> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: oauthReturnUrl(window.location.href) },
  });

  if (error === null) return { ok: true };

  console.warn("No se ha podido entrar con Google", error.name, error.status, error.code);
  return { ok: false, error: `No hemos podido entrar con Google: ${error.message}` };
}
