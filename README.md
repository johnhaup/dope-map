<div align="center">
  <a href="https://youtu.be/lgErexMUTC0?si=e5aRXD95TYwhgihG">
    <img alt="dope" width=300 src="dope-badges.png">
  </a>
</div>

# dope-map

A wrapper around [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) that adds the ability to uses keys of equal but not referential value. This comes with a performance tradeoff (see [Benchmarks](#benchmarks)), so if your dataset is large take that into consideration.

Defaults to using [hash-it](https://github.com/planttheidea/hash-it) for its key hashing function. You can supply a different hashing function in DopeMap's config (as long as it returns a `string` or `number`).

#### RoadMap 🚧

1. Enhance interactive demo site (check out the wip <a href="https://johnhaup.github.io/dope-map/" target="_blank">here</a>)
2. Add `config` option to make retaining original keys optional
3. Add `config` options to speed up hash time if consumer has some awareness of key shape (ex: object where only top level of keys matters)
4. Obviously speed up hash time dang get off my case

## Installation

```bash
yarn add @johnhaup/dope-map hash-it
```

## Usage

```javascript
import DopeMap from "@johnhaup/dope-map";

const dopeMap = new DopeMap();

const key1 = { foo: "bar", to: "fu" };
const key2 = { foo: "bar", to: "fu" };

dopeMap.set(key1, [1, 2, 3, 4, 5]);
dopeMap.set(key2, "numbers");

console.log(dopeMap.size); // Output: 1
console.log(dopeMap.get(key1)); // Output: "numbers"
console.log(dopeMap.get(key2)); // Output: "numbers" <- Same reference as above
console.log(dopeMap.get({ to: "fu", foo: "bar" })); // Output: "numbers" <- Same reference as above

// Compared to Map
const map = new Map();

map.set(key1, [1, 2, 3, 4, 5]);
map.set(key2, "numbers");

console.log(map.size); // Output: 2
console.log(map.get(key1)); // Output: [1, 2, 3, 4, 5]
console.log(map.get(key2)); // Output: "numbers"
console.log(map.get({ to: "fu", foo: "bar" })); // Output: undefined
```

```javascript
// Custom hash function
import DopeMap from "@johnhaup/dope-map";
import blazeHasher from "blazing-fast-hash-package";

const dopeMap = new DopeMap({ hashFunction: blazeHasher });
```

### API Reference

The following table summarizes the **methods** and **properties** of `DopeMap`, along with their functionality. If a method behaves identically to JavaScript's native `Map`, it's marked **✅**. If it extends `Map` functionality, it's marked **✅ + Extra**.

| **Method/Property**                                                       | **Type**      | **Description**                                                          | **Same as Map?**                 |
| ------------------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------ | -------------------------------- |
| **`constructor(config?: DopeMapConfig)`**                                 | `constructor` | Initializes a new `DopeMap`. Optionally accepts a custom `hashFunction`. | ✅ + Extra (`hashFunction`)      |
| **`set(key: K, value: V): void`**                                         | `method`      | Sets a value for the given key.                                          | ✅ Same as `Map.set()`           |
| **`get(key: K): V \| undefined`**                                         | `method`      | Retrieves a value by its key.                                            | ✅ Same as `Map.get()`           |
| **`has(key: K): boolean`**                                                | `method`      | Checks if a key exists in the map.                                       | ✅ Same as `Map.has()`           |
| **`delete(key: K): boolean`**                                             | `method`      | Deletes a key-value pair from the map.                                   | ✅ Same as `Map.delete()`        |
| **`clear(): void`**                                                       | `method`      | Removes all key-value pairs from the map.                                | ✅ Same as `Map.clear()`         |
| **`get size(): number`**                                                  | `property`    | Returns the number of entries in the map.                                | ✅ Same as `Map.size`            |
| **`getMap(): Record<K, V>`**                                              | `method`      | Returns all entries as a plain object with hashed keys.                  | ✅ + Extra (Plain Object Output) |
| **`entries(asArray: true): [K, V][]`**                                    | `method`      | Returns all entries as an array of `[key, value]` pairs.                 | ✅ + Extra (Array Support)       |
| **`entries(asArray?: false): IterableIterator<[K, V]>`**                  | `method`      | Returns an iterator of `[key, value]` pairs.                             | ✅ Same as `Map.entries()`       |
| **`forEach(callback: (value: V, key: K, map: Map<K, V>) => void): void`** | `method`      | Executes a callback for each key-value pair.                             | ✅ Same as `Map.forEach()`       |
| **`keys(asArray: true): K[]`**                                            | `method`      | Returns an array of keys.                                                | ✅ + Extra (Array Support)       |
| **`keys(asArray?: false): IterableIterator<K>`**                          | `method`      | Returns an iterator of keys.                                             | ✅ Same as `Map.keys()`          |
| **`values(asArray: true): V[]`**                                          | `method`      | Returns an array of values.                                              | ✅ + Extra (Array Support)       |
| **`values(asArray?: false): IterableIterator<V>`**                        | `method`      | Returns an iterator of values.                                           | ✅ Same as `Map.values()`        |

## Benchmarks

_Each Dope/Map grows to the entry size. Averages of method time are below._

<!-- BENCHMARK RESULTS START -->
#### objects keys / 100 entries
| Operation | Map (ms) | DopeMap
V1 Legacy (ms) | DopeMap (ms) | DopeMap
{ sortKeys: true } (ms) | DopeMap
{ handleCycles: true } (ms) |
|-----------|-----------|-----------|-----------|-----------|-----------|
| Set | 0.001 | 0.070 (+0.069) | 0.004 (+0.003) | 0.004 (+0.003) | 0.004 (+0.003) | |
| Get | 0.000 | 0.069 (+0.069) | 0.002 (+0.002) | 0.002 (+0.002) | 0.002 (+0.002) | |
| Has | 0.000 | 0.067 (+0.067) | 0.001 (+0.001) | 0.001 (+0.001) | 0.001 (+0.001) | |
| Delete | 0.000 | 0.068 (+0.068) | 0.002 (+0.001) | 0.002 (+0.001) | 0.002 (+0.001) | |

#### primitives keys / 100 entries
| Operation | Map (ms) | DopeMap
V1 Legacy (ms) | DopeMap (ms) | DopeMap
{ sortKeys: true } (ms) | DopeMap
{ handleCycles: true } (ms) |
|-----------|-----------|-----------|-----------|-----------|-----------|
| Set | 0.001 | 0.002 (+0.001) | 0.004 (+0.003) | 0.004 (+0.003) | 0.004 (+0.003) | |
| Get | 0.000 | 0.001 (+0.001) | 0.002 (+0.002) | 0.002 (+0.002) | 0.002 (+0.002) | |
| Has | 0.000 | 0.000 (+0.000) | 0.001 (+0.001) | 0.001 (+0.001) | 0.001 (+0.001) | |
| Delete | 0.000 | 0.001 (+0.000) | 0.002 (+0.001) | 0.002 (+0.001) | 0.002 (+0.001) | |

#### objects keys / 1,000 entries
| Operation | Map (ms) | DopeMap
V1 Legacy (ms) | DopeMap (ms) | DopeMap
{ sortKeys: true } (ms) | DopeMap
{ handleCycles: true } (ms) |
|-----------|-----------|-----------|-----------|-----------|-----------|
| Set | 0.012 | 0.767 (+0.756) | 0.046 (+0.034) | 0.046 (+0.034) | 0.046 (+0.034) | |
| Get | 0.001 | 0.757 (+0.756) | 0.026 (+0.025) | 0.026 (+0.025) | 0.026 (+0.026) | |
| Has | 0.000 | 0.716 (+0.715) | 0.016 (+0.015) | 0.016 (+0.016) | 0.016 (+0.016) | |
| Delete | 0.005 | 0.709 (+0.704) | 0.020 (+0.015) | 0.019 (+0.015) | 0.019 (+0.014) | |

#### primitives keys / 1,000 entries
| Operation | Map (ms) | DopeMap
V1 Legacy (ms) | DopeMap (ms) | DopeMap
{ sortKeys: true } (ms) | DopeMap
{ handleCycles: true } (ms) |
|-----------|-----------|-----------|-----------|-----------|-----------|
| Set | 0.013 | 0.030 (+0.017) | 0.054 (+0.042) | 0.054 (+0.041) | 0.055 (+0.043) | |
| Get | 0.001 | 0.019 (+0.018) | 0.033 (+0.032) | 0.032 (+0.032) | 0.033 (+0.033) | |
| Has | 0.001 | 0.007 (+0.006) | 0.016 (+0.016) | 0.017 (+0.016) | 0.016 (+0.016) | |
| Delete | 0.005 | 0.009 (+0.004) | 0.025 (+0.020) | 0.025 (+0.020) | 0.025 (+0.020) | |

#### objects keys / 10,000 entries
| Operation | Map (ms) | DopeMap
V1 Legacy (ms) | DopeMap (ms) | DopeMap
{ sortKeys: true } (ms) | DopeMap
{ handleCycles: true } (ms) |
|-----------|-----------|-----------|-----------|-----------|-----------|
| Set | 0.170 | 7.720 (+7.549) | 0.616 (+0.446) | 0.629 (+0.458) | 0.621 (+0.450) | |
| Get | 0.023 | 7.356 (+7.333) | 0.460 (+0.436) | 0.452 (+0.429) | 0.445 (+0.422) | |
| Has | 0.032 | 6.971 (+6.938) | 0.186 (+0.154) | 0.188 (+0.155) | 0.188 (+0.155) | |
| Delete | 0.053 | 6.938 (+6.885) | 0.239 (+0.186) | 0.245 (+0.192) | 0.238 (+0.185) | |

#### primitives keys / 10,000 entries
| Operation | Map (ms) | DopeMap
V1 Legacy (ms) | DopeMap (ms) | DopeMap
{ sortKeys: true } (ms) | DopeMap
{ handleCycles: true } (ms) |
|-----------|-----------|-----------|-----------|-----------|-----------|
| Set | 0.200 | 0.334 (+0.134) | 0.754 (+0.554) | 0.699 (+0.498) | 0.691 (+0.491) | |
| Get | 0.022 | 0.245 (+0.223) | 0.520 (+0.498) | 0.492 (+0.471) | 0.484 (+0.462) | |
| Has | 0.022 | 0.059 (+0.038) | 0.252 (+0.230) | 0.233 (+0.211) | 0.233 (+0.212) | |
| Delete | 0.051 | 0.094 (+0.043) | 0.306 (+0.255) | 0.297 (+0.245) | 0.293 (+0.242) | |

#### objects keys / 100,000 entries
| Operation | Map (ms) | DopeMap
V1 Legacy (ms) | DopeMap (ms) | DopeMap
{ sortKeys: true } (ms) | DopeMap
{ handleCycles: true } (ms) |
|-----------|-----------|-----------|-----------|-----------|-----------|
| Set | 1.656 | 87.185 (+85.529) | 7.046 (+5.390) | 7.261 (+5.605) | 7.189 (+5.533) | |
| Get | 0.215 | 83.381 (+83.165) | 4.481 (+4.266) | 4.598 (+4.383) | 4.559 (+4.344) | |
| Has | 1.454 | 83.566 (+82.112) | 4.847 (+3.393) | 5.126 (+3.672) | 2.422 (+0.968) | |
| Delete | 0.607 | 72.655 (+72.048) | 2.302 (+1.695) | 2.356 (+1.749) | 2.350 (+1.743) | |

#### primitives keys / 100,000 entries
| Operation | Map (ms) | DopeMap
V1 Legacy (ms) | DopeMap (ms) | DopeMap
{ sortKeys: true } (ms) | DopeMap
{ handleCycles: true } (ms) |
|-----------|-----------|-----------|-----------|-----------|-----------|
| Set | 2.759 | 4.300 (+1.541) | 11.738 (+8.979) | 10.868 (+8.109) | 11.076 (+8.317) | |
| Get | 2.322 | 3.354 (+1.032) | 8.083 (+5.761) | 8.051 (+5.729) | 8.118 (+5.796) | |
| Has | 2.108 | 3.322 (+1.213) | 7.337 (+5.229) | 7.160 (+5.052) | 6.363 (+4.255) | |
| Delete | 0.570 | 0.897 (+0.327) | 3.671 (+3.101) | 3.654 (+3.085) | 3.846 (+3.276) | |

<!-- BENCHMARK RESULTS END -->
