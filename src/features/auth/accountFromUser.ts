import { displayName } from "@/domain/users/displayName";

export type Account = {
  name: string | null;
  email: string | null;
  /** La foto de Google. Las cuentas de correo no la tienen. */
  avatarUrl: string | null;
};

type SessionUser = { email?: string | undefined; user_metadata: Record<string, unknown> };

const textOf = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() !== "" ? value : undefined;

/** Lo que la app enseña de quien ha entrado, sacado del usuario de la sesión. */
export function accountFromUser(user: SessionUser): Account {
  const metadata = user.user_metadata;

  return {
    name: displayName({ email: user.email, name: textOf(metadata["name"]) }),
    email: user.email ?? null,
    // Supabase la guarda en `avatar_url`; `picture` es el nombre que le da Google.
    avatarUrl: textOf(metadata["avatar_url"]) ?? textOf(metadata["picture"]) ?? null,
  };
}
