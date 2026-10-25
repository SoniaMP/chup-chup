import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

/**
 * El botón de crear: flotante, porque el MVP no tiene barra inferior.
 *
 * Es un `+` redondo y sin texto, y qué crea lo decide la pantalla que lo pone: en Mi cocina abre
 * una hoja con las dos cosas que se pueden crear, y dentro de un libro va derecho a la receta,
 * porque nadie crea un libro estando dentro de uno.
 *
 * Lo que no se entendía no era el signo, era que hubiera dos iguales en la misma pantalla, uno que
 * hacía libros y otro que hacía recetas. Mientras haya uno solo por pantalla, el `+` no se puede
 * confundir con nada. Como no lleva texto, el nombre accesible es lo único que lo dice, así que
 * cada pantalla pone el suyo.
 */
export function CreateButton({
  onPress,
  label = "Crear",
}: {
  onPress: () => void;
  /** Lo que lee en voz alta un lector de pantalla: el botón no tiene texto que leer. */
  label?: string;
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const glow = useColorScheme() === "dark" ? tokens.shadow.glowDark : tokens.shadow.glow;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
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
        <MaterialIcons name="add" size={30} color={colors.primaryForeground} />
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    right: tokens.spacing.gutter,
    width: tokens.touch.createButton,
    height: tokens.touch.createButton,
    borderRadius: tokens.radius.pill,
  },
  fill: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.pill,
  },
});
