import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useDopeMap } from "../src/react";
import { DopeMap } from "../src";

describe("useDopeMap", () => {
  it("returns a DopeMap instance", () => {
    const { result } = renderHook(() => useDopeMap());
    expect(result.current).toBeInstanceOf(DopeMap);
  });

  it("returns a stable reference across re-renders", () => {
    const { result, rerender } = renderHook(() => useDopeMap());
    const firstRef = result.current;
    rerender();
    expect(result.current).toBe(firstRef);
  });

  it("preserves map state across re-renders", () => {
    const { result, rerender } = renderHook(() => useDopeMap<string>());
    result.current.set("key", "value");
    rerender();
    expect(result.current.get("key")).toBe("value");
  });

  it("clears the map on unmount", () => {
    const { result, unmount } = renderHook(() => useDopeMap<string>());
    result.current.set("key", "value");
    expect(result.current.size).toBe(1);

    const clearSpy = vi.spyOn(result.current, "clear");
    unmount();

    expect(clearSpy).toHaveBeenCalledOnce();
  });

  it("returns an empty map after unmount", () => {
    const { result, unmount } = renderHook(() => useDopeMap<string>());
    result.current.set("key", "value");
    unmount();
    expect(result.current.size).toBe(0);
  });

  it("accepts initial entries", () => {
    const entries: [string, number][] = [
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ];
    const { result } = renderHook(() =>
      useDopeMap<number, string>(entries)
    );
    expect(result.current.size).toBe(3);
    expect(result.current.get("a")).toBe(1);
    expect(result.current.get("b")).toBe(2);
    expect(result.current.get("c")).toBe(3);
  });

  it("accepts a custom hash function via config", () => {
    const hashFunction = () => "constant-hash";
    const { result } = renderHook(() =>
      useDopeMap<string>(null, { hashFunction })
    );
    result.current.set({ foo: "bar" }, "value1");
    result.current.set({ baz: "qux" }, "value2");
    // Both keys hash to same value, so only one entry
    expect(result.current.size).toBe(1);
  });

  it("does not re-create the map when config changes", () => {
    const { result, rerender } = renderHook(
      ({ config }) => useDopeMap<string>(null, config),
      { initialProps: { config: { hashFunction: () => "a" } } }
    );
    const firstRef = result.current;
    rerender({ config: { hashFunction: () => "b" } });
    expect(result.current).toBe(firstRef);
  });

  it("works with object keys", () => {
    const { result } = renderHook(() => useDopeMap<string>());
    const key = { id: 1, name: "test" };
    result.current.set(key, "value");
    expect(result.current.get({ id: 1, name: "test" })).toBe("value");
  });

  it("supports all DopeMap methods", () => {
    const { result } = renderHook(() => useDopeMap<string>());
    const map = result.current;

    map.set("a", "1");
    map.set("b", "2");
    map.set("c", "3");

    expect(map.has("a")).toBe(true);
    expect(map.has("z")).toBe(false);
    expect(map.size).toBe(3);

    expect(map.delete("b")).toBe(true);
    expect(map.size).toBe(2);

    const entries = map.getEntries();
    expect(entries).toEqual([
      ["a", "1"],
      ["c", "3"],
    ]);

    const keys = map.getKeys();
    expect(keys).toEqual(["a", "c"]);

    const values = map.getValues();
    expect(values).toEqual(["1", "3"]);
  });

  it("supports forEach", () => {
    const { result } = renderHook(() => useDopeMap<number, string>());
    result.current.set("x", 10);
    result.current.set("y", 20);

    const collected: [string, number][] = [];
    result.current.forEach((value, key) => {
      collected.push([key, value]);
    });

    expect(collected).toEqual([
      ["x", 10],
      ["y", 20],
    ]);
  });

  it("supports iterators", () => {
    const { result } = renderHook(() => useDopeMap<number, string>());
    result.current.set("a", 1);
    result.current.set("b", 2);

    const entriesIter = result.current.entries();
    expect(entriesIter.next().value).toEqual(["a", 1]);
    expect(entriesIter.next().value).toEqual(["b", 2]);
    expect(entriesIter.next().done).toBe(true);

    const keysIter = result.current.keys();
    expect(keysIter.next().value).toBe("a");
    expect(keysIter.next().value).toBe("b");

    const valuesIter = result.current.values();
    expect(valuesIter.next().value).toBe(1);
    expect(valuesIter.next().value).toBe(2);
  });

  it("handles multiple mount/unmount cycles independently", () => {
    const { result: result1, unmount: unmount1 } = renderHook(() =>
      useDopeMap<string>()
    );
    const { result: result2 } = renderHook(() => useDopeMap<string>());

    result1.current.set("key", "value1");
    result2.current.set("key", "value2");

    expect(result1.current).not.toBe(result2.current);
    expect(result1.current.get("key")).toBe("value1");
    expect(result2.current.get("key")).toBe("value2");

    unmount1();
    expect(result1.current.size).toBe(0);
    expect(result2.current.size).toBe(1);
  });

});
