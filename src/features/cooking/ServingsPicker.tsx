import { StyleSheet, Text, View } from "react-native";

import { IconButton } from "@/components/IconButton";
import { clampServings } from "@/domain/cooking/clampServings";
import { peopleText } from "@/domain/cooking/peopleText";
import { servingsNote } from "@/domain/cooking/servingsNote";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

type ServingsPickerProps = {
  servings: number;
  /** Las raciones de la receta, para decir cuánto se ha cambiado. */
  originalServings: number;
  onChange: (servings: number) => void;
};

/**
 * «¿Para cuántas personas? · 6 personas − +». Se explica solo, sin avisos: la pregunta invita a
 * tocarlo, y al cambiarlo una línea dice que las cantidades se han ajustado y que la receta sigue
 * siendo para las que era. No se guarda: cada vez se empieza en las raciones de la receta.
 */
export function ServingsPicker({ servings, originalServings, onChange }: ServingsPickerProps) {
  const colors = useColors();
  const note = servingsNote(servings, originalServings);

  return (
    <View style={styles.picker}>
      <Text style={[styles.question, { color: colors.mutedForeground }]}>
        ¿Para cuántas personas?
      </Text>
      <View style={styles.row}>
        <Text style={[styles.people, { color: colors.foreground }]}>{peopleText(servings)}</Text>
        <IconButton
          name="remove"
          label="Una persona menos"
          isDisabled={clampServings(servings - 1) === servings}
          onPress={() => {
            onChange(clampServings(servings - 1));
          }}
        />
        <IconButton
          name="add"
          label="Una persona más"
          isDisabled={clampServings(servings + 1) === servings}
          onPress={() => {
            onChange(clampServings(servings + 1));
          }}
        />
      </View>
      {note !== null && <Text style={[styles.note, { color: colors.primary }]}>{note}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  picker: { gap: tokens.spacing.row / 2 },
  question: { fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.label },
  row: { flexDirection: "row", alignItems: "center", gap: tokens.spacing.row },
  people: {
    fontFamily: tokens.fontFamily.bodyStrong,
    fontSize: tokens.fontSize.body,
    minWidth: 96,
  },
  note: { fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.label },
});
