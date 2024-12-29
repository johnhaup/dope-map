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
  let dopeMap: InstanceType<typeof DopeMap<unknown, TestValue>>;

  beforeEach(() => {
    dopeMap = new DopeMap<unknown, TestValue>();
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

  it("returns iterator for entries", () => {
    const entries = dopeMap.entries();

    expect(typeof entries.next).toBe("function");

    const firstItem = entries.next();
    expect(firstItem).toHaveProperty("value");
    expect(firstItem).toHaveProperty("done");
    expect(Array.isArray(firstItem.value)).toBe(true);
    expect(firstItem.value.length).toBe(2);
    expect(firstItem.value[0]).toBe(weezerKey);
    expect(firstItem.value[1]).toBe(weezerValue);

    const secondItem = entries.next();
    expect(secondItem.value[0]).toBe(nirvanaKey);
    expect(secondItem.value[1]).toBe(nirvanaValue);
  });

  it("returns array for getEntries", () => {
    const entries = dopeMap.getEntries();

    expect(Array.isArray(entries)).toBe(true);
    expect(entries.length).toBe(2);
    expect(entries).toEqual([
      [weezerKey, weezerValue],
      [nirvanaKey, nirvanaValue],
    ]);
  });

  it("returns iterator for keys", () => {
    const keys = dopeMap.keys();

    expect(typeof keys.next).toBe("function");

    const firstItem = keys.next();
    expect(firstItem).toHaveProperty("value");
    expect(firstItem).toHaveProperty("done");
    expect(firstItem.value).toBe(weezerKey);

    const secondItem = keys.next();
    expect(secondItem.value).toBe(nirvanaKey);
  });

  it("returns array for getKeys", () => {
    const keys = dopeMap.getKeys();

    expect(Array.isArray(keys)).toBe(true);
    expect(keys.length).toBe(2);
    expect(keys).toEqual([weezerKey, nirvanaKey]);
  });

  it("returns iterator for values", () => {
    const values = dopeMap.values();

    expect(typeof values.next).toBe("function");

    const firstItem = values.next();
    expect(firstItem).toHaveProperty("value");
    expect(firstItem).toHaveProperty("done");
    expect(firstItem.value).toBe(weezerValue);

    let count = 0;
    for (const entry of values) {
      expect(entry).toBe(nirvanaValue);
      count++;
    }

    expect(count).toBe(1);
  });

  it("returns array for getValues", () => {
    const values = dopeMap.getValues();

    expect(Array.isArray(values)).toBe(true);
    expect(values.length).toBe(2);
    expect(values[0]).toBe(weezerValue);
    expect(values[1]).toBe(nirvanaValue);
  });
});
