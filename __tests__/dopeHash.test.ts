import { describe, it, expect } from "vitest";
import { dopeHash } from "../src/dopeHash";

describe("dopeHash", () => {
  it("hashes numbers and prefixes them with an 'n'", () => {
    expect(dopeHash(42)).toBe("n42");
    expect(dopeHash(-1)).toBe("n-1");
    expect(dopeHash(0)).toBe("n0");
  });

  it("hashes strings and prefixes them with an 's'", () => {
    expect(dopeHash("hello")).toBe("shello");
    expect(dopeHash("")).toBe("s");
  });

  it("hashes booleans and prefixes them with a 'b'", () => {
    expect(dopeHash(true)).toBe("btrue");
    expect(dopeHash(false)).toBe("bfalse");
  });

  it("hashes undefined and returns 'u'", () => {
    expect(dopeHash(undefined)).toBe("u");
  });

  it("hashes null and returns 'null'", () => {
    expect(dopeHash(null)).toBe("null");
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

  it("hashes arrays and prefixes them with 'a[' and ']' at the ends", () => {
    expect(dopeHash([1, "two", true])).toBe("a[n1,stwo,btrue,]");
    expect(dopeHash([])).toBe("a[]");
  });

  it("hashes plain objects and prefixes them with 'o{' and '}' at the ends", () => {
    expect(dopeHash({ a: 1, b: "two" })).toBe("o{a:n1b:stwo}");
  });

  it("sorts object keys when 'sortKeys' is true", () => {
    expect(dopeHash({ b: "two", a: 1 }, { sortKeys: true })).toBe(
      "o{a:n1b:stwo}"
    );
  });

  it("handles circular references when 'handleCycles' is true", () => {
    const obj: any = {};
    obj.self = obj;
    expect(dopeHash(obj, { handleCycles: true })).toBe("o{self:[Circular]}");
  });

  it("handles deeply nested structures correctly", () => {
    const nested = {
      a: [1, { b: true }, "test"],
      c: { d: "value" },
    };
    expect(dopeHash(nested)).toBe("o{a:a[n1,o{b:btrue},stest,]c:o{d:svalue}}");
  });

  it("returns 'unknown' for unsupported types", () => {
    expect(dopeHash(BigInt(9007199254740991))).toBe("unknown");
  });
});
