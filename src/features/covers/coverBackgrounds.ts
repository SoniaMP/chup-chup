/**
 * Los cuatro fondos sobre los que está dibujado el catálogo.
 *
 * No se leen de ningún sitio: están en el nombre del fichero, que es `<fondo>-<motivo>.jpg`
 * (`olive-jars.jpg`). Por eso el selector puede agrupar por color sin preguntar al servidor.
 *
 * Los colores son los que se pidieron al generarlas, copiados de `library/PROMPTS.md`. No salen
 * de la paleta de la app a propósito: el terracota de las portadas es un ladrillo más apagado que
 * el `primary`, que de fondo competía con los botones.
 *
 * `isDark` dice si encima se lee la tinta clara, que es la misma pregunta que se respondió al
 * dibujarlas: tres van con tinta crema y el crema va con tinta oscura.
 */
export const COVER_BACKGROUNDS = [
  { id: "cream", label: "Crema", color: "#FDF6EA", isDark: false },
  { id: "terracotta", label: "Terracota", color: "#A54228", isDark: true },
  { id: "olive", label: "Oliva", color: "#657B3D", isDark: true },
  { id: "brown", label: "Marrón", color: "#B38353", isDark: true },
] as const;

export type CoverBackground = (typeof COVER_BACKGROUNDS)[number]["id"];
