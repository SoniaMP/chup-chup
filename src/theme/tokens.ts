/** Shape, spacing, type scale and motion from docs/DESIGN.md. */
export const tokens = {
  radius: { card: 4, sheet: 8, sm: 12, md: 14, lg: 16, xl: 20, xxl: 24, xxxl: 30, pill: 999 },
  spacing: { gutter: 20, row: 8, block: 24 },
  touch: { headerButton: 44, primaryButton: 56, cookStepButton: 80, createButton: 64 },
  fontFamily: {
    display: "Fraunces_600SemiBold",
    body: "Figtree_400Regular",
    bodyStrong: "Figtree_600SemiBold",
  },
  fontSize: {
    screenTitle: 36,
    bookTitle: 48,
    sectionHeading: 24,
    body: 17,
    cookStep: 36,
    label: 14,
  },
  gradient: {
    warm: ["#E56731", "#C04637"] as const,
    placeholder: ["#F8D8B4", "#FBBEA3"] as const,
    placeholderDark: ["#4E341F", "#4A2010"] as const,
  },
  shadow: {
    soft: { shadowColor: "#6B3725", shadowOpacity: 0.25, shadowRadius: 15, shadowOffset: { width: 0, height: 10 }, elevation: 6 },
    glow: { shadowColor: "#CF542C", shadowOpacity: 0.55, shadowRadius: 14, shadowOffset: { width: 0, height: 12 }, elevation: 10 },
    // El mismo halo, a la mitad: sobre el fondo oscuro, el de siempre no se lee como luz
    // sino como una mancha naranja alrededor del botón.
    glowDark: { shadowColor: "#CF542C", shadowOpacity: 0.28, shadowRadius: 18, shadowOffset: { width: 0, height: 10 }, elevation: 8 },
  },
} as const;
