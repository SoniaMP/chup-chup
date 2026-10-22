import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";
import { webFocusReset } from "@/theme/webFocusReset";

/**
 * La nota personal de la receta: lo tuyo, no lo de la IA. Se puede editar siempre, y si no
 * hay nota solo se ve un botón discreto.
 */
export function RecipeNotes({
  notes,
  onSave,
}: {
  notes: string | undefined;
  onSave: (notes: string) => void;
}) {
  const colors = useColors();
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(notes ?? "");

  if (isEditing) {
    return (
      <View style={[styles.box, { backgroundColor: colors.secondary }]}>
        <TextInput
          multiline
          autoFocus
          textAlignVertical="top"
          value={text}
          onChangeText={setText}
          placeholder="La próxima vez, menos sal…"
          placeholderTextColor={colors.mutedForeground}
          style={[styles.input, webFocusReset, { color: colors.secondaryForeground }]}
        />
        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setText(notes ?? "");
              setIsEditing(false);
            }}
          >
            <Text style={[styles.action, { color: colors.mutedForeground }]}>Cancelar</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              onSave(text);
              setIsEditing(false);
            }}
          >
            <Text style={[styles.action, { color: colors.primary }]}>Guardar nota</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (notes === undefined) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          setIsEditing(true);
        }}
      >
        <Text style={[styles.add, { color: colors.primary }]}>+ Añadir una nota</Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Editar la nota"
      onPress={() => {
        setText(notes);
        setIsEditing(true);
      }}
      style={[styles.box, { backgroundColor: colors.secondary }]}
    >
      <Text style={[styles.notes, { color: colors.secondaryForeground }]}>{notes}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: { borderRadius: tokens.radius.xl, padding: tokens.spacing.gutter, gap: tokens.spacing.row + 4 },
  notes: { fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.body, lineHeight: 26 },
  input: {
    minHeight: 96,
    fontFamily: tokens.fontFamily.body,
    fontSize: tokens.fontSize.body,
    lineHeight: 26,
  },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: tokens.spacing.gutter },
  action: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: tokens.fontSize.label },
  add: {
    fontFamily: tokens.fontFamily.bodyStrong,
    fontSize: tokens.fontSize.label,
    paddingVertical: tokens.spacing.row + 4,
  },
});
