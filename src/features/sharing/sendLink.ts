import { Platform, Share } from "react-native";

type WebShare = { share?: (data: { text: string }) => Promise<void> };

/**
 * Manda el enlace con lo que tenga el aparato. Devuelve `false` si no hay por dónde mandarlo.
 *
 * En el móvil es la hoja de compartir de siempre. En el navegador existe la suya, pero solo en
 * páginas seguras: el servidor de desarrollo va por `http`, así que ahí no hay ninguna y el que
 * llama tiene que enseñar el enlace a mano.
 */
export async function sendLink(message: string): Promise<boolean> {
  if (Platform.OS !== "web") {
    await Share.share({ message });
    return true;
  }

  const web = globalThis.navigator as unknown as WebShare | undefined;
  if (web?.share === undefined) return false;

  try {
    await web.share({ text: message });
  } catch (cause: unknown) {
    // Cerrar la hoja sin mandar nada no es un fallo: se abrió, que es lo que había que hacer.
    console.warn("La hoja de compartir se ha cerrado sin mandar nada", cause);
  }

  return true;
}
