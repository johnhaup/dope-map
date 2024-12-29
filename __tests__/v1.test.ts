import { beforeEach, describe, expect, it } from "vitest";
import DopeMapV1 from "../src/v1";
import {
  nirvanaKey,
  nirvanaValue,
  weezerKey,
  weezerValue,
} from "../__fixtures__";

describe.each([["DopeMap v1", DopeMapV1]])("%s", (name, DopeMap) => {
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
    const customHashMap = new DopeMap({ hashFunction: () => "123" });
    customHashMap.set({ blarf: true }, "hey there");
    expect(customHashMap.has("123")).toBe(true);
    expect(customHashMap.get("123")).toBe("hey there");
  });

  it("throws error when custom hash function is not a function", () => {
    expect(() => {
      // @ts-expect-error hashFunction is wrong type
      new DopeMap({ hashFunction: "123" });
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

  it("returns iterator for entries when no argument is passed", () => {
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

  it("returns array for entries when true is passed", () => {
    const entries = dopeMap.entries(true);

    expect(Array.isArray(entries)).toBe(true);
    expect(entries.length).toBe(2);
    expect(entries).toEqual([
      [weezerKey, weezerValue],
      [nirvanaKey, nirvanaValue],
    ]);
  });

  it("returns iterator for keys when no argument is passed", () => {
    const keys = dopeMap.keys();

    expect(typeof keys.next).toBe("function");

    const firstItem = keys.next();
    expect(firstItem).toHaveProperty("value");
    expect(firstItem).toHaveProperty("done");
    expect(firstItem.value).toBe(weezerKey);

    const secondItem = keys.next();
    expect(secondItem.value).toBe(nirvanaKey);
  });

  it("returns array for keys when true is passed", () => {
    const keys = dopeMap.keys(true);

    expect(Array.isArray(keys)).toBe(true);
    expect(keys.length).toBe(2);
    expect(keys).toEqual([weezerKey, nirvanaKey]);
  });

  it("returns iterator for values when no argument is passed", () => {
    const keys = dopeMap.values();

    expect(typeof keys.next).toBe("function");

    const firstItem = keys.next();
    expect(firstItem).toHaveProperty("value");
    expect(firstItem).toHaveProperty("done");
    expect(firstItem.value).toBe(weezerValue);

    let count = 0;
    for (const entry of keys) {
      expect(entry).toBe(nirvanaValue);
      count++;
    }

    expect(count).toBe(1);
  });

  it("returns array for values when true is passed", () => {
    const keys = dopeMap.values(true);

    expect(Array.isArray(keys)).toBe(true);
    expect(keys.length).toBe(2);
    expect(keys[0]).toBe(weezerValue);
    expect(keys[1]).toBe(nirvanaValue);
  });
});
