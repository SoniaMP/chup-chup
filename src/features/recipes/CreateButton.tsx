import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

/**
 * El botón de crear una receta: flotante, porque el MVP no tiene barra inferior.
 *
 * Lleva su nombre escrito y no solo un `+`. Un `+` pelado no dice qué crea, y en esta pantalla
 * hubo dos a la vez —uno hacía libros y el otro recetas— que es justo lo que confundía.
 */
export function CreateRecipeButton({ onPress }: { onPress: () => void }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const glow = useColorScheme() === "dark" ? tokens.shadow.glowDark : tokens.shadow.glow;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Crear receta"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        glow,
        { bottom: insets.bottom + tokens.spacing.block, transform: [{ scale: pressed ? 0.96 : 1 }] },
      ]}
    >
      <LinearGradient
        colors={tokens.gradient.warm}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.fill}
      >
        <MaterialIcons name="add" size={26} color={colors.primaryForeground} />
        <Text style={[styles.label, { color: colors.primaryForeground }]}>Nueva receta</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    right: tokens.spacing.gutter,
    height: tokens.touch.createButton,
    borderRadius: tokens.radius.pill,
  },
  fill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.spacing.row,
    paddingHorizontal: tokens.spacing.gutter,
    borderRadius: tokens.radius.pill,
  },
  label: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: tokens.fontSize.body },
});
