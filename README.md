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
2. Add `config` option to retain original keys
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

The following table summarizes the **methods** and **properties** of `DopeMap`, along with their functionality. If a method behaves identically to JavaScript's native `Map`, it's marked ✅. If it has custom behavior, it's marked ❌.
_Note that all DopeMap methods currently returns keys as their hashed value. Original key return option is upcoming._

## DopeMap API Reference

The following table summarizes the **methods** and **properties** of `DopeMap`, along with their functionality. If a method behaves identically to JavaScript's native `Map`, it's marked **✅**. If it extends `Map` functionality, it's marked **✅ + Extra**.
_Note that all DopeMap methods currently return the hashed version of its keys. Support for an original value key option is upcoming!_

| **Method/Property**                                                                       | **Type**      | **Description**                                                          | **Same as Map?**                 |
| ----------------------------------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------ | -------------------------------- |
| **`constructor(config?: DopeMapConfig)`**                                                 | `constructor` | Initializes a new `DopeMap`. Optionally accepts a custom `hashFunction`. | ✅ + Extra (`hashFunction`)      |
| **`set(key: DopeKey, value: V): void`**                                                   | `method`      | Sets a value for the given key.                                          | ✅ Same as `Map.set()`           |
| **`get(key: DopeKey): V \| undefined`**                                                   | `method`      | Retrieves a value by its key.                                            | ✅ Same as `Map.get()`           |
| **`has(key: DopeKey): boolean`**                                                          | `method`      | Checks if a key exists in the map.                                       | ✅ Same as `Map.has()`           |
| **`delete(key: DopeKey): boolean`**                                                       | `method`      | Deletes a key-value pair from the map.                                   | ✅ Same as `Map.delete()`        |
| **`clear(): void`**                                                                       | `method`      | Removes all key-value pairs from the map.                                | ✅ Same as `Map.clear()`         |
| **`get size(): number`**                                                                  | `property`    | Returns the number of entries in the map.                                | ✅ Same as `Map.size`            |
| **`getMap(): Record<HashedKey, V>`**                                                      | `method`      | Returns all entries as a plain object with hashed keys.                  | ✅ + Extra (Plain Object Output) |
| **`entries(asArray: true): [HashedKey, V][]`**                                            | `method`      | Returns all entries as an array of `[key, value]` pairs.                 | ✅ + Extra (Array Support)       |
| **`entries(asArray?: false): IterableIterator<[HashedKey, V]>`**                          | `method`      | Returns an iterator of `[key, value]` pairs.                             | ✅ Same as `Map.entries()`       |
| **`forEach(callback: (value: V, key: HashedKey, map: Map<HashedKey, V>) => void): void`** | `method`      | Executes a callback for each key-value pair.                             | ✅ Same as `Map.forEach()`       |
| **`keys(asArray: true): HashedKey[]`**                                                    | `method`      | Returns an array of keys.                                                | ✅ + Extra (Array Support)       |
| **`keys(asArray?: false): IterableIterator<HashedKey>`**                                  | `method`      | Returns an iterator of keys.                                             | ✅ Same as `Map.keys()`          |
| **`values(asArray: true): V[]`**                                                          | `method`      | Returns an array of values.                                              | ✅ + Extra (Array Support)       |
| **`values(asArray?: false): IterableIterator<V>`**                                        | `method`      | Returns an iterator of values.                                           | ✅ Same as `Map.values()`        |

## Benchmarks

_Each Dope/Map grows to the entry size. Averages of method time are below._

<!-- BENCHMARK RESULTS START -->

#### Results for 100 entries

| Operation | Map (ms) | DopeMap (ms) | Difference (ms) |
| --------- | -------- | ------------ | --------------- |
| Set       | 0.001    | 0.072        | 0.071           |
| Get       | 0.000    | 0.072        | 0.072           |
| Delete    | 0.000    | 0.070        | 0.070           |

#### Results for 1,000 entries

| Operation | Map (ms) | DopeMap (ms) | Difference (ms) |
| --------- | -------- | ------------ | --------------- |
| Set       | 0.010    | 0.733        | 0.723           |
| Get       | 0.000    | 0.705        | 0.705           |
| Delete    | 0.005    | 0.718        | 0.713           |

#### Results for 10,000 entries

| Operation | Map (ms) | DopeMap (ms) | Difference (ms) |
| --------- | -------- | ------------ | --------------- |
| Set       | 0.163    | 7.741        | 7.578           |
| Get       | 0.008    | 7.324        | 7.316           |
| Delete    | 0.053    | 7.663        | 7.610           |

#### Results for 100,000 entries

| Operation | Map (ms) | DopeMap (ms) | Difference (ms) |
| --------- | -------- | ------------ | --------------- |
| Set       | 1.852    | 96.536       | 94.684          |
| Get       | 0.406    | 92.808       | 92.402          |
| Delete    | 0.552    | 78.975       | 78.423          |

<!-- BENCHMARK RESULTS END -->
