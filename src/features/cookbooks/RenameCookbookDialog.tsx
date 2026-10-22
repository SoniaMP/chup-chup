import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { BottomSheet } from "@/components/BottomSheet";
import { PrimaryButton } from "@/components/PrimaryButton";
import { SecondaryButton } from "@/components/SecondaryButton";
import type { Cookbook } from "@/domain/cookbooks/cookbook";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";
import { webFocusReset } from "@/theme/webFocusReset";
import { supabaseCookbookStore } from "./supabaseCookbookStore";

type RenameCookbookDialogProps = {
  cookbook: Cookbook;
  isOpen: boolean;
  onRenamed: (cookbook: Cookbook) => void;
  onClose: () => void;
};

/** Cambiar el nombre de un libro, también el del libro por defecto. */
export function RenameCookbookDialog({
  cookbook,
  isOpen,
  onRenamed,
  onClose,
}: RenameCookbookDialogProps) {
  const colors = useColors();
  const [draft, setDraft] = useState(cookbook.title);
  const [error, setError] = useState<string | null>(null);

  // Cada vez que se abre, el nombre de ahora: lo escrito y descartado antes no vuelve.
  useEffect(() => {
    setDraft(cookbook.title);
    setError(null);
  }, [cookbook.title, isOpen]);

  const save = async (): Promise<void> => {
    try {
      onRenamed(await supabaseCookbookStore.rename(cookbook.id, draft));
    } catch (cause) {
      console.warn("No se ha podido renombrar el libro", cause);
      setError("No se ha podido cambiar el nombre.");
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <View style={styles.body}>
        <Text style={[styles.heading, { color: colors.foreground }]}>Cambiar nombre</Text>
        <TextInput
          autoFocus
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={() => {
            void save();
          }}
          style={[
            styles.input,
            webFocusReset,
            { backgroundColor: colors.muted, borderColor: colors.primary, color: colors.foreground },
          ]}
        />
        {error !== null && (
          <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text>
        )}
        <View style={styles.choices}>
          <View style={styles.choice}>
            <SecondaryButton label="Cancelar" onPress={onClose} />
          </View>
          <View style={styles.choice}>
            <PrimaryButton
              label="Guardar"
              isDisabled={draft.trim() === "" || draft.trim() === cookbook.title}
              onPress={() => {
                void save();
              }}
            />
          </View>
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  body: { gap: tokens.spacing.row + 4, paddingHorizontal: tokens.spacing.row + 4 },
  heading: { fontFamily: tokens.fontFamily.display, fontSize: tokens.fontSize.sectionHeading },
  input: {
    height: tokens.touch.primaryButton,
    borderRadius: tokens.radius.xl,
    borderWidth: 2,
    paddingHorizontal: tokens.spacing.row + 4,
    fontFamily: tokens.fontFamily.body,
    fontSize: tokens.fontSize.body,
  },
  choices: { flexDirection: "row", gap: tokens.spacing.row },
  choice: { flex: 1 },
  error: { fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.label },
});
