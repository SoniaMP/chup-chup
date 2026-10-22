import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { IconButton } from "@/components/IconButton";
import type { Cookbook } from "@/domain/cookbooks/cookbook";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";
import { webFocusReset } from "@/theme/webFocusReset";
import { supabaseCookbookStore } from "./supabaseCookbookStore";

type CookbookTitleProps = {
  cookbook: Cookbook;
  isRenaming: boolean;
  onRenamed: (cookbook: Cookbook) => void;
  onCancel: () => void;
};

/** El nombre del libro, que se puede cambiar desde el menú. También el del libro por defecto. */
export function CookbookTitle({ cookbook, isRenaming, onRenamed, onCancel }: CookbookTitleProps) {
  const colors = useColors();
  const [draft, setDraft] = useState(cookbook.title);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDraft(cookbook.title);
    setError(null);
  }, [cookbook.title, isRenaming]);

  const save = async (): Promise<void> => {
    try {
      onRenamed(await supabaseCookbookStore.rename(cookbook.id, draft));
    } catch (cause) {
      console.warn("No se ha podido renombrar el libro", cause);
      setError("No se ha podido cambiar el nombre.");
    }
  };

  if (!isRenaming) {
    return <Text style={[styles.title, { color: colors.foreground }]}>{cookbook.title}</Text>;
  }

  return (
    <View style={styles.editing}>
      <View style={styles.row}>
        <TextInput
          autoFocus
          value={draft}
          onChangeText={setDraft}
          style={[
            styles.input,
            webFocusReset,
            { backgroundColor: colors.card, borderColor: colors.primary, color: colors.foreground },
          ]}
        />
        <IconButton name="close" label="Dejarlo como estaba" onPress={onCancel} />
        <IconButton
          name="save"
          label="Guardar el nombre"
          tone="primary"
          isDisabled={draft.trim() === "" || draft.trim() === cookbook.title}
          onPress={() => {
            void save();
          }}
        />
      </View>
      {error !== null && <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: tokens.spacing.row },
  editing: { gap: tokens.spacing.row },
  title: {
    fontFamily: tokens.fontFamily.display,
    fontSize: tokens.fontSize.screenTitle,
    letterSpacing: -0.4,
  },
  input: {
    flex: 1,
    height: tokens.touch.primaryButton,
    borderRadius: tokens.radius.xl,
    borderWidth: 2,
    paddingHorizontal: tokens.spacing.row + 4,
    fontFamily: tokens.fontFamily.display,
    fontSize: tokens.fontSize.sectionHeading,
  },
  error: { fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.label },
});
