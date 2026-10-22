import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View, useColorScheme } from "react-native";

import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

/** What the home screen shows before the first recipe exists. */
export function EmptyKitchen() {
  const colors = useColors();
  const gradient =
    useColorScheme() === "dark" ? tokens.gradient.placeholderDark : tokens.gradient.placeholder;

  return (
    <View style={styles.container}>
      <View style={styles.illustration}>
        <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 0.8, y: 1 }} style={styles.circle} />
        <View style={[styles.dot, styles.oliveDot, { backgroundColor: colors.olive }]} />
        <View style={[styles.dot, styles.saffronDot, { backgroundColor: colors.saffron }]} />
      </View>
      <Text style={[styles.title, { color: colors.foreground }]}>Tu cocina está vacía</Text>
      <Text style={[styles.line, { color: colors.mutedForeground }]}>
        Escribe tu primera receta como te salga. Ya la ordenamos nosotros.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", gap: tokens.spacing.row * 1.5 },
  illustration: { width: 144, height: 144, marginBottom: tokens.spacing.block },
  circle: { width: 144, height: 144, borderRadius: tokens.radius.pill },
  dot: { position: "absolute", borderRadius: tokens.radius.pill },
  oliveDot: { width: 14, height: 14, top: 6, right: 2 },
  saffronDot: { width: 10, height: 10, bottom: 14, left: -2 },
  title: { fontFamily: tokens.fontFamily.display, fontSize: tokens.fontSize.sectionHeading },
  line: {
    fontFamily: tokens.fontFamily.body,
    fontSize: tokens.fontSize.body,
    textAlign: "center",
    maxWidth: 280,
    lineHeight: 24,
  },
});
