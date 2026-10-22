import type { Cookbook } from "@/domain/cookbooks/cookbook";
import { DEFAULT_COOKBOOK_TITLE } from "@/domain/cookbooks/defaultCookbookTitle";
import { recipesLeftWithoutCookbook } from "@/domain/cookbooks/recipesLeftWithoutCookbook";
import { positionBetween } from "@/domain/ordering/positionBetween";
import { supabase } from "@/lib/supabase";
import { cookbookFromRow } from "./cookbookFromRow";
import { supabaseCookbookRecipeStore } from "./supabaseCookbookRecipeStore";

/**
 * Los libros de la usuaria, en Supabase.
 *
 * `owner_id` no se manda: la columna lo rellena sola con quien esté dentro, y el RLS comprueba
 * que coincida.
 */
export const supabaseCookbookStore = {
  async list(): Promise<Cookbook[]> {
    const { data, error } = await supabase.from("cookbooks").select("*").order("position");

    if (error !== null) throw new Error(error.message);
    return data.map(cookbookFromRow);
  },

  async getById(id: string): Promise<Cookbook | null> {
    const { data, error } = await supabase.from("cookbooks").select("*").eq("id", id).maybeSingle();

    if (error !== null) throw new Error(error.message);
    return data === null ? null : cookbookFromRow(data);
  },

  async create(title: string): Promise<Cookbook> {
    const existing = await this.list();
    const last = existing[existing.length - 1];

    const { data, error } = await supabase
      .from("cookbooks")
      .insert({ title: title.trim(), position: positionBetween(last?.position ?? "", "") })
      .select("*")
      .single();

    if (error !== null) throw new Error(error.message);
    return cookbookFromRow(data);
  },

  /**
   * El libro por defecto, creándolo la primera vez que hace falta.
   *
   * Si dos dispositivos lo crean a la vez, el índice único de la base de datos deja pasar uno
   * solo y aquí se vuelve a leer el que ganó, en vez de acabar con dos libros iguales.
   */
  async ensureDefault(): Promise<Cookbook> {
    const existing = await this.findDefault();
    if (existing !== null) return existing;

    // Va el primero de la lista: es donde cae todo lo que no se coloca a mano.
    const all = await this.list();

    const { data, error } = await supabase
      .from("cookbooks")
      .insert({
        title: DEFAULT_COOKBOOK_TITLE,
        position: positionBetween("", all[0]?.position ?? ""),
        is_system: true,
      })
      .select("*")
      .single();

    if (error === null) return cookbookFromRow(data);

    const winner = await this.findDefault();
    if (winner === null) throw new Error(error.message);
    return winner;
  },

  async findDefault(): Promise<Cookbook | null> {
    const { data, error } = await supabase
      .from("cookbooks")
      .select("*")
      .eq("is_system", true)
      .maybeSingle();

    if (error !== null) throw new Error(error.message);
    return data === null ? null : cookbookFromRow(data);
  },

  async rename(id: string, title: string): Promise<Cookbook> {
    const { data, error } = await supabase
      .from("cookbooks")
      .update({ title: title.trim() })
      .eq("id", id)
      .select("*")
      .single();

    if (error !== null) throw new Error(error.message);
    return cookbookFromRow(data);
  },

  /** Cambia el sitio de un libro en la lista. Solo toca esa fila: la clave es fraccionaria. */
  async move(id: string, position: string): Promise<void> {
    const { error } = await supabase.from("cookbooks").update({ position }).eq("id", id);

    if (error !== null) throw new Error(error.message);
  },

  /**
   * Borra el libro, nunca sus recetas.
   *
   * Las que solo estaban aquí pasan antes al libro por defecto: una receta sin libro no sale en
   * ninguna parte de la biblioteca, así que borrar un libro no puede dejarla escondida.
   */
  async remove(id: string): Promise<void> {
    const loose = recipesLeftWithoutCookbook(await supabaseCookbookRecipeStore.listAll(), id);

    if (loose.length > 0) {
      const fallback = await this.ensureDefault();
      for (const recipeId of loose) {
        await supabaseCookbookRecipeStore.add(fallback.id, recipeId);
      }
    }

    const { error } = await supabase.from("cookbooks").delete().eq("id", id);

    if (error !== null) throw new Error(error.message);
  },
};
