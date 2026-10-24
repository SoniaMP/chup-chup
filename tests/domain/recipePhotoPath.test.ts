import { describe, expect, it } from "vitest";

import { recipePhotoPath } from "@/domain/photos/recipePhotoPath";

const owner = "22222222-2222-4222-8222-222222222222";
const recipe = "11111111-1111-4111-8111-111111111111";

describe("recipePhotoPath", () => {
  it("pone a la propietaria la primera, que es lo que miran las políticas de Storage", () => {
    expect(recipePhotoPath(owner, recipe, "original").split("/")[0]).toBe(owner);
  });

  it("separa la foto de la retocada dentro de la carpeta de la receta", () => {
    expect(recipePhotoPath(owner, recipe, "original")).toBe(`${owner}/${recipe}/original.jpg`);
    expect(recipePhotoPath(owner, recipe, "enhanced")).toBe(`${owner}/${recipe}/enhanced.jpg`);
  });
});
