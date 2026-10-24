/** Lo mínimo para que una contraseña no sea un regalo. */
const MIN_PASSWORD = 8;

type SignUpAttempt = {
  email: string;
  password: string;
};

/**
 * Qué le falta al registro para poder mandarse, o `null` si está listo.
 *
 * Se comprueba aquí y no solo en el servidor para no gastar un viaje en algo que se ve a simple
 * vista, y para poder decirlo en el idioma de la app. Lo que el servidor rechace después se
 * enseña tal cual: aquí no se adivina.
 */
export function signUpIssue({ email, password }: SignUpAttempt): string | null {
  const address = email.trim();

  if (address === "") return "Falta el correo.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) return "Ese correo no tiene buena pinta.";
  if (password.length < MIN_PASSWORD) {
    return `La contraseña necesita al menos ${String(MIN_PASSWORD)} caracteres.`;
  }

  return null;
}
