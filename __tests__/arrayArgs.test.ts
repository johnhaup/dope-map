import DopeMapV1 from "../src/v1";
import DopeMapV2 from "../src/dopeMap";
import {
  nirvanaKey,
  nirvanaValue,
  weezerKey,
  weezerValue,
} from "../__fixtures__";
import { describe, beforeAll, it, expect } from "vitest";

describe.each([
  ["DopeMap v1", DopeMapV1],
  ["DopeMap v2", DopeMapV2],
])("%s", (name, DopeMap) => {
  type TestValue = { [key: number]: string };
  let dopeMap: InstanceType<typeof DopeMap<TestValue>>;

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
