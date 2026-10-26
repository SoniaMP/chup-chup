import { StyleSheet, Text, View } from "react-native";

import { IconButton } from "@/components/IconButton";
import { clampServings } from "@/domain/cooking/clampServings";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

/**
 * «Para 4 − +»: para cuántas personas se cocina hoy. No se guarda: cada vez se empieza en las
 * raciones de la receta, porque guardar «la hago para seis» es planificar, y eso es otra cosa.
 */
export function ServingsPicker({
  servings,
  onChange,
}: {
  servings: number;
  onChange: (servings: number) => void;
}) {
  const colors = useColors();

  return (
    <View style={styles.row}>
      <Text style={[styles.label, { color: colors.foreground }]}>Para {servings}</Text>
      <IconButton
        name="remove"
        label="Una ración menos"
        isDisabled={clampServings(servings - 1) === servings}
        onPress={() => {
          onChange(clampServings(servings - 1));
        }}
      />
      <IconButton
        name="add"
        label="Una ración más"
        isDisabled={clampServings(servings + 1) === servings}
        onPress={() => {
          onChange(clampServings(servings + 1));
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: tokens.spacing.row },
  label: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: tokens.fontSize.body, minWidth: 64 },
});
