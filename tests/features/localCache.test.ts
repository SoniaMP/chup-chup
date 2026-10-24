import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

const disk = new Map<string, string>();

vi.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    getItem: (key: string) => Promise.resolve(disk.get(key) ?? null),
    setItem: (key: string, value: string) => {
      disk.set(key, value);
      return Promise.resolve();
    },
    removeItem: (key: string) => {
      disk.delete(key);
      return Promise.resolve();
    },
    getAllKeys: () => Promise.resolve([...disk.keys()]),
    multiRemove: (keys: string[]) => {
      for (const key of keys) disk.delete(key);
      return Promise.resolve();
    },
  },
}));

const { localCache } = await import("@/features/offline/localCache");

const SCHEMA = z.array(z.object({ id: z.string(), title: z.string() }));
const ANA = "11111111-1111-4111-8111-111111111111";
const EVA = "22222222-2222-4222-8222-222222222222";
const recipes = [{ id: "a", title: "Tortilla" }];

describe("localCache", () => {
  beforeEach(() => {
    disk.clear();
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  it("devuelve lo mismo que guardó", async () => {
    await localCache.write(ANA, "recipes", recipes);

    expect(await localCache.read(ANA, "recipes", SCHEMA)).toEqual(recipes);
  });

  it("devuelve null cuando no hay nada guardado", async () => {
    expect(await localCache.read(ANA, "recipes", SCHEMA)).toBeNull();
  });

  it("no mezcla a dos cocineras del mismo móvil", async () => {
    await localCache.write(ANA, "recipes", recipes);

    expect(await localCache.read(EVA, "recipes", SCHEMA)).toBeNull();
  });

  it("tira lo guardado cuando ya no encaja, en vez de reventar", async () => {
    await localCache.write(ANA, "recipes", recipes);
    const key = [...disk.keys()][0] ?? "";
    disk.set(key, JSON.stringify([{ id: "a" }]));

    expect(await localCache.read(ANA, "recipes", SCHEMA)).toBeNull();
    expect(disk.has(key)).toBe(false);
  });

  it("tira lo guardado cuando ni siquiera es JSON", async () => {
    await localCache.write(ANA, "recipes", recipes);
    const key = [...disk.keys()][0] ?? "";
    disk.set(key, "{roto");

    expect(await localCache.read(ANA, "recipes", SCHEMA)).toBeNull();
  });

  it("al cerrar sesión borra lo de esa cocinera y deja lo de la otra", async () => {
    await localCache.write(ANA, "recipes", recipes);
    await localCache.write(ANA, "cookbooks", []);
    await localCache.write(EVA, "recipes", recipes);

    await localCache.forget(ANA);

    expect(await localCache.read(ANA, "recipes", SCHEMA)).toBeNull();
    expect(await localCache.read(ANA, "cookbooks", SCHEMA)).toBeNull();
    expect(await localCache.read(EVA, "recipes", SCHEMA)).toEqual(recipes);
  });

  it("no toca lo que no es suyo, como la sesión de Supabase", async () => {
    disk.set("sb-auth-token", "lo que sea");
    await localCache.write(ANA, "recipes", recipes);

    await localCache.forget(ANA);

    expect(disk.get("sb-auth-token")).toBe("lo que sea");
  });
});
