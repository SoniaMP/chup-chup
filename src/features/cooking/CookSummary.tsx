import { ScrollView, StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/components/PrimaryButton";
import { SectionHeading } from "@/components/SectionHeading";
import type { Ingredient } from "@/domain/recipes/ingredient";
import type { SavedRecipe } from "@/domain/recipes/savedRecipe";
import { RecipeIngredients } from "@/features/recipes/RecipeIngredients";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";
import { ServingsPicker } from "./ServingsPicker";

type CookSummaryProps = {
  recipe: SavedRecipe;
  servings: number | undefined;
  ingredients: Ingredient[];
  onChangeServings: (servings: number) => void;
  onStart: () => void;
};

/**
 * Lo que se ve antes del primer paso: qué vas a cocinar, para cuántas personas y con qué. Las
 * raciones se deciden aquí y no en mitad de la receta, con las manos ya en la masa. Si la receta
 * no las dice no sale nada: aquí se viene a cocinar, no a editar.
 */
export function CookSummary({
  recipe,
  servings,
  ingredients,
  onChangeServings,
  onStart,
}: CookSummaryProps) {
  const colors = useColors();

  return (
    <View style={styles.fill}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.kicker, { color: colors.primary }]}>VAS A COCINAR</Text>
        <Text style={[styles.title, { color: colors.foreground }]}>{recipe.title}</Text>
        {servings !== undefined && (
          <ServingsPicker
            servings={servings}
            originalServings={recipe.servings ?? servings}
            onChange={onChangeServings}
          />
        )}
        <SectionHeading>Con estos ingredientes</SectionHeading>
        <RecipeIngredients ingredients={ingredients} />
      </ScrollView>
      <View style={styles.start}>
        <PrimaryButton label="Empezar a cocinar" onPress={onStart} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { paddingBottom: tokens.spacing.block },
  kicker: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: 12, letterSpacing: 1.2 },
  title: {
    fontFamily: tokens.fontFamily.display,
    fontSize: tokens.fontSize.screenTitle,
    letterSpacing: -0.4,
    marginTop: tokens.spacing.row / 2,
    marginBottom: tokens.spacing.gutter,
  },
  start: { paddingBottom: tokens.spacing.gutter, paddingTop: tokens.spacing.row },
});
