<div align="center">
  <a href="https://youtu.be/lgErexMUTC0?si=e5aRXD95TYwhgihG">
    <img alt="dope" width=300 src="dope-badges.png">
  </a>
</div>

# dope-map

A wrapper around [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) that adds the ability to uses keys of equal but not referential value. This comes with a performance tradeoff (see [Benchmarks](#benchmarks)), so if your dataset is large take that into consideration.

Ships with a hardcoded (dep-free) implementation of [fast-json-stable-stringify](https://github.com/epoberezkin/fast-json-stable-stringify) and [xxhashjs](https://github.com/pierrec/js-xxhash) as its hashing function. You can supply a different hashing function in DopeMap's config (as long as it returns a `string` or `number`).

#### RoadMap 🚧

1. Enhance interactive demo site (check out the wip [here](https://johnhaup.github.io/dope-map))
2. Native hash for node

## Installation

```bash
yarn add @johnhaup/dope-map
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
import hashIt from "hash-it";

const dopeMap = new DopeMap(null, { hashFunction: hashIt });
```

## API Reference

| **Method/Property** | **Type**                                                  | **Description**                                           | **Parameters**                                                                | **Returns**                         |
| ------------------- | --------------------------------------------------------- | --------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------- | ----------------------------------------------------------------------------- | ------------ |
| **constructor**     | `(entries?: Iterable<[DopeKey, V]>                        | null, config?: DopeMapConfig)`                            | Initializes a new `DopeMap` instance with optional entries and configuration. | `entries` \*(Iterable<[DopeKey, V]> | null)_: Initial entries, `config` _(DopeMapConfig)\*: Optional configuration. | `DopeMap<V>` |
| **set**             | `(k: DopeKey, v: V)`                                      | Adds or updates an entry in the map.                      | `k` _(DopeKey)_: Key, `v` _(V)_: Value.                                       | `Map<HashedKey, MapEntry<V>>`       |
| **get**             | `(k: DopeKey)`                                            | Retrieves a value by its key.                             | `k` _(DopeKey)_: Key to look up.                                              | `V                                  | undefined`                                                                    |
| **has**             | `(k: DopeKey)`                                            | Checks if a key exists in the map.                        | `k` _(DopeKey)_: Key to check.                                                | `boolean`                           |
| **delete**          | `(k: DopeKey)`                                            | Removes an entry from the map.                            | `k` _(DopeKey)_: Key to remove.                                               | `boolean`                           |
| **clear**           | `()`                                                      | Clears all entries from the map.                          | -                                                                             | `void`                              |
| **size**            | `number`                                                  | Number of entries in the map.                             | -                                                                             | `number`                            |
| **getTotalSize**    | `()`                                                      | Returns the total size, including internal hash mappings. | -                                                                             | `number`                            |
| **getMap**          | `()`                                                      | Returns internal entries as an object.                    | -                                                                             | `Record<string, MapEntry<V>>`       |
| **entries**         | `(asArray: true)`                                         | Returns entries as an array.                              | `asArray` _(boolean)_: Return as array.                                       | `[DopeKey, V][]`                    |
| **entries**         | `(asArray?: false)`                                       | Returns entries as an iterator.                           | `asArray` _(boolean)_: Return as iterator.                                    | `IterableIterator<[DopeKey, V]>`    |
| **forEach**         | `(callback: (value: V, key: DopeKey, map: this) => void)` | Executes a callback for each entry.                       | `callback` _(function)_: Callback function.                                   | `void`                              |
| **keys**            | `(asArray: true)`                                         | Returns keys as an array.                                 | `asArray` _(boolean)_: Return as array.                                       | `DopeKey[]`                         |
| **keys**            | `(asArray?: false)`                                       | Returns keys as an iterator.                              | `asArray` _(boolean)_: Return as iterator.                                    | `IterableIterator<DopeKey>`         |
| **values**          | `(asArray: true)`                                         | Returns values as an array.                               | `asArray` _(boolean)_: Return as array.                                       | `V[]`                               |
| **values**          | `(asArray?: false)`                                       | Returns values as an iterator.                            | `asArray` _(boolean)_: Return as iterator.                                    | `IterableIterator<V>`               |

## Benchmarks

_Each Dope/Map grows to the entry size. Averages of method time are below. All times are in milliseconds._

<!-- BENCHMARK RESULTS START -->

#### OBJECTS keys / 100 entries

| Operation | Map   | DopeMap V1     | DopeMap        | DopeMap w/hash-it |
| --------- | ----- | -------------- | -------------- | ----------------- | --- |
| Set       | 0.001 | 0.069 (+0.068) | 0.004 (+0.003) | 0.004 (+0.003)    |     |
| Get       | 0.000 | 0.071 (+0.071) | 0.002 (+0.002) | 0.002 (+0.002)    |     |
| Has       | 0.000 | 0.066 (+0.066) | 0.001 (+0.001) | 0.001 (+0.001)    |     |
| Delete    | 0.000 | 0.067 (+0.067) | 0.002 (+0.001) | 0.002 (+0.002)    |     |

#### PRIMITIVES keys / 100 entries

| Operation | Map   | DopeMap V1     | DopeMap        | DopeMap w/hash-it |
| --------- | ----- | -------------- | -------------- | ----------------- | --- |
| Set       | 0.001 | 0.002 (+0.001) | 0.004 (+0.003) | 0.004 (+0.004)    |     |
| Get       | 0.000 | 0.001 (+0.001) | 0.002 (+0.002) | 0.002 (+0.002)    |     |
| Has       | 0.000 | 0.001 (+0.000) | 0.001 (+0.001) | 0.001 (+0.001)    |     |
| Delete    | 0.000 | 0.001 (+0.000) | 0.002 (+0.001) | 0.002 (+0.002)    |     |

#### OBJECTS keys / 1,000 entries

| Operation | Map   | DopeMap V1     | DopeMap        | DopeMap w/hash-it |
| --------- | ----- | -------------- | -------------- | ----------------- | --- |
| Set       | 0.011 | 0.719 (+0.708) | 0.050 (+0.039) | 0.051 (+0.039)    |     |
| Get       | 0.000 | 0.708 (+0.707) | 0.029 (+0.028) | 0.032 (+0.032)    |     |
| Has       | 0.001 | 0.680 (+0.680) | 0.016 (+0.015) | 0.017 (+0.017)    |     |
| Delete    | 0.005 | 0.686 (+0.681) | 0.020 (+0.015) | 0.024 (+0.019)    |     |

#### PRIMITIVES keys / 1,000 entries

| Operation | Map   | DopeMap V1     | DopeMap        | DopeMap w/hash-it |
| --------- | ----- | -------------- | -------------- | ----------------- | --- |
| Set       | 0.012 | 0.028 (+0.015) | 0.056 (+0.044) | 0.063 (+0.051)    |     |
| Get       | 0.001 | 0.018 (+0.017) | 0.034 (+0.033) | 0.036 (+0.035)    |     |
| Has       | 0.001 | 0.007 (+0.006) | 0.017 (+0.016) | 0.016 (+0.016)    |     |
| Delete    | 0.005 | 0.009 (+0.004) | 0.025 (+0.020) | 0.031 (+0.026)    |     |

#### OBJECTS keys / 10,000 entries

| Operation | Map   | DopeMap V1 | DopeMap        | DopeMap w/hash-it |
| --------- | ----- | ---------- | -------------- | ----------------- | --- |
| Set       | 0.172 | 7.7 (+7.5) | 0.639 (+0.467) | 0.634 (+0.461)    |     |
| Get       | 0.022 | 7.4 (+7.3) | 0.458 (+0.437) | 0.481 (+0.459)    |     |
| Has       | 0.032 | 7.0 (+6.9) | 0.189 (+0.157) | 0.190 (+0.158)    |     |
| Delete    | 0.053 | 7.0 (+7.0) | 0.242 (+0.190) | 0.284 (+0.231)    |     |

#### PRIMITIVES keys / 10,000 entries

| Operation | Map   | DopeMap V1     | DopeMap        | DopeMap w/hash-it |
| --------- | ----- | -------------- | -------------- | ----------------- | --- |
| Set       | 0.201 | 0.321 (+0.119) | 0.684 (+0.483) | 0.704 (+0.503)    |     |
| Get       | 0.022 | 0.244 (+0.222) | 0.485 (+0.463) | 0.522 (+0.500)    |     |
| Has       | 0.035 | 0.056 (+0.021) | 0.236 (+0.201) | 0.235 (+0.200)    |     |
| Delete    | 0.050 | 0.088 (+0.038) | 0.288 (+0.238) | 0.331 (+0.281)    |     |

#### OBJECTS keys / 100,000 entries

| Operation | Map   | DopeMap V1   | DopeMap    | DopeMap w/hash-it |
| --------- | ----- | ------------ | ---------- | ----------------- | --- |
| Set       | 2.2   | 86.6 (+84.5) | 7.6 (+5.4) | 8.4 (+6.2)        |     |
| Get       | 1.7   | 85.8 (+84.2) | 5.2 (+3.6) | 6.1 (+4.5)        |     |
| Has       | 1.4   | 83.2 (+81.8) | 4.9 (+3.5) | 5.5 (+4.0)        |     |
| Delete    | 0.586 | 72.9 (+72.3) | 2.3 (+1.7) | 2.7 (+2.1)        |     |

#### PRIMITIVES keys / 100,000 entries

| Operation | Map   | DopeMap V1     | DopeMap     | DopeMap w/hash-it |
| --------- | ----- | -------------- | ----------- | ----------------- | --- |
| Set       | 3.2   | 4.7 (+1.5)     | 10.7 (+7.5) | 10.6 (+7.4)       |     |
| Get       | 2.6   | 3.3 (+0.705)   | 7.7 (+5.1)  | 7.8 (+5.2)        |     |
| Has       | 2.5   | 3.1 (+0.671)   | 7.0 (+4.5)  | 7.2 (+4.8)        |     |
| Delete    | 0.567 | 0.879 (+0.312) | 3.6 (+3.0)  | 4.0 (+3.5)        |     |

<!-- BENCHMARK RESULTS END -->
