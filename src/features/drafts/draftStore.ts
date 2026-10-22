import AsyncStorage from "@react-native-async-storage/async-storage";
import { randomUuid } from "@/lib/randomUuid";

import { recipeDraftSchema, type RecipeDraft } from "@/domain/recipes/recipeDraft";

const keyOf = (id: string): string => `recetario.draft.${id}`;

/**
 * Los borradores viven en el dispositivo y nunca viajan a la base de datos.
 * Se guardan para poder pasarlos entre pantallas y para no perderlos si cierras la app.
 */
export const draftStore = {
  async create(draft: RecipeDraft): Promise<string> {
    const id = randomUuid();
    await AsyncStorage.setItem(keyOf(id), JSON.stringify(draft));
    return id;
  },

  async get(id: string): Promise<RecipeDraft | null> {
    const stored = await AsyncStorage.getItem(keyOf(id));
    if (stored === null) return null;

    const parsed = recipeDraftSchema.safeParse(JSON.parse(stored));
    return parsed.success ? parsed.data : null;
  },

  async update(id: string, draft: RecipeDraft): Promise<void> {
    await AsyncStorage.setItem(keyOf(id), JSON.stringify(draft));
  },

  async remove(id: string): Promise<void> {
    await AsyncStorage.removeItem(keyOf(id));
  },
};
