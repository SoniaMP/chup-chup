import { Platform, type TextStyle } from "react-native";

/**
 * El navegador dibuja su propio anillo de foco encima del borde de la app. En el móvil no
 * existe, así que esto solo quita ruido al probar en el navegador.
 *
 * Chrome pinta ese anillo con `outline: auto`, que ignora el ancho: hay que apagar el estilo.
 * El doble cast hace falta porque `outlineStyle: "none"` solo existe en react-native-web.
 */
export const webFocusReset: TextStyle =
  Platform.OS === "web" ? ({ outlineStyle: "none" } as unknown as TextStyle) : {};
