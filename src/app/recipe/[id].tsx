import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { BackButton } from "@/components/BackButton";
import { Screen } from "@/components/Screen";
import { RecipeFacts } from "@/features/recipes/RecipeFacts";
import { SectionHeading } from "@/features/recipes/SectionHeading";
import { useRecipe } from "@/features/recipes/useRecipe";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

export default function RecipeScreen() {
  const colors = useColors();
  const params = useLocalSearchParams<{ id: string }>();
  const { recipe, isLoaded } = useRecipe(params.id ?? "");

  if (recipe === null) {
    return (
      <Screen>
        <BackButton />
        <Text style={[styles.message, { color: colors.mutedForeground }]}>
          {isLoaded ? "Esta receta ya no está." : "Abriendo la receta…"}
        </Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <BackButton />
        </View>

        <Text style={[styles.title, { color: colors.foreground }]}>{recipe.title}</Text>
        <RecipeFacts recipe={recipe} />

        <SectionHeading>Ingredientes</SectionHeading>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          {recipe.ingredients.map((ingredient, index) => (
            <View
              key={`${ingredient.name}-${String(index)}`}
              style={[styles.ingredient, index > 0 && { borderTopWidth: 1, borderTopColor: colors.border }]}
            >
              <Text style={[styles.quantity, { color: colors.primary }]}>
                {ingredient.quantity === undefined
                  ? ""
                  : `${String(ingredient.quantity)}${ingredient.unit === undefined ? "" : ` ${ingredient.unit}`}`}
              </Text>
              <Text style={[styles.ingredientName, { color: colors.foreground }]}>{ingredient.name}</Text>
            </View>
          ))}
        </View>

        <SectionHeading>Pasos</SectionHeading>
        {recipe.steps.map((step, index) => (
          <View
            key={`${String(index)}-${step.text.slice(0, 12)}`}
            style={[styles.step, index > 0 && { borderTopWidth: 1, borderTopColor: colors.border }]}
          >
            <View style={[styles.number, { backgroundColor: colors.oliveSoft }]}>
              <Text style={[styles.numberText, { color: colors.olive }]}>{index + 1}</Text>
            </View>
            <Text style={[styles.stepText, { color: colors.foreground }]}>{step.text}</Text>
          </View>
        ))}

        {recipe.notes !== undefined && (
          <>
            <SectionHeading>Mis notas</SectionHeading>
            <View style={[styles.card, { backgroundColor: colors.secondary }]}>
              <Text style={[styles.notes, { color: colors.secondaryForeground }]}>{recipe.notes}</Text>
            </View>
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: tokens.spacing.block * 2 },
  header: { marginBottom: tokens.spacing.block },
  message: { fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.body, marginTop: tokens.spacing.block },
  title: {
    fontFamily: tokens.fontFamily.display,
    fontSize: tokens.fontSize.screenTitle,
    letterSpacing: -0.4,
    marginBottom: tokens.spacing.gutter,
  },
  card: { borderRadius: tokens.radius.xl, paddingHorizontal: tokens.spacing.gutter },
  ingredient: { flexDirection: "row", gap: tokens.spacing.row + 4, paddingVertical: tokens.spacing.row + 4 },
  quantity: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: tokens.fontSize.body, minWidth: 64 },
  ingredientName: { flex: 1, fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.body },
  step: {
    flexDirection: "row",
    gap: tokens.spacing.row + 4,
    paddingVertical: tokens.spacing.row + 6,
  },
  number: { width: 32, height: 32, borderRadius: tokens.radius.pill, alignItems: "center", justifyContent: "center" },
  numberText: { fontFamily: tokens.fontFamily.bodyStrong, fontSize: tokens.fontSize.body },
  stepText: { flex: 1, fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.body, lineHeight: 28 },
  notes: { fontFamily: tokens.fontFamily.body, fontSize: tokens.fontSize.body, lineHeight: 26, paddingVertical: tokens.spacing.gutter },
});
