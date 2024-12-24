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
| Set       | 0.001    | 0.074        | 0.073           |
| Get       | 0.000    | 0.074        | 0.074           |
| Delete    | 0.000    | 0.072        | 0.071           |

#### Results for 1,000 entries

| Operation | Map (ms) | DopeMap (ms) | Difference (ms) |
| --------- | -------- | ------------ | --------------- |
| Set       | 0.010    | 0.743        | 0.734           |
| Get       | 0.000    | 0.789        | 0.789           |
| Delete    | 0.005    | 0.718        | 0.713           |

#### Results for 10,000 entries

| Operation | Map (ms) | DopeMap (ms) | Difference (ms) |
| --------- | -------- | ------------ | --------------- |
| Set       | 0.165    | 7.916        | 7.751           |
| Get       | 0.007    | 7.692        | 7.684           |
| Delete    | 0.054    | 7.313        | 7.259           |

#### Results for 100,000 entries

| Operation | Map (ms) | DopeMap (ms) | Difference (ms) |
| --------- | -------- | ------------ | --------------- |
| Set       | 1.686    | 96.664       | 94.978          |
| Get       | 0.323    | 96.374       | 96.052          |
| Delete    | 0.565    | 79.796       | 79.231          |

<!-- BENCHMARK RESULTS END -->
