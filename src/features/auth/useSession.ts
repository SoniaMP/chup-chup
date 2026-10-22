import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";
import { signOut } from "./signOut";

type LoadedSession = {
  session: Session | null;
  /** Falso mientras se lee la sesión guardada, para no mandar al login a quien ya ha entrado. */
  isLoaded: boolean;
};

/**
 * Comprueba contra el servidor que la usuaria de la sesión guardada siga existiendo.
 *
 * `getSession` solo lee lo que hay en el dispositivo y se lo cree. Si esa usuaria se borró, la
 * app parece dentro y solo revienta al escribir en la base de datos, con un error de clave
 * foránea que no dice nada. Sin red no se puede saber, así que se da por buena.
 */
const isStillValid = async (): Promise<boolean> => {
  const { error } = await supabase.auth.getUser();
  return error === null || error.name === "AuthRetryableFetchError";
};

/** La sesión abierta, al día: se entera igual del login, del logout y del refresco del token. */
export function useSession(): LoadedSession {
  const [loaded, setLoaded] = useState<LoadedSession>({ session: null, isLoaded: false });

  useEffect(() => {
    let isCurrent = true;

    const load = async (): Promise<void> => {
      const { data } = await supabase.auth.getSession();

      if (data.session !== null && !(await isStillValid())) {
        await signOut();
        if (isCurrent) setLoaded({ session: null, isLoaded: true });
        return;
      }

      if (isCurrent) setLoaded({ session: data.session, isLoaded: true });
    };

    void load();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoaded({ session, isLoaded: true });
    });

    return () => {
      isCurrent = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return loaded;
}
