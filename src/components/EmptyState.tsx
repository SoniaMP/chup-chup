import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View, useColorScheme } from "react-native";

import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

type EmptyStateProps = {
  title: string;
  line: string;
  /** Dentro de una lista la ilustración va más pequeña, para no comerse la pantalla. */
  isCompact?: boolean;
};

/** Lo que se pinta donde no hay nada todavía: una olla al chup chup y dos líneas. */
export function EmptyState({ title, line, isCompact = false }: EmptyStateProps) {
  const colors = useColors();
  const gradient =
    useColorScheme() === "dark" ? tokens.gradient.placeholderDark : tokens.gradient.placeholder;
  const size = isCompact ? 88 : 144;

  return (
    <View style={[styles.container, isCompact && styles.compact]}>
      <View style={{ width: size, height: size, marginBottom: tokens.spacing.row }}>
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={[styles.pot, { width: size, height: size }]}
        >
          <MaterialCommunityIcons
            name="pot-steam-outline"
            size={size * 0.56}
            color={colors.primary}
          />
        </LinearGradient>
        <View style={[styles.dot, styles.oliveDot, { backgroundColor: colors.olive }]} />
        <View style={[styles.dot, styles.saffronDot, { backgroundColor: colors.saffron }]} />
      </View>
      <Text style={[styles.title, { color: colors.foreground }, isCompact && styles.compactTitle]}>
        {title}
      </Text>
      <Text style={[styles.line, { color: colors.mutedForeground }]}>{line}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // Sin `flex`: esto se pinta dentro de listas que ya fluyen, y un `flex: 1` dentro de un
  // ScrollView se queda sin alto. Con la caja a cero y el contenido centrado, lo que no cabe se
  // sale por arriba y por abajo, y la olla acaba encima de la fila de al lado. El alto lo manda
  // el contenido y el aire lo dan los márgenes.
  container: {
    alignItems: "center",
    gap: tokens.spacing.row * 1.5,
    paddingVertical: tokens.spacing.block * 2,
  },
  compact: { paddingVertical: tokens.spacing.block },
  pot: { borderRadius: tokens.radius.pill, alignItems: "center", justifyContent: "center" },
  dot: { position: "absolute", borderRadius: tokens.radius.pill },
  oliveDot: { width: 14, height: 14, top: 6, right: 2 },
  saffronDot: { width: 10, height: 10, bottom: 14, left: -2 },
  title: { fontFamily: tokens.fontFamily.display, fontSize: tokens.fontSize.sectionHeading },
  compactTitle: { fontSize: 18 },
  line: {
    fontFamily: tokens.fontFamily.body,
    fontSize: tokens.fontSize.body,
    textAlign: "center",
    maxWidth: 280,
    lineHeight: 24,
  },
});
