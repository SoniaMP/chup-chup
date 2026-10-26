import { describe, expect, it } from "vitest";

import { spokenAmount } from "../../src/domain/cooking/spokenAmount";
import { spokenStep } from "../../src/domain/cooking/spokenStep";

describe("spokenAmount", () => {
  it("dice las unidades enteras", () => {
    expect(spokenAmount({ name: "harina", quantity: 250, unit: "g" }, "es")).toBe(
      "250 gramos de harina",
    );
    expect(spokenAmount({ name: "azúcar", quantity: 2, unit: "cda" }, "es")).toBe(
      "2 cucharadas de azúcar",
    );
  });

  it("dice «un» o «una» según el género", () => {
    expect(spokenAmount({ name: "cebolla", quantity: 1 }, "es")).toBe("una cebolla");
    expect(spokenAmount({ name: "lentejas", quantity: 1, unit: "kg" }, "es")).toBe(
      "un kilo de lentejas",
    );
  });

  it("las medias, como se hablan", () => {
    expect(spokenAmount({ name: "cebolla", quantity: 1.5 }, "es")).toBe("una cebolla y media");
    expect(spokenAmount({ name: "lentejas", quantity: 0.5, unit: "kg" }, "es")).toBe(
      "medio kilo de lentejas",
    );
    expect(spokenAmount({ name: "azúcar", quantity: 2.5, unit: "cda" }, "es")).toBe(
      "2 cucharadas y media de azúcar",
    );
  });

  it("lo contado con «ud» se dice sin la unidad", () => {
    expect(spokenAmount({ name: "zanahorias", quantity: 2, unit: "ud" }, "es")).toBe(
      "2 zanahorias",
    );
  });

  it("sin cantidad, solo el nombre", () => {
    expect(spokenAmount({ name: "sal al gusto" }, "es")).toBe("sal al gusto");
  });

  it("los decimales, con coma", () => {
    expect(spokenAmount({ name: "lentejas", quantity: 1.3, unit: "kg" }, "es")).toBe(
      "1,3 kilos de lentejas",
    );
  });

  it("en inglés", () => {
    expect(spokenAmount({ name: "flour", quantity: 240, unit: "g" }, "en")).toBe(
      "240 grams of flour",
    );
    expect(spokenAmount({ name: "eggs", quantity: 2 }, "en")).toBe("2 eggs");
  });
});

describe("spokenStep", () => {
  it("dice el número, el paso y lo que necesitas", () => {
    expect(
      spokenStep(
        2,
        "Sofríe la cebolla en el aceite",
        [
          { name: "cebolla", quantity: 1 },
          { name: "zanahorias", quantity: 2, unit: "ud" },
          { name: "aceite", quantity: 3, unit: "cda" },
        ],
        "es-ES",
      ),
    ).toBe(
      "Paso 2. Sofríe la cebolla en el aceite. Necesitas: una cebolla, 2 zanahorias y 3 cucharadas de aceite.",
    );
  });

  it("sin ingredientes, solo el paso", () => {
    expect(spokenStep(1, "Precalienta el horno a 180 °C.", [], "es-ES")).toBe(
      "Paso 1. Precalienta el horno a 180 °C.",
    );
  });

  it("una receta en inglés se lee en inglés", () => {
    expect(
      spokenStep(3, "Melt the butter", [{ name: "butter", quantity: 15, unit: "g" }], "en-GB"),
    ).toBe("Step 3. Melt the butter. You need: 15 grams of butter.");
  });
});
