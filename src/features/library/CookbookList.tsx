import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

import type { Cookbook } from "@/domain/cookbooks/cookbook";
import type { Recipe } from "@/domain/recipes/recipe";
import { CookbookActions } from "@/features/cookbooks/CookbookActions";
import { tokens } from "@/theme/tokens";
import { CookbookListItem } from "./CookbookListItem";

type CookbookListProps = {
  cookbooks: Cookbook[];
  recipes: Recipe[];
  /** Identificadores de receta por libro, en el orden del libro. */
  membership: Map<string, string[]>;
  /** Para volver a leer la biblioteca cuando un libro cambia de nombre o desaparece. */
  onChanged: () => void;
};

/** La biblioteca: tus libros a lo ancho, cada uno con sus recetas dentro. */
export function CookbookList({ cookbooks, recipes, membership, onChanged }: CookbookListProps) {
  const byId = useMemo(() => new Map(recipes.map((recipe) => [recipe.id, recipe])), [recipes]);
  // El libro cuyas acciones se han pedido dejando el dedo encima. Una hoja para toda la lista.
  const [chosen, setChosen] = useState<Cookbook | null>(null);

  return (
    <View style={styles.list}>
      {cookbooks.map((cookbook) => (
        <CookbookListItem
          key={cookbook.id}
          cookbook={cookbook}
          recipes={(membership.get(cookbook.id) ?? [])
            .map((id) => byId.get(id))
            .filter((recipe): recipe is Recipe => recipe !== undefined)}
          onOpenActions={() => {
            setChosen(cookbook);
          }}
        />
      ))}

      {chosen !== null && (
        <CookbookActions
          cookbook={chosen}
          isOpen
          onClose={() => {
            setChosen(null);
          }}
          onRenamed={() => {
            setChosen(null);
            onChanged();
          }}
          onDeleted={() => {
            setChosen(null);
            onChanged();
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: tokens.spacing.row / 2 },
});
