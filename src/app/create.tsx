import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { BackButton } from "@/components/BackButton";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { draftFromStructuredRecipe } from "@/domain/recipes/draftFromStructuredRecipe";
import { structureRecipe } from "@/features/ai/structureRecipe";
import { draftStore } from "@/features/drafts/draftStore";
import { CookingRecipe } from "@/features/recipes/CookingRecipe";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";
import { webFocusReset } from "@/theme/webFocusReset";

const PLACEHOLDER =
  "Tortilla de patatas\n\n6 huevos, 700 g de patatas, 1 cebolla, aceite, sal\n\nse fríen las patatas con la cebolla, se baten los huevos y se cuaja todo en la sartén";

export default function CreateRecipeScreen() {
  const colors = useColors();
  const router = useRouter();
  // El libro del que se viene, cuando se ha entrado desde dentro de uno. Viaja hasta la revisión,
  // que es donde se decide dónde cae la receta.
  const params = useLocalSearchParams<{ cookbookId?: string }>();
  const cookbookId = params.cookbookId ?? "";
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isCooking, setIsCooking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const structure = async (): Promise<void> => {
    setIsCooking(true);
    setError(null);
    try {
      const result = await structureRecipe(text);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      const draftId = await draftStore.create(draftFromStructuredRecipe(result.value, text));
      router.push({ pathname: "/review", params: { draftId, cookbookId } });
    } finally {
      setIsCooking(false);
    }
  };

  if (isCooking) {
    return (
      <Screen>
        <CookingRecipe />
      </Screen>
    );
  }

  return (
    <Screen>
      <KeyboardAvoidingView behavior="padding" style={styles.fill}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <BackButton />
          </View>

          <Text style={[styles.stepLabel, { color: colors.primary }]}>PASO 1 DE 2</Text>
          <Text style={[styles.title, { color: colors.foreground }]}>Nueva receta</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Sin formato, sin prisas. Nosotros lo ordenamos.
          </Text>

          <TextInput
            multiline
            textAlignVertical="top"
            value={text}
            onChangeText={setText}
            onFocus={() => {
              setIsFocused(true);
            }}
            onBlur={() => {
              setIsFocused(false);
            }}
            placeholder={PLACEHOLDER}
            placeholderTextColor={colors.mutedForeground}
            style={[
              styles.input,
            webFocusReset,
              {
                backgroundColor: colors.card,
                borderColor: isFocused ? colors.primary : colors.border,
                color: colors.foreground,
              },
            ]}
          />

          <PrimaryButton
            label="Estructurar con IA"
            isDisabled={text.trim().length === 0}
            onPress={() => {
              void structure();
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
  content: { paddingBottom: tokens.spacing.block },
  header: { marginBottom: tokens.spacing.block },
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
    marginBottom: tokens.spacing.row / 2,
  },
  subtitle: {
    fontFamily: tokens.fontFamily.body,
    fontSize: tokens.fontSize.body,
    lineHeight: 24,
    marginBottom: tokens.spacing.gutter,
  },
  input: {
    minHeight: 288,
    borderRadius: tokens.radius.xxl,
    borderWidth: 2,
    padding: tokens.spacing.gutter,
    fontFamily: tokens.fontFamily.body,
    fontSize: tokens.fontSize.body,
    lineHeight: 24,
    marginBottom: tokens.spacing.gutter,
  },
  error: {
    fontFamily: tokens.fontFamily.body,
    fontSize: tokens.fontSize.label,
    textAlign: "center",
    marginTop: tokens.spacing.row + 4,
  },
});
