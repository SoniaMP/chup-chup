import type { ReactNode } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

/**
 * El panel que sube desde abajo: el sitio donde esta app pregunta y ofrece acciones.
 *
 * Se cierra tocando fuera, como en cualquier hoja del móvil, y deja libre la franja de abajo
 * del teléfono para que el último botón no quede debajo de la barra del sistema.
 */
export function BottomSheet({ isOpen, onClose, children }: BottomSheetProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={isOpen} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cerrar"
          onPress={onClose}
          style={styles.backdrop}
        />
        <View
          style={[
            styles.panel,
            { backgroundColor: colors.card, paddingBottom: insets.bottom + tokens.spacing.gutter },
          ]}
        >
          <View style={[styles.grip, { backgroundColor: colors.border }]} />
          {children}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: "flex-end" },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(44, 26, 20, 0.45)",
  },
  panel: {
    borderTopLeftRadius: tokens.radius.xxxl,
    borderTopRightRadius: tokens.radius.xxxl,
    paddingTop: tokens.spacing.row + 4,
    paddingHorizontal: tokens.spacing.row,
  },
  grip: {
    width: 44,
    height: 4,
    borderRadius: tokens.radius.pill,
    alignSelf: "center",
    marginBottom: tokens.spacing.row + 4,
  },
});
