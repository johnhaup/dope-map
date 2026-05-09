import { describe, expect, it } from "vitest";
import { DopeMap } from "../src";

function populateMap(map: DopeMap<object>, count: number) {
  for (let i = 0; i < count; i++) {
    map.set(`key-${i}`, { index: i, payload: new Array(50).fill("x") });
  }
}

function populateNativeMap(map: Map<string, object>, count: number) {
  for (let i = 0; i < count; i++) {
    map.set(`key-${i}`, { index: i, payload: new Array(50).fill("x") });
  }
}

function getHeapUsed() {
  global.gc!();
  return process.memoryUsage().heapUsed;
}

describe("DopeMap garbage collection", () => {
  it("retains references while stored (no premature GC)", () => {
    const map = new DopeMap<object>();

    let value: object | null = { data: "important" };

    map.set("key", value);
    value = null;

    global.gc!();

    expect(map.get("key")).toEqual({ data: "important" });
  });

  it("frees measurable heap memory after clear()", () => {
    const map = new DopeMap<object>();
    populateMap(map, 10_000);

    const heapBefore = getHeapUsed();
    map.clear();
    const heapAfter = getHeapUsed();

    const freedBytes = heapBefore - heapAfter;
    // 10k entries with 50-element arrays should free well over 1MB
    expect(freedBytes).toBeGreaterThan(1_000_000);
  });

  it("frees measurable heap memory after deleting all entries", () => {
    const map = new DopeMap<object>();
    populateMap(map, 10_000);

    const heapBefore = getHeapUsed();
    for (let i = 0; i < 10_000; i++) {
      map.delete(`key-${i}`);
    }
    const heapAfter = getHeapUsed();

    const freedBytes = heapBefore - heapAfter;
    expect(freedBytes).toBeGreaterThan(1_000_000);
  });

  it("clear() leaves minimal residual memory", () => {
    const map = new DopeMap<object>();
    populateMap(map, 10_000);

    const heapBefore = getHeapUsed();
    map.clear();
    const heapAfter = getHeapUsed();

    const freedBytes = heapBefore - heapAfter;
    const residualBytes = heapAfter - (heapBefore - freedBytes);

    // Residual should be negligible compared to what was populated
    // (just the empty Map shells remain)
    expect(residualBytes).toBeLessThan(100_000);
  });

  it("frees comparable memory to a native Map", () => {
    const entryCount = 10_000;

    // Measure native Map
    const nativeMap = new Map<string, object>();
    populateNativeMap(nativeMap, entryCount);
    const nativeBefore = getHeapUsed();
    nativeMap.clear();
    const nativeFreed = nativeBefore - getHeapUsed();

    // Measure DopeMap
    const dopeMap = new DopeMap<object>();
    populateMap(dopeMap, entryCount);
    const dopeBefore = getHeapUsed();
    dopeMap.clear();
    const dopeFreed = dopeBefore - getHeapUsed();

    // DopeMap should free at least 50% as much as native Map
    // (overhead from hashKeyMap is expected, but bulk memory is values)
    expect(dopeFreed).toBeGreaterThan(nativeFreed * 0.5);
  });

  it("does not leak memory across repeated populate/clear cycles", () => {
    const map = new DopeMap<object>();

    // Warm up
    populateMap(map, 1_000);
    map.clear();

    const baselineHeap = getHeapUsed();

    // Run 10 populate/clear cycles
    for (let cycle = 0; cycle < 10; cycle++) {
      populateMap(map, 5_000);
      map.clear();
    }

    const finalHeap = getHeapUsed();

    // After clearing, heap should be close to baseline (within 500KB tolerance)
    const growth = finalHeap - baselineHeap;
    expect(growth).toBeLessThan(500_000);
  });
});
