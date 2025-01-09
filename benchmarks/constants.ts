/* eslint-disable @typescript-eslint/no-explicit-any */
import hashIt from "hash-it";
import { DopeMap } from "../src";
import DopeMapV1 from "../src/v1";
import { generateMixedKeys, generatePrimitiveKeys } from "./utils";

export const SIZES = [100, 1_000, 10_000, 100_000];

export const METHODS = ["Set", "Get", "Has", "Delete"];

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

type MapInstance = ReturnType<(typeof MAP_IMPLEMENTATIONS)[number]["instance"]>;

export const REAL_WORLD_PATTERNS = [
  {
    name: "Read-Heavy",
    description: "70% Get, 20% Set, 5% Has, 5% Delete",
    setup: (mapInstance: MapInstance, keys: any[], value: any) => {
      keys.forEach((key) => mapInstance.set(key, value)); // Pre-populate the map
    },
    operations: (mapInstance: any, keys: any[], value: any) => {
      keys.forEach((key, i) => {
        if (i % 10 < 7) mapInstance.get(key); // 70% Get
        else if (i % 10 < 9) mapInstance.set(key, value); // 20% Set
        else if (i % 10 === 9) mapInstance.has(key); // 5% Has
        else mapInstance.delete(key); // 5% Delete
      });
    },
  },
  {
    name: "Write-Heavy",
    description: "50% Set, 30% Get, 10% Has, 10% Delete",
    operations: (mapInstance: MapInstance, keys: any[], value: any) => {
      keys.forEach((key, i) => {
        if (i % 10 < 5) mapInstance.set(key, value); // 50% Set
        else if (i % 10 < 8) mapInstance.get(key); // 30% Get
        else if (i % 10 < 9) mapInstance.has(key); // 10% Has
        else mapInstance.delete(key); // 10% Delete
      });
    },
  },
  {
    name: "Random Access",
    description: "Random distribution of Get, Set, Has, Delete",
    setup: (mapInstance: MapInstance, keys: any[], value: any) => {
      keys.forEach((key) => mapInstance.set(key, value)); // Pre-populate randomly
    },
    operations: (mapInstance: any, keys: any[], value: any) => {
      keys.forEach((key) => {
        const rand = Math.random();
        if (rand < 0.4) mapInstance.get(key); // 40% Get
        else if (rand < 0.7) mapInstance.set(key, value); // 30% Set
        else if (rand < 0.85) mapInstance.has(key); // 15% Has
        else mapInstance.delete(key); // 15% Delete
      });
    },
  },
];
