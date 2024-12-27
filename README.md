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

_Each Dope/Map grows to the entry size. Averages of method time are below. All times are in milliseconds._

<!-- BENCHMARK RESULTS START -->
#### OBJECTS keys / 100 entries
| Operation | Map (ms) | DopeMap V1 (ms) | DopeMap V2 (ms) |
|-----------|-----------|-----------|-----------|
| Set | 0.0 | 0.1 (+0.1) | 0.0 (+0.0) | |
| Get | 0.0 | 0.1 (+0.1) | 0.0 (+0.0) | |
| Has | 0.0 | 0.1 (+0.1) | 0.0 (+0.0) | |
| Delete | 0.0 | 0.1 (+0.1) | 0.0 (+0.0) | |

#### PRIMITIVES keys / 100 entries
| Operation | Map (ms) | DopeMap V1 (ms) | DopeMap V2 (ms) |
|-----------|-----------|-----------|-----------|
| Set | 0.0 | 0.0 (+0.0) | 0.0 (+0.0) | |
| Get | 0.0 | 0.0 (+0.0) | 0.0 (+0.0) | |
| Has | 0.0 | 0.0 (+0.0) | 0.0 (+0.0) | |
| Delete | 0.0 | 0.0 (+0.0) | 0.0 (+0.0) | |

#### OBJECTS keys / 1,000 entries
| Operation | Map (ms) | DopeMap V1 (ms) | DopeMap V2 (ms) |
|-----------|-----------|-----------|-----------|
| Set | 0.0 | 0.7 (+0.7) | 0.0 (+0.0) | |
| Get | 0.0 | 0.7 (+0.7) | 0.0 (+0.0) | |
| Has | 0.0 | 0.7 (+0.7) | 0.0 (+0.0) | |
| Delete | 0.0 | 0.7 (+0.7) | 0.0 (+0.0) | |

#### PRIMITIVES keys / 1,000 entries
| Operation | Map (ms) | DopeMap V1 (ms) | DopeMap V2 (ms) |
|-----------|-----------|-----------|-----------|
| Set | 0.0 | 0.0 (+0.0) | 0.1 (+0.0) | |
| Get | 0.0 | 0.0 (+0.0) | 0.0 (+0.0) | |
| Has | 0.0 | 0.0 (+0.0) | 0.0 (+0.0) | |
| Delete | 0.0 | 0.0 (+0.0) | 0.0 (+0.0) | |

#### OBJECTS keys / 10,000 entries
| Operation | Map (ms) | DopeMap V1 (ms) | DopeMap V2 (ms) |
|-----------|-----------|-----------|-----------|
| Set | 0.2 | 7.5 (+7.4) | 0.6 (+0.5) | |
| Get | 0.0 | 7.3 (+7.3) | 0.4 (+0.4) | |
| Has | 0.0 | 6.8 (+6.8) | 0.2 (+0.2) | |
| Delete | 0.1 | 6.9 (+6.9) | 0.2 (+0.2) | |

#### PRIMITIVES keys / 10,000 entries
| Operation | Map (ms) | DopeMap V1 (ms) | DopeMap V2 (ms) |
|-----------|-----------|-----------|-----------|
| Set | 0.2 | 0.3 (+0.1) | 0.7 (+0.5) | |
| Get | 0.0 | 0.2 (+0.2) | 0.5 (+0.4) | |
| Has | 0.0 | 0.1 (+0.0) | 0.2 (+0.2) | |
| Delete | 0.0 | 0.1 (+0.1) | 0.3 (+0.2) | |

#### OBJECTS keys / 100,000 entries
| Operation | Map (ms) | DopeMap V1 (ms) | DopeMap V2 (ms) |
|-----------|-----------|-----------|-----------|
| Set | 1.6 | 88.3 (+86.7) | 7.1 (+5.4) | |
| Get | 0.2 | 84.6 (+84.4) | 4.5 (+4.3) | |
| Has | 1.5 | 84.0 (+82.5) | 4.8 (+3.4) | |
| Delete | 0.6 | 74.0 (+73.5) | 2.4 (+1.8) | |

#### PRIMITIVES keys / 100,000 entries
| Operation | Map (ms) | DopeMap V1 (ms) | DopeMap V2 (ms) |
|-----------|-----------|-----------|-----------|
| Set | 2.7 | 4.5 (+1.7) | 11.6 (+8.8) | |
| Get | 0.2 | 3.1 (+2.9) | 7.0 (+6.8) | |
| Has | 1.9 | 3.3 (+1.4) | 7.0 (+5.1) | |
| Delete | 0.6 | 1.0 (+0.4) | 3.6 (+3.1) | |

<!-- BENCHMARK RESULTS END -->
