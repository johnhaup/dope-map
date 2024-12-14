import hash from "hash-it";
import DopeMap from "../src/index";
import {
  nirvanaKey,
  nirvanaValue,
  weezerKey,
  weezerValue,
} from "../__fixtures__";

describe("DopeMap", () => {
  type TestValue = { [key: number]: string };
  let dopeMap: DopeMap<TestValue>;

  beforeEach(() => {
    dopeMap = new DopeMap<TestValue>();
  });

  it("sets and retrieves a value by key", () => {
    dopeMap.set(nirvanaKey, nirvanaValue);
    expect(dopeMap.get(nirvanaKey)).toEqual(nirvanaValue);
  });

  it("allows for object keys to be equal but different references", () => {
    dopeMap.set(nirvanaKey, nirvanaValue);
    expect(dopeMap.get({ ...nirvanaKey })).toEqual(nirvanaValue);
  });

  it("returns undefined for a non-existing key", () => {
    dopeMap.set(nirvanaKey, nirvanaValue);
    expect(dopeMap.get(nirvanaKey)).toEqual(nirvanaValue);

    const partialNirvanaKey = {
      band: "nirvana",
      genre: "rock",
    };
    expect(dopeMap.get(partialNirvanaKey)).toBeUndefined();
  });

  it("confirms the presence of a key", () => {
    dopeMap.set(nirvanaKey, nirvanaValue);
    expect(dopeMap.get(nirvanaKey)).toEqual(nirvanaValue);
    expect(dopeMap.has(nirvanaKey)).toBe(true);
  });

  it("deletes a key", () => {
    dopeMap.set(nirvanaKey, nirvanaValue);
    expect(dopeMap.get(nirvanaKey)).toEqual(nirvanaValue);

    expect(dopeMap.delete(nirvanaKey)).toBe(true);
    expect(dopeMap.has(nirvanaKey)).toBe(false);
  });

  it("clears all keys", () => {
    dopeMap.set(nirvanaKey, nirvanaValue);
    dopeMap.set(weezerKey, weezerValue);

    dopeMap.clear();
    expect(dopeMap.size).toBe(0);
    expect(dopeMap.has(nirvanaKey)).toBe(false);
    expect(dopeMap.has(weezerKey)).toBe(false);
  });

  it("should get all entries", () => {
    dopeMap.set(weezerKey, weezerValue);
    dopeMap.set(nirvanaKey, nirvanaValue);
    const entries = dopeMap.entries();
    expect(typeof entries.next).toBe("function");

    const entriesArray = dopeMap.entries(true);
    expect(entriesArray).toHaveLength(2);
    expect(typeof entriesArray[0][0]).toBe("string");
    expect(entriesArray[0][1]).toEqual(weezerValue);
    expect(typeof entriesArray[1][0]).toBe("string");
    expect(entriesArray[1][1]).toEqual(nirvanaValue);
  });
});
