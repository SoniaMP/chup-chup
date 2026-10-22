import { describe, expect, it } from "vitest";
import { splitIntoSteps } from "../../src/features/ai/splitIntoSteps";

describe("splitIntoSteps", () => {
  it("parte por frases", () => {
    expect(splitIntoSteps("se doran los ajos. se añaden las espinacas.")).toEqual([
      "se doran los ajos.",
      "se añaden las espinacas.",
    ]);
  });

  it("parte aunque no haya espacio tras el punto", () => {
    expect(splitIntoSteps("se doran los ajos.se añaden las espinacas")).toHaveLength(2);
  });

  it("parte por conectores cuando no hay puntos", () => {
    const steps = splitIntoSteps("pela las patatas y luego fríelas despacio, después bate los huevos");
    expect(steps).toEqual(["pela las patatas", "luego fríelas despacio", "después bate los huevos"]);
  });

  it("no parte un decimal", () => {
    expect(splitIntoSteps("cuece 1.5 horas a fuego lento")).toEqual(["cuece 1.5 horas a fuego lento"]);
  });

  it("deja en paz una instrucción de una sola frase", () => {
    expect(splitIntoSteps("hornea 25 minutos a 180 grados")).toHaveLength(1);
  });
});

describe("splitIntoSteps con el texto de ejemplo de la app", () => {
  it("parte las instrucciones encadenadas con comas y con 'y'", () => {
    const steps = splitIntoSteps(
      "se fríen las patatas con la cebolla, se baten los huevos y se cuaja todo en la sartén",
    );
    expect(steps).toEqual([
      "se fríen las patatas con la cebolla",
      "se baten los huevos",
      "se cuaja todo en la sartén",
    ]);
  });

  it("no parte una enumeración de ingredientes dentro de un paso", () => {
    expect(splitIntoSteps("añade la sal, la pimienta y el perejil")).toHaveLength(1);
  });
});
