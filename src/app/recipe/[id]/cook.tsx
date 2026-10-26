import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/Screen";
import { stepIngredients } from "@/domain/cooking/stepIngredients";
import { CookIngredientsChip } from "@/features/cooking/CookIngredientsChip";
import { CookNavigation } from "@/features/cooking/CookNavigation";
import { CookNextStep } from "@/features/cooking/CookNextStep";
import { CookProgress } from "@/features/cooking/CookProgress";
import { CookStep } from "@/features/cooking/CookStep";
import { KeepScreenOnChip } from "@/features/cooking/KeepScreenOnChip";
import { RecipeIngredients } from "@/features/recipes/RecipeIngredients";
import { useRecipe } from "@/features/recipes/useRecipe";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

export default function CookScreen() {
  const colors = useColors();
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const { recipe } = useRecipe(params.id ?? "");
  const [index, setIndex] = useState(0);
  const [areIngredientsOpen, setAreIngredientsOpen] = useState(false);

  // Cambiar de paso cierra los ingredientes: se abren para mirar algo, no para quedarse.
  const goToStep = (next: (current: number) => number): void => {
    setAreIngredientsOpen(false);
    setIndex(next);
  };

  const leave = (): void => {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  };

  if (recipe === null || recipe.steps.length === 0) {
    return (
      <Screen>
        <Pressable accessibilityRole="button" onPress={leave}>
          <Text style={[styles.close, { color: colors.mutedForeground }]}>Salir</Text>
        </Pressable>
      </Screen>
    );
  }

  const total = recipe.steps.length;
  const step = recipe.steps[Math.min(index, total - 1)];
  const isLast = index === total - 1;
  const next = isLast ? undefined : recipe.steps[index + 1];

  return (
    <Screen>
      <View style={styles.top}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Salir del modo cocina"
          onPress={leave}
        >
          <Text style={[styles.close, { color: colors.mutedForeground }]}>Salir</Text>
        </Pressable>
        <KeepScreenOnChip />
      </View>

      <CookProgress total={total} current={index} />
      <View style={styles.counterRow}>
        <Text style={[styles.counter, { color: colors.primary }]}>
          Paso {index + 1} de {total}
        </Text>
        {recipe.ingredients.length > 0 && (
          <CookIngredientsChip
            isOpen={areIngredientsOpen}
            onToggle={() => {
              setAreIngredientsOpen((isOpen) => !isOpen);
            }}
          />
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.stepArea, areIngredientsOpen && styles.ingredientsArea]}
      >
        {areIngredientsOpen ? (
          <RecipeIngredients ingredients={recipe.ingredients} />
        ) : (
          <CookStep
            text={step?.text ?? ""}
            ingredients={stepIngredients(step?.text ?? "", recipe.ingredients)}
          />
        )}
      </ScrollView>

      <View style={styles.navigation}>
        {next !== undefined && (
          <CookNextStep
            text={next.text}
            ingredients={stepIngredients(next.text, recipe.ingredients)}
          />
        )}
        <CookNavigation
          isFirst={index === 0}
          isLast={isLast}
          onPrevious={() => {
            goToStep((current) => Math.max(0, current - 1));
          }}
          onNext={() => {
            if (isLast) leave();
            else goToStep((current) => current + 1);
          }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: tokens.spacing.gutter,
  },
  close: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: tokens.fontSize.label },
  counterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: tokens.spacing.row,
    marginTop: tokens.spacing.gutter,
  },
  counter: { fontFamily: tokens.fontFamily.display, fontSize: tokens.fontSize.sectionHeading },
  stepArea: { flexGrow: 1, justifyContent: "center", paddingVertical: tokens.spacing.block },
  ingredientsArea: { justifyContent: "flex-start" },
  navigation: { paddingBottom: tokens.spacing.gutter },
});
