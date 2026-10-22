import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { ActionSheet, type SheetAction } from "@/components/ActionSheet";
import { BackButton } from "@/components/BackButton";
import { IconButton } from "@/components/IconButton";
import { EmptyState } from "@/components/EmptyState";
import { Screen } from "@/components/Screen";
import { ConfirmDeleteCookbook } from "@/features/cookbooks/ConfirmDeleteCookbook";
import { CookbookTitle } from "@/features/cookbooks/CookbookTitle";
import { useCookbook } from "@/features/cookbooks/useCookbook";
import { useCookbookRecipes } from "@/features/cookbooks/useCookbookRecipes";
import { RecipeRow } from "@/features/library/RecipeRow";
import { tokens } from "@/theme/tokens";
import { useColors } from "@/theme/useColors";

export default function CookbookScreen() {
  const colors = useColors();
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const cookbookId = params.id ?? "";
  const { cookbook, isLoaded, replace } = useCookbook(cookbookId);
  const recipes = useCookbookRecipes(cookbookId);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (cookbook === null) {
    return (
      <Screen>
        <BackButton />
        <Text style={[styles.message, { color: colors.mutedForeground }]}>
          {isLoaded ? "Este libro ya no está." : "Abriendo el libro…"}
        </Text>
      </Screen>
    );
  }

  // Todas las acciones del libro en un sitio, no repartidas por las esquinas de la pantalla.
  const actions: SheetAction[] = [
    {
      label: "Cambiar el nombre",
      icon: "edit",
      onPress: () => {
        setIsMenuOpen(false);
        setIsRenaming(true);
      },
    },
  ];

  if (!cookbook.isSystem) {
    actions.push({
      label: "Borrar el libro",
      icon: "delete-outline",
      isDestructive: true,
      onPress: () => {
        setIsMenuOpen(false);
        setIsDeleting(true);
      },
    });
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <BackButton />
          <IconButton
            name="more-horiz"
            label="Acciones del libro"
            onPress={() => {
              setIsMenuOpen(true);
            }}
          />
        </View>

        <Text style={[styles.label, { color: colors.primary }]}>LIBRO</Text>
        <View style={styles.title}>
          <CookbookTitle
            cookbook={cookbook}
            isRenaming={isRenaming}
            onRenamed={(renamed) => {
              replace(renamed);
              setIsRenaming(false);
            }}
            onCancel={() => {
              setIsRenaming(false);
            }}
          />
        </View>

        {isDeleting && (
          <ConfirmDeleteCookbook
            cookbookId={cookbook.id}
            onDeleted={() => {
              router.replace("/");
            }}
            onCancel={() => {
              setIsDeleting(false);
            }}
          />
        )}

        {recipes !== null && recipes.length === 0 && (
          <EmptyState
            title="Este libro está vacío"
            line="Las recetas se añaden desde la propia receta, con «Añadir a un libro»."
          />
        )}

        <View style={styles.list}>
          {(recipes ?? []).map((recipe) => (
            <RecipeRow
              key={recipe.id}
              recipe={recipe}
              onPress={() => {
                router.push({ pathname: "/recipe/[id]", params: { id: recipe.id } });
              }}
            />
          ))}
        </View>

      </ScrollView>

      <ActionSheet
        isOpen={isMenuOpen}
        actions={actions}
        onClose={() => {
          setIsMenuOpen(false);
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: tokens.spacing.block * 2 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: tokens.spacing.block,
  },
  label: {
    fontFamily: tokens.fontFamily.bodyStrong,
    fontSize: tokens.fontSize.label,
    letterSpacing: 2,
    marginBottom: tokens.spacing.row / 2,
  },
  title: { marginBottom: tokens.spacing.gutter },
  message: {
    fontFamily: tokens.fontFamily.body,
    fontSize: tokens.fontSize.body,
    lineHeight: 24,
    marginTop: tokens.spacing.block,
  },
  list: { gap: tokens.spacing.row / 2 },
});
