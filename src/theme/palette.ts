/**
 * Colors from docs/DESIGN.md, already converted from OKLCH to hex because
 * React Native cannot parse oklch().
 */
export const palette = {
  light: {
    background: "#FDF6EA",
    foreground: "#2C1A14",
    card: "#FFFDF8",
    primary: "#CF542C",
    primaryForeground: "#FEFAF3",
    secondary: "#F4E6D2",
    secondaryForeground: "#3F271E",
    muted: "#F3EADB",
    mutedForeground: "#725F54",
    olive: "#657B3D",
    oliveSoft: "#E0EAC8",
    saffron: "#EDB345",
    inferred: "#FEE9BE",
    inferredForeground: "#6E4108",
    frame: "#E5D5C3",
    border: "#E5D8C9",
    destructive: "#E7000B",
  },
  dark: {
    background: "#1D140F",
    foreground: "#F6EDE0",
    card: "#2A1F1A",
    primary: "#E87045",
    primaryForeground: "#190F0B",
    secondary: "#392A23",
    secondaryForeground: "#F6EDE0",
    muted: "#322621",
    mutedForeground: "#B1A291",
    olive: "#90A963",
    oliveSoft: "#2D371A",
    saffron: "#F3B94C",
    inferred: "#4A330F",
    inferredForeground: "#FAD18A",
    frame: "#0B0605",
    border: "rgba(255,255,255,0.10)",
    destructive: "#E7000B",
  },
} as const;
