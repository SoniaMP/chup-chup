import { MaterialIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

export type SheetAction = {
  label: string;
  icon: ComponentProps<typeof MaterialIcons>["name"];
  isDestructive?: boolean;
  onPress: () => void;
};

type ActionSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  actions: SheetAction[];
};

/** Hoja inferior con las acciones de una pantalla, para no repartirlas por las esquinas. */
export function ActionSheet({ isOpen, onClose, actions }: ActionSheetProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={isOpen} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cerrar el menú"
          onPress={onClose}
          style={styles.backdrop}
        />
        <View
          style={[
            styles.panel,
            {
              backgroundColor: colors.card,
              paddingBottom: insets.bottom + tokens.spacing.gutter,
            },
          ]}
        >
          <View style={[styles.grip, { backgroundColor: colors.border }]} />
          {actions.map((action) => (
            <Pressable
              key={action.label}
              accessibilityRole="button"
              onPress={action.onPress}
              style={({ pressed }) => [styles.action, pressed && styles.pressed]}
            >
              <MaterialIcons
                name={action.icon}
                size={22}
                color={action.isDestructive === true ? colors.destructive : colors.foreground}
              />
              <Text
                style={[
                  styles.label,
                  { color: action.isDestructive === true ? colors.destructive : colors.foreground },
                ]}
              >
                {action.label}
              </Text>
            </Pressable>
          ))}
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
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.spacing.row + 6,
    paddingVertical: tokens.spacing.row + 6,
    paddingHorizontal: tokens.spacing.row + 4,
    borderRadius: tokens.radius.lg,
  },
  pressed: { opacity: 0.7 },
  label: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: tokens.fontSize.body },
});
