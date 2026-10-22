import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { DEFAULT_COOKBOOK_TITLE } from "@/domain/cookbooks/defaultCookbookTitle";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";
import { useCookbooks } from "./useCookbooks";

type CookbookPickerProps = {
  /** `null` es el libro por defecto: elegir otro es opcional. */
  selectedId: string | null;
  onSelect: (cookbookId: string | null) => void;
};

/** El libro donde va a caer la receta, plegado mientras no te interese cambiarlo. */
export function CookbookPicker({ selectedId, onSelect }: CookbookPickerProps) {
  const colors = useColors();
  const [isOpen, setIsOpen] = useState(false);
  const cookbooks = (useCookbooks().cookbooks ?? []).filter((cookbook) => !cookbook.isSystem);

  const options = [{ id: null, title: DEFAULT_COOKBOOK_TITLE }, ...cookbooks];
  const selected = options.find((option) => option.id === selectedId) ?? options[0];

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Elegir el libro"
        accessibilityState={{ expanded: isOpen }}
        onPress={() => {
          setIsOpen((open) => !open);
        }}
        style={styles.summary}
      >
        <View style={styles.summaryText}>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>SE GUARDA EN</Text>
          <Text numberOfLines={1} style={[styles.title, { color: colors.foreground }]}>
            {selected?.title ?? DEFAULT_COOKBOOK_TITLE}
          </Text>
        </View>
        <MaterialIcons
          name={isOpen ? "expand-less" : "expand-more"}
          size={24}
          color={colors.mutedForeground}
        />
      </Pressable>

      {isOpen &&
        options.map((option) => (
          <Pressable
            key={option.id ?? "default"}
            accessibilityRole="radio"
            accessibilityState={{ selected: option.id === selectedId }}
            onPress={() => {
              onSelect(option.id);
              setIsOpen(false);
            }}
            style={[styles.option, { borderTopColor: colors.border }]}
          >
            <MaterialIcons
              name={option.id === selectedId ? "radio-button-checked" : "radio-button-unchecked"}
              size={20}
              color={option.id === selectedId ? colors.primary : colors.mutedForeground}
            />
            <Text numberOfLines={1} style={[styles.optionLabel, { color: colors.foreground }]}>
              {option.title}
            </Text>
          </Pressable>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: tokens.radius.xl, borderWidth: 1, marginTop: tokens.spacing.block },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.spacing.row,
    padding: tokens.spacing.gutter,
  },
  summaryText: { flex: 1, gap: 2 },
  label: {
    fontFamily: tokens.fontFamily.bodyStrong,
    fontSize: 12,
    letterSpacing: 1.5,
  },
  title: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: tokens.fontSize.body },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.spacing.row + 4,
    paddingHorizontal: tokens.spacing.gutter,
    paddingVertical: tokens.spacing.row + 6,
    borderTopWidth: 1,
  },
  optionLabel: { flex: 1, fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.body },
});
