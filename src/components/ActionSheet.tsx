import { MaterialIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";
import { BottomSheet } from "./BottomSheet";

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
  /** Una línea que explica el estado de lo que se va a tocar. Opcional: casi ningún menú la pone. */
  title?: string;
};

/** El menú de acciones de algo: una lista corta en una hoja, no botones por las esquinas. */
export function ActionSheet({ isOpen, onClose, actions, title }: ActionSheetProps) {
  const colors = useColors();

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      {title !== undefined && (
        <Text style={[styles.title, { color: colors.mutedForeground }]}>{title}</Text>
      )}
      {actions.map((action) => {
        const color = action.isDestructive === true ? colors.destructive : colors.foreground;

        return (
          <Pressable
            key={action.label}
            accessibilityRole="button"
            onPress={action.onPress}
            style={({ pressed }) => [styles.action, pressed && styles.pressed]}
          >
            <MaterialIcons name={action.icon} size={22} color={color} />
            <Text style={[styles.label, { color }]}>{action.label}</Text>
          </Pressable>
        );
      })}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.spacing.row + 6,
    paddingVertical: tokens.spacing.row + 6,
    paddingHorizontal: tokens.spacing.row + 4,
    borderRadius: tokens.radius.lg,
  },
  pressed: { opacity: 0.7 },
  title: {
    fontFamily: tokens.fontFamily.body,
    fontSize: tokens.fontSize.label,
    paddingHorizontal: tokens.spacing.row + 4,
    paddingBottom: tokens.spacing.row,
  },
  label: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: tokens.fontSize.body },
});
