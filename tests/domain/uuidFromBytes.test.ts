import { describe, expect, it } from "vitest";
import { z } from "zod";
import { uuidFromBytes } from "../../src/domain/ids/uuidFromBytes";

const bytes = (fill: number): Uint8Array => new Uint8Array(16).fill(fill);

describe("uuidFromBytes", () => {
  it("produce un UUID que Zod acepta", () => {
    expect(z.uuid().safeParse(uuidFromBytes(bytes(0xab))).success).toBe(true);
  });

  it("marca la versión 4 y la variante, incluso con bytes todo a cero", () => {
    const uuid = uuidFromBytes(bytes(0x00));
    expect(uuid).toBe("00000000-0000-4000-8000-000000000000");
    expect(z.uuid().safeParse(uuid).success).toBe(true);
  });

  it("rechaza una tira de bytes que no mide 16", () => {
    expect(() => uuidFromBytes(new Uint8Array(8))).toThrow();
  });
});
