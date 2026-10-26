import { describe, expect, it } from "vitest";

import { minutesText } from "../../src/domain/cooking/minutesText";
import { typedMinutes } from "../../src/domain/cooking/typedMinutes";

describe("typedMinutes", () => {
  it("entiende los minutos a secas", () => {
    expect(typedMinutes("90")).toBe(90);
    expect(typedMinutes("20 min")).toBe(20);
  });

  it("entiende la hora como en un reloj", () => {
    expect(typedMinutes("1:30")).toBe(90);
  });

  it("entiende las horas con su «h»", () => {
    expect(typedMinutes("1h30")).toBe(90);
    expect(typedMinutes("1 h 30 min")).toBe(90);
    expect(typedMinutes("2h")).toBe(120);
  });

  it("lo que no entiende, o un cero, no cambia nada", () => {
    expect(typedMinutes("un rato")).toBeNull();
    expect(typedMinutes("0")).toBeNull();
    expect(typedMinutes("")).toBeNull();
  });
});

describe("minutesText", () => {
  it("por debajo de una hora, en minutos", () => {
    expect(minutesText(20)).toBe("20 min");
  });

  it("por encima, en horas y minutos", () => {
    expect(minutesText(60)).toBe("1 h");
    expect(minutesText(90)).toBe("1 h 30 min");
  });
});
