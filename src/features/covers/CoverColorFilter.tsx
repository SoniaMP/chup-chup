import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";
import { COVER_BACKGROUNDS, type CoverBackground } from "./coverBackgrounds";

/** La misma tinta crema con la que están dibujadas las portadas de fondo oscuro. */
const INK_ON_DARK = "#FDF6EA";
/** Un filo finísimo para que el crema no parezca un agujero sobre la hoja, que también es clara. */
const HAIRLINE = "rgba(44, 26, 20, 0.2)";

type CoverColorFilterProps = {
  chosen: CoverBackground | null;
  onChoose: (background: CoverBackground | null) => void;
};

/**
 * Los cuatro colores del catálogo, para quedarse en uno.
 *
 * El catálogo tiene cuarenta y ocho portadas, que son doce motivos repetidos en cuatro fondos.
 * Eligiendo color quedan doce, que es lo que cabe de un vistazo. Tocar el que ya está puesto lo
 * quita: no hace falta un chip de «todas».
 *
 * Elegido, el chip **es** el color, con la tinta que le toque; sin elegir, lleva el color en un
 * punto al lado del nombre. El relleno nunca es el `primary`: un chip verde con fondo rojo no
 * dice lo que es.
 */
export function CoverColorFilter({ chosen, onChoose }: CoverColorFilterProps) {
  const colors = useColors();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {COVER_BACKGROUNDS.map((background) => {
        const isOn = background.id === chosen;

        return (
          <Pressable
            key={background.id}
            accessibilityRole="button"
            accessibilityLabel={`Portadas de fondo ${background.label.toLowerCase()}`}
            accessibilityState={{ selected: isOn }}
            onPress={() => {
              onChoose(isOn ? null : background.id);
            }}
            style={({ pressed }) => [
              styles.chip,
              isOn
                ? { backgroundColor: background.color, borderColor: HAIRLINE }
                : { backgroundColor: colors.muted, borderColor: "transparent" },
              pressed && styles.pressed,
            ]}
          >
            {/* Sin elegir, el color va en un punto: un nombre de color se lee más despacio que el
                color. Elegido sobra, porque el chip entero ya lo es. */}
            {!isOn && <View style={[styles.dot, { backgroundColor: background.color }]} />}
            <Text
              style={[
                styles.label,
                { color: isOn && background.isDark ? INK_ON_DARK : colors.foreground },
              ]}
            >
              {background.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: tokens.spacing.row, paddingRight: tokens.spacing.row },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.spacing.row - 2,
    height: 34,
    paddingHorizontal: tokens.spacing.row + 4,
    borderRadius: tokens.radius.pill,
    // Siempre, aunque sea invisible: sin él, el chip daría un salto al elegirlo.
    borderWidth: 1,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: tokens.radius.pill,
    borderWidth: 1,
    borderColor: HAIRLINE,
  },
  pressed: { opacity: 0.85 },
  label: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: tokens.fontSize.label },
});
