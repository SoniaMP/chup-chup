import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput } from "react-native";

import { BackButton } from "@/components/BackButton";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { supabaseCookbookStore } from "@/features/cookbooks/supabaseCookbookStore";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";
import { webFocusReset } from "@/theme/webFocusReset";

export default function NewCookbookScreen() {
  const colors = useColors();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (): Promise<void> => {
    setIsCreating(true);
    setError(null);
    try {
      const cookbook = await supabaseCookbookStore.create(title);
      router.replace({ pathname: "/cookbook/[id]", params: { id: cookbook.id } });
    } catch {
      setError("No hemos podido crear el libro. Comprueba la conexión.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView behavior="padding" style={styles.fill}>
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <BackButton />

          <Text style={[styles.title, { color: colors.foreground }]}>Nuevo libro</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Un libro es una lista de recetas con su propio orden. Una receta puede estar en varios.
          </Text>

          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Navidad, Postres, Cenas rápidas…"
            placeholderTextColor={colors.mutedForeground}
            returnKeyType="done"
            style={[
              styles.input,
              webFocusReset,
              { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground },
            ]}
          />

          <PrimaryButton
            label={isCreating ? "Creando…" : "Crear libro"}
            isDisabled={isCreating || title.trim().length === 0}
            onPress={() => {
              void create();
            }}
          />

          {error !== null && (
            <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  title: {
    fontFamily: tokens.fontFamily.display,
    fontSize: tokens.fontSize.screenTitle,
    letterSpacing: -0.4,
    marginTop: tokens.spacing.block,
    marginBottom: tokens.spacing.row / 2,
  },
  subtitle: {
    fontFamily: tokens.fontFamily.body,
    fontSize: tokens.fontSize.body,
    lineHeight: 24,
    marginBottom: tokens.spacing.gutter,
  },
  input: {
    height: tokens.touch.primaryButton,
    borderRadius: tokens.radius.xl,
    borderWidth: 2,
    paddingHorizontal: tokens.spacing.gutter,
    fontFamily: tokens.fontFamily.body,
    fontSize: tokens.fontSize.body,
    marginBottom: tokens.spacing.gutter,
  },
  error: {
    fontFamily: tokens.fontFamily.body,
    fontSize: tokens.fontSize.label,
    textAlign: "center",
    marginTop: tokens.spacing.row + 4,
  },
});
