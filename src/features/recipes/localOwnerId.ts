import AsyncStorage from "@react-native-async-storage/async-storage";
import { randomUuid } from "@/lib/randomUuid";

const KEY = "recetario.ownerId";

/**
 * Identidad provisional mientras no hay Auth: un UUID que se crea una vez en el dispositivo.
 * Cuando entre Supabase Auth, este valor lo sustituye el `id` de la sesión.
 */
export async function getLocalOwnerId(): Promise<string> {
  const stored = await AsyncStorage.getItem(KEY);
  if (stored !== null) return stored;

  const created = randomUuid();
  await AsyncStorage.setItem(KEY, created);
  return created;
}
