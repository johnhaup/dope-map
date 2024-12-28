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

_In addition to standard Map methods_

#### Config

DopeMaps constructor accepts a second `config` argument.
| **Method** | **Type** | **Description** |
| ------------------ | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `hashFunction` | `(key: unknown) => string \| number` | Custom hashing function for non-primitive keys. |

#### Methods

| **Method**         | **Type**                                                                  | **Description**                                                                 |
| ------------------ | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `getTotalSize()`   | `() => number`                                                            | Returns the total size, including both `dopeMap` and its internal `hashKeyMap`. |
| `getMap()`         | `() => Record<string, V>`                                                 | Returns an object representation of the map in a `hashedKey: value` structure.  |
| `entries(asArray)` | `(asArray?: boolean) => [DopeKey, V][] \| IterableIterator<[DopeKey, V]>` | Returns entries as an array or iterator.                                        |
| `keys(asArray)`    | `(asArray?: boolean) => DopeKey[] \| IterableIterator<DopeKey>`           | Returns keys as an array or iterator.                                           |
| `values(asArray)`  | `(asArray?: boolean) => V[] \| IterableIterator<V>`                       | Returns values as an array or iterator.                                         |

## Benchmarks

_Each Dope/Map grows to the entry size. Averages of method time are below. All times are in milliseconds._

<!-- BENCHMARK RESULTS START -->

#### OBJECTS keys / 100 entries

| Map                   | Set            | Get            | Has            | Delete         |
| --------------------- | -------------- | -------------- | -------------- | -------------- |
| **Map**               | 0.001          | 0.0            | 0.0            | 0.0            |
| **DopeMap**           | 0.004 (+0.004) | 0.002 (+0.002) | 0.001 (+0.001) | 0.002 (+0.001) |
| **DopeMap w/hash-it** | 0.004 (+0.004) | 0.002 (+0.002) | 0.001 (+0.001) | 0.002 (+0.002) |
| **DopeMap V1**        | 0.069 (+0.068) | 0.069 (+0.069) | 0.070 (+0.070) | 0.068 (+0.067) |

#### PRIMITIVES keys / 100 entries

| Map                   | Set            | Get            | Has   | Delete |
| --------------------- | -------------- | -------------- | ----- | ------ |
| **Map**               | 0.001          | 0.0            | 0.0   | 0.0    |
| **DopeMap**           | 0.002 (+0.002) | 0.001 (+0.001) | 0.0   | 0.001  |
| **DopeMap w/hash-it** | 0.002 (+0.002) | 0.001 (+0.001) | 0.0   | 0.001  |
| **DopeMap V1**        | 0.002 (+0.001) | 0.001 (+0.001) | 0.001 | 0.001  |

#### OBJECTS keys / 1,000 entries

| Map                   | Set            | Get            | Has            | Delete         |
| --------------------- | -------------- | -------------- | -------------- | -------------- |
| **Map**               | 0.012          | 0.001          | 0.0            | 0.005          |
| **DopeMap**           | 0.045 (+0.034) | 0.028 (+0.028) | 0.017 (+0.016) | 0.020 (+0.016) |
| **DopeMap w/hash-it** | 0.052 (+0.040) | 0.033 (+0.032) | 0.017 (+0.017) | 0.024 (+0.019) |
| **DopeMap V1**        | 0.736 (+0.724) | 0.733 (+0.733) | 0.694 (+0.694) | 0.693 (+0.688) |

#### PRIMITIVES keys / 1,000 entries

| Map                   | Set            | Get            | Has            | Delete         |
| --------------------- | -------------- | -------------- | -------------- | -------------- |
| **Map**               | 0.012          | 0.001          | 0.001          | 0.005          |
| **DopeMap**           | 0.033 (+0.021) | 0.013 (+0.012) | 0.003 (+0.002) | 0.006 (+0.001) |
| **DopeMap w/hash-it** | 0.034 (+0.022) | 0.013 (+0.012) | 0.003 (+0.002) | 0.006 (+0.001) |
| **DopeMap V1**        | 0.027 (+0.014) | 0.017 (+0.016) | 0.007 (+0.007) | 0.009 (+0.005) |

#### OBJECTS keys / 10,000 entries

| Map                   | Set            | Get            | Has            | Delete         |
| --------------------- | -------------- | -------------- | -------------- | -------------- |
| **Map**               | 0.171          | 0.022          | 0.033          | 0.052          |
| **DopeMap**           | 0.599 (+0.428) | 0.464 (+0.443) | 0.193 (+0.160) | 0.256 (+0.203) |
| **DopeMap w/hash-it** | 0.639 (+0.468) | 0.507 (+0.486) | 0.193 (+0.160) | 0.292 (+0.240) |
| **DopeMap V1**        | 7.6 (+7.5)     | 7.5 (+7.5)     | 7.1 (+7.0)     | 7.0 (+7.0)     |

#### PRIMITIVES keys / 10,000 entries

| Map                   | Set            | Get            | Has            | Delete         |
| --------------------- | -------------- | -------------- | -------------- | -------------- |
| **Map**               | 0.210          | 0.022          | 0.022          | 0.051          |
| **DopeMap**           | 0.380 (+0.170) | 0.193 (+0.172) | 0.028 (+0.006) | 0.062 (+0.011) |
| **DopeMap w/hash-it** | 0.374 (+0.163) | 0.193 (+0.171) | 0.028 (+0.006) | 0.061 (+0.011) |
| **DopeMap V1**        | 0.331 (+0.121) | 0.237 (+0.215) | 0.059 (+0.036) | 0.091 (+0.040) |

#### OBJECTS keys / 100,000 entries

| Map                   | Set          | Get          | Has          | Delete       |
| --------------------- | ------------ | ------------ | ------------ | ------------ |
| **Map**               | 1.7          | 1.6          | 1.6          | 0.595        |
| **DopeMap**           | 7.0 (+5.3)   | 5.2 (+3.6)   | 5.2 (+3.6)   | 2.4 (+1.8)   |
| **DopeMap w/hash-it** | 8.2 (+6.5)   | 6.7 (+5.1)   | 6.3 (+4.7)   | 3.0 (+2.4)   |
| **DopeMap V1**        | 94.2 (+92.6) | 88.3 (+86.8) | 85.5 (+83.9) | 75.1 (+74.5) |

#### PRIMITIVES keys / 100,000 entries

| Map                   | Set        | Get          | Has          | Delete         |
| --------------------- | ---------- | ------------ | ------------ | -------------- |
| **Map**               | 2.9        | 2.3          | 2.3          | 0.604          |
| **DopeMap**           | 5.5 (+2.6) | 3.1 (+0.770) | 2.9 (+0.582) | 0.619 (+0.015) |
| **DopeMap w/hash-it** | 5.8 (+2.9) | 3.1 (+0.790) | 2.9 (+0.603) | 0.606 (+0.002) |
| **DopeMap V1**        | 4.4 (+1.6) | 3.1 (+0.759) | 0.577 (-1.7) | 0.911 (+0.307) |

<!-- BENCHMARK RESULTS END -->
