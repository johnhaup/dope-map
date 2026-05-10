import { describe, it, expect } from "vitest";
import { dopeHash } from "../src/dopeHash";

describe("dopeHash", () => {
  it("does not transform numbers", () => {
    expect(dopeHash(42)).toBe(42);
    expect(dopeHash(-1)).toBe(-1);
    expect(dopeHash(0)).toBe(0);
  });

  it("does not transform strings", () => {
    expect(dopeHash("hello")).toBe("hello");
    expect(dopeHash("")).toBe("");
  });

  it("converts booleans to strings", () => {
    expect(dopeHash(true)).toBe("true");
    expect(dopeHash(false)).toBe("false");
  });

  it("converts undefined to a string", () => {
    expect(dopeHash(undefined)).toBe("undefined");
  });

  it("hashes functions and prefixes them with an 'f'", () => {
    const arrowFn = (x: number, y: number) => {
      return x + y;
    };
    const getIsDopey = function test(isJohn?: boolean) {
      if (isJohn) {
        console.log("2dope 2 die");
        return true;
      } else {
        return false;
      }
    };

    expect(dopeHash(arrowFn)).toBe("f(x,y)=>{returnx+y;}");
    expect(dopeHash(getIsDopey)).toBe(
      'ffunctiontest(isJohn){if(isJohn){console.log("2dope2die");returntrue;}else{returnfalse;}}'
    );
  });

  it("hashes symbols and prefixes them with a 'y'", () => {
    expect(dopeHash(Symbol("test"))).toMatch(/^ySymbol\(test\)$/);
  });

  it("hashes arrays into numbers", () => {
    const result = dopeHash([1, "two", true]);
    expect(result).toBeTypeOf("number");
  });

  it("hashes objects into numbers", () => {
    const result = dopeHash({
      a: [1, { b: true }, "test"],
      c: { d: "value" },
    });
    expect(result).toBeTypeOf("number");
  });

  it("produces identical hashes for objects with different key order", () => {
    const a = dopeHash({ x: 1, y: 2, z: 3 });
    const b = dopeHash({ z: 3, x: 1, y: 2 });
    expect(a).toBe(b);
  });

  it("handles Date objects via toJSON", () => {
    const date = new Date("2024-01-01T00:00:00.000Z");
    expect(dopeHash(date)).toBeTypeOf("number");
    // Same date produces same hash
    expect(dopeHash(date)).toBe(dopeHash(new Date("2024-01-01T00:00:00.000Z")));
  });

  it("handles objects with custom toJSON", () => {
    const obj = { toJSON: () => "custom-serialization" };
    expect(dopeHash(obj)).toBeTypeOf("number");
  });

  it("handles null", () => {
    expect(dopeHash(null)).toBeTypeOf("number");
  });

  it("handles nested nulls and undefined values consistently", () => {
    const a = dopeHash({ a: null, b: 1 });
    const b = dopeHash({ b: 1, a: null });
    expect(a).toBe(b);

    // undefined values are dropped by JSON.stringify
    const c = dopeHash({ a: undefined, b: 1 });
    const d = dopeHash({ b: 1 });
    expect(c).toBe(d);
  });

  it("returns 'unknown' for unsupported types", () => {
    expect(dopeHash(BigInt(9007199254740991))).toBe("unknown");
  });
});
