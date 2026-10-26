import { describe, expect, it } from "vitest";

import { oauthReturnUrl } from "../../src/features/auth/oauthReturnUrl";

describe("oauthReturnUrl", () => {
  it("vuelve a la raíz del sitio publicado", () => {
    expect(oauthReturnUrl("https://chup-chup.es/login")).toBe("https://chup-chup.es");
  });

  it("conserva el puerto, que en local es parte de la dirección", () => {
    expect(oauthReturnUrl("http://localhost:8081/signup")).toBe("http://localhost:8081");
  });

  it("deja fuera la búsqueda y el fragmento", () => {
    expect(oauthReturnUrl("https://chup-chup.es/login?x=1#algo")).toBe("https://chup-chup.es");
  });
});
