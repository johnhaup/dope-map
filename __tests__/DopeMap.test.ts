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
      Object.values(map).every((v) => v === nirvanaValue || v === weezerValue)
    );
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
