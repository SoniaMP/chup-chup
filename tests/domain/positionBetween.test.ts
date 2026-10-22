import { describe, expect, it } from "vitest";
import { positionBetween } from "../../src/domain/ordering/positionBetween";

describe("positionBetween", () => {
  it("da una clave para la primera fila de todas", () => {
    expect(positionBetween("", "")).toBe("n");
  });

  it("añade al final y al principio", () => {
    const first = positionBetween("", "");
    expect(positionBetween(first, "") > first).toBe(true);
    expect(positionBetween("", first) < first).toBe(true);
  });

  it("cae entre las dos claves que se le dan", () => {
    const middle = positionBetween("a", "c");
    expect(middle > "a").toBe(true);
    expect(middle < "c").toBe(true);
  });

  it("alarga la clave cuando las vecinas están pegadas", () => {
    const middle = positionBetween("n", "o");
    expect(middle > "n").toBe(true);
    expect(middle < "o").toBe(true);
  });

  it("aguanta meter mil veces en el mismo hueco", () => {
    let low = positionBetween("", "");
    const high = positionBetween(low, "");

    for (let round = 0; round < 1000; round += 1) {
      const next = positionBetween(low, high);
      expect(next > low).toBe(true);
      expect(next < high).toBe(true);
      low = next;
    }
  });

  it("mantiene el orden al construir una lista entera por el final", () => {
    const positions: string[] = [];
    for (let round = 0; round < 50; round += 1) {
      positions.push(positionBetween(positions[positions.length - 1] ?? "", ""));
    }
    expect([...positions].sort()).toEqual(positions);
  });

  it("mantiene el orden al construir una lista entera por el principio", () => {
    const positions: string[] = [];
    for (let round = 0; round < 50; round += 1) {
      positions.unshift(positionBetween("", positions[0] ?? ""));
    }
    expect([...positions].sort()).toEqual(positions);
  });
});
