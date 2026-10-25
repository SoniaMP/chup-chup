import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { validateRecipeDraft } from "@/domain/recipes/validateRecipeDraft";
import { draftStore } from "@/features/drafts/draftStore";
import { useDraftEditor } from "@/features/drafts/useDraftEditor";
import { AssumptionsNotice } from "@/features/recipes/AssumptionsNotice";
import { CookbookPicker } from "@/features/cookbooks/CookbookPicker";
import { fileRecipeInCookbook } from "@/features/cookbooks/fileRecipeInCookbook";
import { DiscardChangesNotice } from "@/features/recipes/DiscardChangesNotice";
import { IngredientFields } from "@/features/recipes/IngredientFields";
import { ReviewHeader } from "@/features/recipes/ReviewHeader";
import { SectionHeading } from "@/components/SectionHeading";
import { StepFields } from "@/features/recipes/StepFields";
import { TimesFields } from "@/features/recipes/TimesFields";
import { saveRecipe } from "@/features/recipes/saveRecipe";
import { updateRecipe } from "@/features/recipes/updateRecipe";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";
import { webFocusReset } from "@/theme/webFocusReset";

export default function ReviewDraftScreen() {
  const colors = useColors();
  const router = useRouter();
  const params = useLocalSearchParams<{ draftId: string; recipeId?: string; cookbookId?: string }>();
  const draftId = params.draftId ?? "";
  // Con `recipeId` la pantalla es el editor de una receta que ya existe; sin él, el paso 2 de la
  // creación. El formulario es el mismo, solo cambian el rótulo y a dónde va lo guardado.
  const recipeId = params.recipeId ?? "";
  const isEditing = recipeId !== "";
  const { draft, isDirty, update } = useDraftEditor(draftId);
  const [error, setError] = useState<string | null>(null);
  const [isDiscarding, setIsDiscarding] = useState(false);
  // Llegando desde dentro de un libro, la receta cae en ese libro salvo que se cambie abajo:
  // quien pulsa `+` dentro de «Cenas rápidas» está diciendo dónde quiere la receta.
  const cameFrom = params.cookbookId ?? "";
  const [cookbookId, setCookbookId] = useState<string | null>(cameFrom === "" ? null : cameFrom);

  const leaveEditing = (): void => {
    void draftStore.remove(draftId);
    router.replace({ pathname: "/recipe/[id]", params: { id: recipeId } });
  };

  // Volver atrás sin cambios no pregunta nada: no hay nada que perder.
  const goBack = (): void => {
    if (isDirty) setIsDiscarding(true);
    else leaveEditing();
  };

  const save = async (): Promise<void> => {
    if (draft === null) return;

    const validation = validateRecipeDraft(draft);
    if (!validation.ok) {
      setError(validation.issues[0]?.message ?? "Hay algo que revisar");
      return;
    }

    try {
      if (isEditing) {
        await updateRecipe(recipeId, validation.value);
        await draftStore.remove(draftId);
        router.replace({ pathname: "/recipe/[id]", params: { id: recipeId } });
        return;
      }

      const recipe = await saveRecipe(validation.value);
      await fileRecipeInCookbook(recipe.id, cookbookId);
      await draftStore.remove(draftId);
      router.replace("/");
    } catch (cause) {
      // El motivo tal cual: esconderlo detrás de "comprueba la conexión" nos deja a ciegas
      // cuando lo que falla es otra cosa.
      console.warn("No se ha podido guardar la receta", cause);
      const detail = cause instanceof Error ? cause.message : "";
      setError(
        detail === ""
          ? "No se ha podido guardar. Comprueba la conexión e inténtalo otra vez."
          : `No se ha podido guardar: ${detail}`,
      );
    }
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
        <ReviewHeader
          isEditing={isEditing}
          canSave={isDirty}
          onSave={() => {
            void save();
          }}
          onBack={goBack}
        />

        {isDiscarding && (
          <DiscardChangesNotice
            onDiscard={leaveEditing}
            onKeepEditing={() => {
              setIsDiscarding(false);
            }}
          />
        )}

        <Text style={[styles.stepLabel, { color: colors.primary }]}>
          {isEditing ? "EDITAR RECETA" : "PASO 2 DE 2 · REVISIÓN"}
        </Text>
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

        {!isEditing && <CookbookPicker selectedId={cookbookId} onSelect={setCookbookId} />}

        <View style={styles.save}>
          {!isEditing && (
            <PrimaryButton
              label="Guardar receta"
              onPress={() => {
                void save();
              }}
            />
          )}
          {error !== null && <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text>}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: tokens.spacing.block * 2 },
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
