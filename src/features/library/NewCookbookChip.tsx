import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text } from "react-native";

import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

/**
 * «Nuevo libro», a la derecha de la fila de chips.
 *
 * Vive en la cabecera y no en la lista porque la lista se va hacia arriba en cuanto hay libros, y
 * esto tiene que estar siempre a mano. Va a la derecha y separado de los chips que filtran: esa
 * fila acabará siendo «Favoritas · Recetarios · Libros · Recetas» y los filtros crecen por la
 * izquierda. Sin relleno y con filo de puntos, para que no se confunda con ellos: estos acotan lo
 * que ves, este crea algo.
 */
export function NewCookbookChip({ onPress }: { onPress: () => void }) {
  const colors = useColors();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Crear un libro nuevo"
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        { borderColor: colors.primary },
        pressed && styles.pressed,
      ]}
    >
      <MaterialIcons name="add" size={18} color={colors.primary} />
      <Text style={[styles.label, { color: colors.primary }]}>Nuevo libro</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.spacing.row - 2,
    height: 38,
    paddingHorizontal: tokens.spacing.row + 6,
    borderRadius: tokens.radius.pill,
    borderWidth: 1,
    borderStyle: "dashed",
  },
  pressed: { opacity: 0.6 },
  label: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: tokens.fontSize.label },
});
