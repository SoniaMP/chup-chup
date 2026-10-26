import { describe, expect, it } from "vitest";

import { adjustedTimer } from "../../src/domain/cooking/cookTimer";
import { countdownText } from "../../src/domain/cooking/countdownText";
import { isTimerDone } from "../../src/domain/cooking/isTimerDone";
import { stepMinutes } from "../../src/domain/cooking/stepMinutes";

describe("stepMinutes", () => {
  it("lee minutos y horas escritos con cifras", () => {
    expect(stepMinutes("Cocina a fuego lento durante 20 minutos.")).toBe(20);
    expect(stepMinutes("Hornea 40 min.")).toBe(40);
    expect(stepMinutes("Deja cocer 2 horas.")).toBe(120);
  });

  it("lee las horas y media", () => {
    expect(stepMinutes("Hornea el pollo durante hora y media.")).toBe(90);
    expect(stepMinutes("Cuece 1 hora y media.")).toBe(90);
  });

  it("de un rango, el más largo", () => {
    expect(stepMinutes("Hornea 35-40 minutos.")).toBe(40);
    expect(stepMinutes("Entre 30 y 35 minutos.")).toBe(35);
  });

  it("lee las expresiones que dicen un tiempo exacto", () => {
    expect(stepMinutes("Deja reposar media hora.")).toBe(30);
    expect(stepMinutes("Remueve durante un minuto.")).toBe(1);
  });

  it("con varios tiempos, el primero", () => {
    expect(stepMinutes("Sofríe 5 minutos y después cuece 20 minutos.")).toBe(5);
  });

  it("no interpreta lo vago", () => {
    expect(stepMinutes("Deja que se cocine un par de minutos.")).toBeNull();
    expect(stepMinutes("Fríe hasta que esté dorado.")).toBeNull();
  });

  it("no confunde temperaturas ni medidas con tiempos", () => {
    expect(stepMinutes("Precalienta el horno a 180 °C.")).toBeNull();
    expect(stepMinutes("Engrasa un molde de 22 cm.")).toBeNull();
  });

  it("en inglés", () => {
    expect(stepMinutes("Bake for 25 minutes.")).toBe(25);
  });
});

describe("countdownText", () => {
  it("minutos y segundos", () => {
    expect(countdownText(32 * 60_000 + 10_000)).toBe("32:10");
  });

  it("con horas", () => {
    expect(countdownText(65 * 60_000)).toBe("1:05:00");
  });

  it("nunca negativo", () => {
    expect(countdownText(-5000)).toBe("0:00");
  });
});

describe("adjustedTimer", () => {
  const now = 1_000_000;
  const timer = { id: "a", label: "Lentejas", endsAt: now + 10 * 60_000 };

  it("suma y quita minutos", () => {
    expect(adjustedTimer(timer, 1, now).endsAt).toBe(now + 11 * 60_000);
    expect(adjustedTimer(timer, -1, now).endsAt).toBe(now + 9 * 60_000);
  });

  it("quitar nunca lo deja por debajo de ahora", () => {
    expect(adjustedTimer({ ...timer, endsAt: now + 30_000 }, -1, now).endsAt).toBe(now);
  });

  it("sumar a uno acabado cuenta desde ahora", () => {
    expect(adjustedTimer({ ...timer, endsAt: now - 60_000 }, 1, now).endsAt).toBe(now + 60_000);
  });
});

describe("isTimerDone", () => {
  const timer = { id: "a", label: "Lentejas", endsAt: 1000 };

  it("suena desde el momento exacto en que llega su hora", () => {
    expect(isTimerDone(timer, 999)).toBe(false);
    expect(isTimerDone(timer, 1000)).toBe(true);
  });
});
