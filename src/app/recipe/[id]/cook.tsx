import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/Screen";
import { cookingView } from "@/domain/cooking/cookingView";
import { scaledIngredients } from "@/domain/cooking/scaledIngredients";
import { CookCounterRow } from "@/features/cooking/CookCounterRow";
import { CookNavigation } from "@/features/cooking/CookNavigation";
import { CookNextStep } from "@/features/cooking/CookNextStep";
import { CookProgress } from "@/features/cooking/CookProgress";
import { CookStep } from "@/features/cooking/CookStep";
import { CookTimerButton } from "@/features/cooking/CookTimerButton";
import { CookTimersStrip } from "@/features/cooking/CookTimersStrip";
import { CookTopBar } from "@/features/cooking/CookTopBar";
import { CookSummary } from "@/features/cooking/CookSummary";
import { useCookTimers } from "@/features/cooking/useCookTimers";
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
  const [hasStarted, setHasStarted] = useState(false);
  // Las raciones llegan de la ficha y se cambian en el resumen previo, no en los pasos. No se guardan.
  const [chosenServings, setChosenServings] = useState(Number(params.servings) || null);
  const servings = chosenServings ?? recipe?.servings;
  const ingredients =
    recipe === null ? [] : scaledIngredients(recipe.ingredients, recipe.servings, servings ?? 1);
  const view = recipe === null ? null : cookingView({ ...recipe, ingredients }, index);
  const language = recipe?.locale ?? "es-ES";
  const { isSpeaking, toggleReading } = useReadAloud(view?.speech ?? "", language);
  const cookTimers = useCookTimers(language);

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

  if (!hasStarted) {
    return (
      <Screen>
        <CookTopBar onLeave={leave} isTimerRunning={false} />
        <CookSummary
          recipe={recipe}
          servings={servings}
          ingredients={ingredients}
          onChangeServings={setChosenServings}
          onStart={() => {
            setHasStarted(true);
          }}
        />
      </Screen>
    );
  }

  const { total, isLast, current, next, timer } = view;
  const isTimerRunning = cookTimers.timers.some((running) => running.endsAt > cookTimers.now);

  return (
    <Screen>
      <CookTopBar onLeave={leave} isTimerRunning={isTimerRunning} />

      <CookTimersStrip
        timers={cookTimers.timers}
        now={cookTimers.now}
        onAdjust={cookTimers.adjustTimer}
        onDismiss={cookTimers.dismissTimer}
      />
      <CookProgress total={total} current={index} />
      <CookCounterRow
        stepNumber={index + 1}
        total={total}
        hasIngredients={recipe.ingredients.length > 0}
        areIngredientsOpen={areIngredientsOpen}
        onToggleIngredients={() => {
          setAreIngredientsOpen((isOpen) => !isOpen);
        }}
      />

      <CookTimerButton
        key={index}
        minutes={timer.minutes}
        isFromStep={timer.isFromStep}
        onStart={(minutes) => {
          cookTimers.startTimer(timer.label, minutes);
        }}
      />
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
  close: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: tokens.fontSize.label },
  stepArea: { flexGrow: 1, justifyContent: "center", paddingVertical: tokens.spacing.block },
  ingredientsArea: { justifyContent: "flex-start" },
  navigation: { paddingBottom: tokens.spacing.gutter },
});
