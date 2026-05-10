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

  it("hashes arrays into strings", () => {
    const result = dopeHash([1, "two", true]);
    expect(result).toBeTypeOf("string");
    expect(result).toBe('[1,"two",true]');
  });

  it("hashes objects into stable strings", () => {
    const result = dopeHash({
      a: [1, { b: true }, "test"],
      c: { d: "value" },
    });
    expect(result).toBeTypeOf("string");
    // Keys are sorted for stability
    expect(result).toBe('{"a":[1,{"b":true},"test"],"c":{"d":"value"}}');
  });

  it("produces identical hashes for objects with different key order", () => {
    const a = dopeHash({ x: 1, y: 2, z: 3 });
    const b = dopeHash({ z: 3, x: 1, y: 2 });
    expect(a).toBe(b);
  });

  it("handles Date objects via toJSON", () => {
    const date = new Date("2024-01-01T00:00:00.000Z");
    expect(dopeHash(date)).toBe('"2024-01-01T00:00:00.000Z"');
    expect(dopeHash({ d: date })).toBe('{"d":"2024-01-01T00:00:00.000Z"}');
  });

  it("handles objects with custom toJSON", () => {
    const obj = { toJSON: () => "custom-serialization" };
    expect(dopeHash(obj)).toBe('"custom-serialization"');
  });

  it("handles null", () => {
    expect(dopeHash(null)).toBe("null");
  });

  it("handles nested nulls", () => {
    expect(dopeHash({ a: null, b: 1 })).toBe('{"a":null,"b":1}');
  });

  it("handles undefined values inside objects (dropped by JSON.stringify)", () => {
    expect(dopeHash({ a: undefined, b: 1 })).toBe('{"b":1}');
  });

  it("returns 'unknown' for unsupported types", () => {
    expect(dopeHash(BigInt(9007199254740991))).toBe("unknown");
  });
});
