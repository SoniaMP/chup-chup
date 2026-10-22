import { StyleSheet, View } from "react-native";

import { BackButton } from "@/components/BackButton";
import { IconButton } from "@/components/IconButton";
import { tokens } from "@/theme/tokens";

type ReviewHeaderProps = {
  isEditing: boolean;
  /** Solo se puede guardar si de verdad se ha cambiado algo. */
  canSave: boolean;
  onSave: () => void;
  onBack: () => void;
};

/** La fila de arriba del formulario: volver siempre, y guardar cuando se está editando. */
export function ReviewHeader({ isEditing, canSave, onSave, onBack }: ReviewHeaderProps) {
  if (!isEditing) {
    return (
      <View style={styles.row}>
        <BackButton />
      </View>
    );
  }

  return (
    <View style={styles.row}>
      <IconButton name="arrow-back" label="Volver" onPress={onBack} />
      <IconButton
        name="save"
        label="Guardar los cambios"
        tone="primary"
        isDisabled={!canSave}
        onPress={onSave}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: tokens.spacing.block,
  },
});
