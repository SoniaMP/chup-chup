import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

type LoadedSession = {
  session: Session | null;
  /** Falso mientras se lee la sesión guardada, para no mandar al login a quien ya ha entrado. */
  isLoaded: boolean;
};

/** La sesión abierta, al día: se entera igual del login, del logout y del refresco del token. */
export function useSession(): LoadedSession {
  const [loaded, setLoaded] = useState<LoadedSession>({ session: null, isLoaded: false });

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      setLoaded({ session: data.session, isLoaded: true });
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoaded({ session, isLoaded: true });
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return loaded;
}
