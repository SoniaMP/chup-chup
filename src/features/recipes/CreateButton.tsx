import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

/**
 * El botón de crear: flotante, porque el MVP no tiene barra inferior.
 *
 * Es la única puerta para crear, y lo que se crea se elige en la hoja que abre: por eso es un `+`
 * redondo y sin texto. Lo que no se entendía no era el signo, era que hubiera dos iguales en la
 * misma pantalla, uno que hacía libros y otro que hacía recetas. Con una sola puerta, el `+` no se
 * puede confundir con nada, y lo que crea lo dice la hoja con todas las letras.
 *
 * Su nombre accesible sigue siendo «Crear», que es como se llamará el destino de la barra inferior
 * en la fase 2.
 */
export function CreateButton({ onPress }: { onPress: () => void }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const glow = useColorScheme() === "dark" ? tokens.shadow.glowDark : tokens.shadow.glow;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Crear"
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
