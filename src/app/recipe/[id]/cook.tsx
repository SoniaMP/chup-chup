import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/Screen";
import { CookNavigation } from "@/features/cooking/CookNavigation";
import { CookProgress } from "@/features/cooking/CookProgress";
import { KeepScreenOnChip } from "@/features/cooking/KeepScreenOnChip";
import { useRecipe } from "@/features/recipes/useRecipe";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

export default function CookScreen() {
  const colors = useColors();
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const { recipe } = useRecipe(params.id ?? "");
  const [index, setIndex] = useState(0);

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

  return (
    <Screen>
      <View style={styles.top}>
        <Pressable accessibilityRole="button" accessibilityLabel="Salir del modo cocina" onPress={leave}>
          <Text style={[styles.close, { color: colors.mutedForeground }]}>Salir</Text>
        </Pressable>
        <KeepScreenOnChip />
      </View>

      <CookProgress total={total} current={index} />
      <Text style={[styles.counter, { color: colors.primary }]}>
        Paso {index + 1} de {total}
      </Text>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.stepArea}>
        <Text style={[styles.step, { color: colors.foreground }]}>{step?.text ?? ""}</Text>
      </ScrollView>

      <View style={styles.navigation}>
        <CookNavigation
          isFirst={index === 0}
          isLast={isLast}
          onPrevious={() => {
            setIndex((current) => Math.max(0, current - 1));
          }}
          onNext={() => {
            if (isLast) leave();
            else setIndex((current) => current + 1);
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
  counter: {
    fontFamily: tokens.fontFamily.display,
    fontSize: tokens.fontSize.sectionHeading,
    marginTop: tokens.spacing.gutter,
  },
  stepArea: { flexGrow: 1, justifyContent: "center", paddingVertical: tokens.spacing.block },
  step: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: tokens.fontSize.cookStep, lineHeight: 46 },
  navigation: { paddingBottom: tokens.spacing.gutter },
});
