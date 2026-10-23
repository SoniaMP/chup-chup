import { useEffect, useState } from "react";

import { displayName } from "@/domain/users/displayName";
import { supabase } from "@/lib/supabase";

const nameOf = (user: { email?: string; user_metadata: Record<string, unknown> }): string | null => {
  const stored = user.user_metadata["name"];

  return displayName({
    email: user.email,
    name: typeof stored === "string" ? stored : undefined,
  });
};

/** El nombre de quien ha entrado, para firmar lo suyo. */
export function useDisplayName(): string | null {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    void supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user;
      if (isCurrent && user !== undefined) setName(nameOf(user));
    });

    return () => {
      isCurrent = false;
    };
  }, []);

  return name;
}
