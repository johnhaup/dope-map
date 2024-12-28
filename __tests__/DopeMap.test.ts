import { beforeEach, describe, expect, it } from "vitest";
import DopeMap from "../src/dopeMap";
import Dist from "../dist/index.cjs.js";
const DopeDist = Dist.default as unknown as typeof DopeMap;

import {
  nirvanaKey,
  nirvanaValue,
  weezerKey,
  weezerValue,
} from "../__fixtures__";

describe.each([
  ["DopeMap", DopeMap],
  ["Dist CJS", DopeDist],
])("%s", (name, DopeMap) => {
  type TestValue = { [key: number]: string };
  let dopeMap: InstanceType<typeof DopeMap<TestValue>>;

  beforeEach(() => {
    dopeMap = new DopeMap<TestValue>();
    dopeMap.set(weezerKey, weezerValue);
    dopeMap.set(nirvanaKey, nirvanaValue);
  });

  it("sets and retrieves a value by key", () => {
    expect(dopeMap.get(nirvanaKey)).toEqual(nirvanaValue);
  });

  it("allows for object keys to be equal but different references", () => {
    expect(dopeMap.get({ ...nirvanaKey })).toEqual(nirvanaValue);
  });

  it("uses custom hash function", () => {
    const customHashMap = new DopeMap(null, { hashFunction: () => "123" });
    customHashMap.set({ blarf: true }, "hey there");
    expect(customHashMap.has("123")).toBe(true);
    expect(customHashMap.get("123")).toBe("hey there");
  });

  it("adds initial entries", () => {
    const customHashMap = new DopeMap<number>([[1, 2]]);
    expect(customHashMap.has(1)).toBe(true);
    expect(customHashMap.get(1)).toBe(2);
  });

  it("throws error when custom hash function is not a function", () => {
    expect(() => {
      // @ts-expect-error hashFunction is wrong type
      new DopeMap(null, { hashFunction: "123" });
    }).toThrow("[DOPE] Provided hashFunction must be a function.  Not dope!");
  });

  it("returns undefined for a non-existing key", () => {
    expect(dopeMap.get(nirvanaKey)).toEqual(nirvanaValue);

    const partialNirvanaKey = {
      band: "nirvana",
      genre: "rock",
    };
    expect(dopeMap.get(partialNirvanaKey)).toBeUndefined();
  });

  it("confirms the presence of a key", () => {
    expect(dopeMap.get(nirvanaKey)).toEqual(nirvanaValue);
    expect(dopeMap.has(nirvanaKey)).toBe(true);
  });

  it("deletes a key", () => {
    expect(dopeMap.get(nirvanaKey)).toEqual(nirvanaValue);
    expect(dopeMap.delete(nirvanaKey)).toBe(true);
    expect(dopeMap.has(nirvanaKey)).toBe(false);
  });

  it("clears all keys", () => {
    dopeMap.clear();
    expect(dopeMap.size).toBe(0);
    expect(dopeMap.has(nirvanaKey)).toBe(false);
    expect(dopeMap.has(weezerKey)).toBe(false);
  });

  it("returns object of map", () => {
    const map = dopeMap.getMap();
    expect(typeof map).toBe("object");
    expect(Object.keys(map).every((k) => typeof k === "string")).toBe(true);
    expect(
      Object.values(map).every(
        (v) => v.v === nirvanaValue || v.v === weezerValue
      )
    );
  });

  it("iterates over all entries using the 'forEach' method", () => {
    let index = 0;
    dopeMap.forEach((v, k, m) => {
      if (index === 0) {
        expect(v).toBe(weezerValue);
      } else {
        expect(v).toBe(nirvanaValue);
      }
      expect(m.get(k)).toBe(v);
      index++;
    });
  });
});
