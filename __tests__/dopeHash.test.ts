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

  it("returns 'unknown' for unsupported types", () => {
    expect(dopeHash(BigInt(9007199254740991))).toBe("unknown");
  });
});
