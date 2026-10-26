import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/Screen";
import { cookingView } from "@/domain/cooking/cookingView";
import { scaledIngredients } from "@/domain/cooking/scaledIngredients";
import { CookIngredientsChip } from "@/features/cooking/CookIngredientsChip";
import { CookNavigation } from "@/features/cooking/CookNavigation";
import { CookNextStep } from "@/features/cooking/CookNextStep";
import { CookProgress } from "@/features/cooking/CookProgress";
import { CookStep } from "@/features/cooking/CookStep";
import { KeepScreenOnChip } from "@/features/cooking/KeepScreenOnChip";
import { ServingsPicker } from "@/features/cooking/ServingsPicker";
import { useReadAloud } from "@/features/cooking/useReadAloud";
import { RecipeIngredients } from "@/features/recipes/RecipeIngredients";
import { useRecipe } from "@/features/recipes/useRecipe";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

export default function CookScreen() {
  const colors = useColors();
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string; servings?: string }>();
  const { recipe } = useRecipe(params.id ?? "");
  const [index, setIndex] = useState(0);
  const [areIngredientsOpen, setAreIngredientsOpen] = useState(false);
  // Las raciones llegan de la ficha; aquí se pueden cambiar sin salir, y no se guardan.
  const [chosenServings, setChosenServings] = useState(Number(params.servings) || null);
  const servings = chosenServings ?? recipe?.servings;
  const ingredients =
    recipe === null ? [] : scaledIngredients(recipe.ingredients, recipe.servings, servings ?? 1);
  const view = recipe === null ? null : cookingView({ ...recipe, ingredients }, index);
  const { isSpeaking, toggleReading } = useReadAloud(view?.speech ?? "", recipe?.locale ?? "es-ES");

  // Cambiar de paso cierra los ingredientes: se abren para mirar algo, no para quedarse.
  const goToStep = (next: (current: number) => number): void => {
    setAreIngredientsOpen(false);
    setIndex(next);
  };

  const leave = (): void => {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  };

  if (recipe === null || view === null) {
    return (
      <Screen>
        <Pressable accessibilityRole="button" onPress={leave}>
          <Text style={[styles.close, { color: colors.mutedForeground }]}>Salir</Text>
        </Pressable>
      </Screen>
    );
  }

  const { total, isLast, current, next } = view;

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

      {recipe.servings !== undefined && servings !== undefined && (
        <View style={styles.servings}>
          <ServingsPicker servings={servings} onChange={setChosenServings} />
        </View>
      )}
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
          <RecipeIngredients ingredients={ingredients} />
        ) : (
          <CookStep text={current.text} ingredients={current.ingredients} />
        )}
      </ScrollView>

      <View style={styles.navigation}>
        {next !== undefined && <CookNextStep text={next.text} ingredients={next.ingredients} />}
        <CookNavigation
          isFirst={index === 0}
          isLast={isLast}
          isReading={isSpeaking}
          onToggleReading={toggleReading}
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
  servings: { marginBottom: tokens.spacing.row },
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
