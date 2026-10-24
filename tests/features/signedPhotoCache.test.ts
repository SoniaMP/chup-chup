import { beforeEach, describe, expect, it, vi } from "vitest";

import { signedPhotoCache } from "../../src/features/photos/signedPhotoCache";

const PATH = "owner/recipe/original.jpg";

describe("signedPhotoCache", () => {
  beforeEach(() => {
    signedPhotoCache.forget(PATH);
  });

  it("devuelve la firma que guardó", () => {
    signedPhotoCache.keep(PATH, "https://firmada/1");

    expect(signedPhotoCache.fresh(PATH)).toBe("https://firmada/1");
  });

  it("no inventa una firma que no tiene", () => {
    expect(signedPhotoCache.fresh("owner/otra/original.jpg")).toBeNull();
  });

  it("olvidar la borra", () => {
    signedPhotoCache.keep(PATH, "https://firmada/1");
    signedPhotoCache.forget(PATH);

    expect(signedPhotoCache.fresh(PATH)).toBeNull();
  });

  it("avisa a quien mira, porque la ruta no cambia al cambiar la foto", () => {
    const watcher = vi.fn();
    const stop = signedPhotoCache.watch(watcher);

    signedPhotoCache.forget(PATH);

    expect(watcher).toHaveBeenCalledTimes(1);
    stop();
  });

  it("deja de avisar a quien ha dejado de mirar", () => {
    const watcher = vi.fn();
    signedPhotoCache.watch(watcher)();

    signedPhotoCache.forget(PATH);

    expect(watcher).not.toHaveBeenCalled();
  });
});
