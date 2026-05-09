/* eslint-disable @typescript-eslint/no-explicit-any */
import hashIt from "hash-it";
import { DopeMap } from "../src";
import DopeMapV1 from "../src/v1";
import { generateMixedKeys, generatePrimitiveKeys } from "./utils";

export const SIZES = [100, 1_000, 10_000, 100_000];

export const METHODS = ["Set", "Get", "Has", "Delete", "Clear"];

export const KEY_CONFIGS = [
  {
    title: "objects",
    generateKeys: generateMixedKeys,
  },
  {
    title: "primitives",
    generateKeys: generatePrimitiveKeys,
  },
];

export const MAP_IMPLEMENTATIONS = [
  { name: "Map", instance: () => new Map<object, string>() },
  {
    name: "DopeMap",
    instance: () => new DopeMap<unknown, string>(),
  },
  {
    name: "DopeMap w/hash-it",
    instance: () =>
      new DopeMap<unknown, string>(null, { hashFunction: hashIt }),
  },
  { name: "DopeMap V1", instance: () => new DopeMapV1<string>() },
];

export type MapInstance = ReturnType<
  (typeof MAP_IMPLEMENTATIONS)[number]["instance"]
>;

export const REAL_WORLD_PATTERNS = [
  {
    name: "Read-Heavy",
    description: "70% Get, 20% Set, 5% Has, 5% Delete",
    operations: (mapInstance: any, keys: any[], value: any) => {
      keys.forEach((key: any, i: number) => {
        const mod = i % 20;
        if (mod < 14) mapInstance.get(key);
        else if (mod < 18) mapInstance.set(key, value);
        else if (mod < 19) mapInstance.has(key);
        else mapInstance.delete(key);
      });
    },
  },
  {
    name: "Write-Heavy",
    description: "50% Set, 30% Get, 10% Has, 10% Delete",
    operations: (mapInstance: any, keys: any[], value: any) => {
      keys.forEach((key: any, i: number) => {
        const mod = i % 10;
        if (mod < 5) mapInstance.set(key, value);
        else if (mod < 8) mapInstance.get(key);
        else if (mod < 9) mapInstance.has(key);
        else mapInstance.delete(key);
      });
    },
  },
];
