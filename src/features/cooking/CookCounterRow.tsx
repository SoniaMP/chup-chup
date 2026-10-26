import { StyleSheet, Text, View } from "react-native";

import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";
import { CookIngredientsChip } from "./CookIngredientsChip";

type CookCounterRowProps = {
  stepNumber: number;
  total: number;
  hasIngredients: boolean;
  areIngredientsOpen: boolean;
  onToggleIngredients: () => void;
};

/** «Paso 3 de 9» y, a la derecha, el chip que abre la lista entera de ingredientes. */
export function CookCounterRow({
  stepNumber,
  total,
  hasIngredients,
  areIngredientsOpen,
  onToggleIngredients,
}: CookCounterRowProps) {
  const colors = useColors();

  return (
    <View style={styles.row}>
      <Text style={[styles.counter, { color: colors.primary }]}>
        Paso {stepNumber} de {total}
      </Text>
      {hasIngredients && (
        <CookIngredientsChip isOpen={areIngredientsOpen} onToggle={onToggleIngredients} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: tokens.spacing.row,
    marginTop: tokens.spacing.gutter,
  },
  counter: { fontFamily: tokens.fontFamily.display, fontSize: tokens.fontSize.sectionHeading },
});
