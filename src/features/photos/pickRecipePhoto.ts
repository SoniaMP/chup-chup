import { SaveFormat, manipulateAsync } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";

/** De dónde sale la foto. */
export type PhotoSource = "camera" | "library";

/** Un móvil de hoy hace fotos de varios megas; para una receta sobra con esto. */
const MAX_WIDTH = 1600;
const QUALITY = 0.8;

/**
 * Abre la cámara o la galería y devuelve la foto encogida, en base64.
 *
 * Devuelve `null` si se sale sin elegir, que no es un error. Si falta el permiso, sí lo es, y se
 * dice: una pantalla que no hace nada y no explica por qué es peor que un aviso.
 */
export async function pickRecipePhoto(source: PhotoSource): Promise<string | null> {
  const permission =
    source === "camera"
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    throw new Error(
      source === "camera"
        ? "Chup Chup no tiene permiso para usar la cámara"
        : "Chup Chup no tiene permiso para ver tus fotos",
    );
  }

  const options = { mediaTypes: ["images" as const], quality: 1 };
  const picked =
    source === "camera"
      ? await ImagePicker.launchCameraAsync(options)
      : await ImagePicker.launchImageLibraryAsync(options);

  const [asset] = picked.assets ?? [];
  if (picked.canceled || asset === undefined) return null;

  const resized = await manipulateAsync(
    asset.uri,
    asset.width > MAX_WIDTH ? [{ resize: { width: MAX_WIDTH } }] : [],
    { compress: QUALITY, format: SaveFormat.JPEG, base64: true },
  );

  if (resized.base64 === undefined) throw new Error("No se ha podido leer la foto");
  return resized.base64;
}
