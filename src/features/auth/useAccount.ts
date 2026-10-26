import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";
import { type Account, accountFromUser } from "./accountFromUser";

/** Quien ha entrado: nombre, correo y foto. `null` mientras se lee la sesión. */
export function useAccount(): Account | null {
  const [account, setAccount] = useState<Account | null>(null);

  useEffect(() => {
    let isCurrent = true;

    void supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user;
      if (isCurrent && user !== undefined) setAccount(accountFromUser(user));
    });

    return () => {
      isCurrent = false;
    };
  }, []);

  return account;
}
