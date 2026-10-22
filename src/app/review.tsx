import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { BackButton } from "@/components/BackButton";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { validateRecipeDraft } from "@/domain/recipes/validateRecipeDraft";
import { draftStore } from "@/features/drafts/draftStore";
import { useDraftEditor } from "@/features/drafts/useDraftEditor";
import { AssumptionsNotice } from "@/features/recipes/AssumptionsNotice";
import { IngredientFields } from "@/features/recipes/IngredientFields";
import { SectionHeading } from "@/features/recipes/SectionHeading";
import { StepFields } from "@/features/recipes/StepFields";
import { TimesFields } from "@/features/recipes/TimesFields";
import { saveRecipe } from "@/features/recipes/saveRecipe";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";
import { webFocusReset } from "@/theme/webFocusReset";

export default function ReviewDraftScreen() {
  const colors = useColors();
  const router = useRouter();
  const params = useLocalSearchParams<{ draftId: string }>();
  const draftId = params.draftId ?? "";
  const { draft, update } = useDraftEditor(draftId);
  const [error, setError] = useState<string | null>(null);

  const save = async (): Promise<void> => {
    if (draft === null) return;

    const validation = validateRecipeDraft(draft);
    if (!validation.ok) {
      setError(validation.issues[0]?.message ?? "Hay algo que revisar");
      return;
    }

    await saveRecipe(validation.value);
    await draftStore.remove(draftId);
    router.replace("/");
  };

  if (draft === null) {
    return (
      <Screen>
        <Text style={[styles.loading, { color: colors.mutedForeground }]}>Abriendo el borrador…</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <BackButton />
        </View>

        <Text style={[styles.stepLabel, { color: colors.primary }]}>PASO 2 DE 2 · REVISIÓN</Text>
        <TextInput
          value={draft.title}
          onChangeText={(title) => {
            update({ title });
          }}
          placeholder="Título de la receta"
          placeholderTextColor={colors.mutedForeground}
          style={[styles.title, webFocusReset, { color: colors.foreground }]}
        />

        <AssumptionsNotice assumptions={draft.assumptions} />
        <TimesFields
          times={{ prepMin: draft.prepMin, cookMin: draft.cookMin, servings: draft.servings }}
          onChange={update}
        />

        <SectionHeading>Ingredientes</SectionHeading>
        <IngredientFields
          ingredients={draft.ingredients}
          onChange={(ingredients) => {
            update({ ingredients });
          }}
        />

        <SectionHeading>Pasos</SectionHeading>
        <StepFields
          steps={draft.steps}
          onChange={(steps) => {
            update({ steps });
          }}
        />

        <View style={styles.save}>
          <PrimaryButton
            label="Guardar receta"
            onPress={() => {
              void save();
            }}
          />
          {error !== null && <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text>}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: tokens.spacing.block * 2 },
  header: { marginBottom: tokens.spacing.block },
  loading: { fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.body },
  stepLabel: {
    fontFamily: tokens.fontFamily.bodyStrong,
    fontSize: tokens.fontSize.label,
    letterSpacing: 2,
    marginBottom: tokens.spacing.row / 2,
  },
  title: {
    fontFamily: tokens.fontFamily.display,
    fontSize: tokens.fontSize.screenTitle,
    letterSpacing: -0.4,
    marginBottom: tokens.spacing.gutter,
  },
  save: { marginTop: tokens.spacing.block * 1.5, gap: tokens.spacing.row },
  error: { fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.label, textAlign: "center" },
});
