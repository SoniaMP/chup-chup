import { StyleSheet, Text, View } from "react-native";

import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

/**
 * Lo que sale en la ficha, en el sitio del selector, cuando la receta no dice para cuántas es: un
 * chip de borde discontinuo, que es como se dice «aquí falta algo», para que al añadirlas el
 * selector aparezca ahí mismo y se entienda.
 *
 * A diferencia de un tiempo que falta, esto sí quita algo: sin raciones no se pueden ajustar las
 * cantidades, y si no se dice, nadie sabrá que se puede. Sin botón: para editar está el lápiz.
 */
export function MissingServings() {
  const colors = useColors();

  return (
    <View style={styles.block}>
      <View style={[styles.chip, { borderColor: colors.mutedForeground }]}>
        <Text style={[styles.chipLabel, { color: colors.mutedForeground }]}>
          Raciones sin definir
        </Text>
      </View>
      <Text style={[styles.hint, { color: colors.mutedForeground }]}>
        Edita la receta para añadir las personas y podrás ajustar las cantidades.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: tokens.spacing.row / 2 },
  chip: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: tokens.radius.pill,
    paddingHorizontal: tokens.spacing.row + 6,
    paddingVertical: tokens.spacing.row / 2 + 2,
  },
  chipLabel: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: tokens.fontSize.label },
  hint: { fontFamily: tokens.fontFamily.body, fontSize: 12 },
});
