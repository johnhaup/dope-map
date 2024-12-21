import DopeMap from "../src/index";
import {
  nirvanaKey,
  nirvanaValue,
  weezerKey,
  weezerValue,
} from "../__fixtures__";

describe("Array arguments", () => {
  type TestValue = { [key: number]: string };
  let dopeMap: DopeMap<TestValue>;
  const validKeys = new Set(["string", "number"]);

  beforeAll(() => {
    dopeMap = new DopeMap<TestValue>();
    dopeMap.set(weezerKey, weezerValue);
    dopeMap.set(nirvanaKey, nirvanaValue);
  });

  it("returns iterator for entries when no argument is passed", () => {
    const entries = dopeMap.entries();

    expect(typeof entries.next).toBe("function");

    const firstItem = entries.next();
    expect(firstItem).toHaveProperty("value");
    expect(firstItem).toHaveProperty("done");
    expect(Array.isArray(firstItem.value)).toBe(true);
    expect(firstItem.value.length).toBe(2);
    expect(validKeys.has(typeof firstItem.value[0])).toBe(true);
    expect(firstItem.value[1]).toBe(weezerValue);

    let count = 0;
    for (const entry of entries) {
      expect(Array.isArray(entry)).toBe(true);
      expect(entry.length).toBe(2);
      count++;
    }

    expect(count).toBe(1);
  });

  it("returns array for entries when true is passed", () => {
    const entries = dopeMap.entries(true);

    expect(Array.isArray(entries)).toBe(true);
    expect(entries.length).toBe(2);
    expect(validKeys.has(typeof entries[0][0])).toBe(true);
    expect(entries[0][1]).toEqual(weezerValue);
    expect(validKeys.has(typeof entries[1][0])).toBe(true);
    expect(entries[1][1]).toEqual(nirvanaValue);
  });

  it("returns iterator for keys when no argument is passed", () => {
    const keys = dopeMap.keys();

    expect(typeof keys.next).toBe("function");

    const firstItem = keys.next();
    expect(firstItem).toHaveProperty("value");
    expect(firstItem).toHaveProperty("done");
    expect(validKeys.has(typeof firstItem.value)).toBe(true);

    let count = 0;
    for (const entry of keys) {
      expect(validKeys.has(typeof entry)).toBe(true);
      count++;
    }

    expect(count).toBe(1);
  });

  it("returns array for keys when true is passed", () => {
    const keys = dopeMap.keys(true);

    expect(Array.isArray(keys)).toBe(true);
    expect(keys.length).toBe(2);
    keys.forEach((key) => {
      expect(validKeys.has(typeof key)).toBe(true);
      expect(dopeMap.has(key)).toBe(true);
    });
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
