import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

import type { Database } from "./databaseTypes";

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (url === undefined || publishableKey === undefined) {
  throw new Error("Falta la configuración de Supabase: copia .env.example a .env y rellénalo");
}

/**
 * El único cliente de Supabase de la app.
 *
 * La clave publicable viaja en el bundle a propósito: lo que protege los datos es el RLS por
 * `owner_id`, no esconder la clave. Las claves de la IA son otra cosa y solo viven en las
 * Edge Functions.
 */
export const supabase = createClient<Database>(url, publishableKey, {
  auth: {
    storage: AsyncStorage,
    persistSession: true,
    autoRefreshToken: true,
    // El inicio de sesión es con correo y contraseña: no hay sesión que leer de la url.
    detectSessionInUrl: false,
  },
});
