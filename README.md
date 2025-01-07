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
import { DopeMap } from "@johnhaup/dope-map";

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

## API Reference

_In addition to standard Map methods_

#### Config

DopeMaps constructor accepts a second `config` argument.

```javascript
import { DopeMap } from "@johnhaup/dope-map";
import hashIt from "hash-it";

const dopeMap = new DopeMap(null, { hashFunction: hashIt });
```

| Property       | Type                                 | Description                                     |
| -------------- | ------------------------------------ | ----------------------------------------------- |
| `hashFunction` | `(key: unknown) => string \| number` | Custom hashing function for non-primitive keys. |

#### Methods

| Method       | Return Value                                     |
| ------------ | ------------------------------------------------ |
| `getEntries` | Array of `[key, value]` tuples in order of entry |
| `getKeys`    | Array of keys in order of entry                  |
| `getValues`  | Array of values in order of entry                |

## Benchmarks

_Each Dope/Map grows to the iteration size. Averages of method time are below. All times are in milliseconds._

<!-- BENCHMARK RESULTS START -->

### OBJECTS keys

#### 100 iterations

| Map                   | Set            | Get            | Has            | Delete         |
| --------------------- | -------------- | -------------- | -------------- | -------------- |
| **Map**               | 0.001          | 0.0            | 0.0            | 0.0            |
| **DopeMap**           | 0.004 (+0.003) | 0.002 (+0.002) | 0.001 (+0.001) | 0.002 (+0.001) |
| **DopeMap w/hash-it** | 0.004 (+0.003) | 0.002 (+0.002) | 0.001 (+0.001) | 0.002 (+0.002) |
| **DopeMap V1**        | 0.071 (+0.070) | 0.070 (+0.070) | 0.067 (+0.067) | 0.068 (+0.068) |

#### 1,000 iterations

| Map                   | Set            | Get            | Has            | Delete         |
| --------------------- | -------------- | -------------- | -------------- | -------------- |
| **Map**               | 0.011          | 0.0            | 0.001          | 0.005          |
| **DopeMap**           | 0.050 (+0.039) | 0.028 (+0.027) | 0.016 (+0.015) | 0.019 (+0.015) |
| **DopeMap w/hash-it** | 0.053 (+0.042) | 0.033 (+0.033) | 0.017 (+0.016) | 0.024 (+0.019) |
| **DopeMap V1**        | 0.728 (+0.717) | 0.712 (+0.711) | 0.703 (+0.703) | 0.714 (+0.709) |

#### 10,000 iterations

| Map                   | Set            | Get            | Has            | Delete         |
| --------------------- | -------------- | -------------- | -------------- | -------------- |
| **Map**               | 0.173          | 0.022          | 0.033          | 0.053          |
| **DopeMap**           | 0.658 (+0.485) | 0.465 (+0.443) | 0.192 (+0.158) | 0.241 (+0.189) |
| **DopeMap w/hash-it** | 0.640 (+0.467) | 0.487 (+0.465) | 0.192 (+0.158) | 0.286 (+0.233) |
| **DopeMap V1**        | 7.6 (+7.4)     | 7.4 (+7.4)     | 6.9 (+6.9)     | 7.0 (+7.0)     |

#### 100,000 iterations

| Map                   | Set          | Get          | Has          | Delete       |
| --------------------- | ------------ | ------------ | ------------ | ------------ |
| **Map**               | 1.7          | 1.5          | 1.4          | 0.587        |
| **DopeMap**           | 7.0 (+5.3)   | 5.2 (+3.7)   | 4.7 (+3.3)   | 2.4 (+1.8)   |
| **DopeMap w/hash-it** | 8.0 (+6.3)   | 6.9 (+5.3)   | 5.3 (+3.9)   | 2.7 (+2.1)   |
| **DopeMap V1**        | 89.6 (+87.9) | 84.2 (+82.7) | 83.1 (+81.7) | 73.4 (+72.8) |

### PRIMITIVES keys

#### 100 iterations

| Map                   | Set            | Get            | Has            | Delete |
| --------------------- | -------------- | -------------- | -------------- | ------ |
| **Map**               | 0.001          | 0.0            | 0.0            | 0.0    |
| **DopeMap**           | 0.002 (+0.002) | 0.001 (+0.001) | 0.0            | 0.001  |
| **DopeMap w/hash-it** | 0.002 (+0.002) | 0.001 (+0.001) | 0.0            | 0.001  |
| **DopeMap V1**        | 0.002 (+0.001) | 0.001 (+0.001) | 0.001 (+0.001) | 0.001  |

#### 1,000 iterations

| Map                   | Set            | Get            | Has            | Delete         |
| --------------------- | -------------- | -------------- | -------------- | -------------- |
| **Map**               | 0.012          | 0.001          | 0.001          | 0.005          |
| **DopeMap**           | 0.032 (+0.021) | 0.013 (+0.012) | 0.003 (+0.003) | 0.006 (+0.001) |
| **DopeMap w/hash-it** | 0.033 (+0.021) | 0.013 (+0.012) | 0.003 (+0.003) | 0.006 (+0.001) |
| **DopeMap V1**        | 0.030 (+0.018) | 0.020 (+0.019) | 0.009 (+0.008) | 0.011 (+0.006) |

#### 10,000 iterations

| Map                   | Set            | Get            | Has            | Delete         |
| --------------------- | -------------- | -------------- | -------------- | -------------- |
| **Map**               | 0.204          | 0.022          | 0.022          | 0.051          |
| **DopeMap**           | 0.378 (+0.174) | 0.195 (+0.173) | 0.028 (+0.006) | 0.059 (+0.008) |
| **DopeMap w/hash-it** | 0.378 (+0.174) | 0.194 (+0.173) | 0.029 (+0.007) | 0.061 (+0.010) |
| **DopeMap V1**        | 0.334 (+0.130) | 0.251 (+0.229) | 0.071 (+0.049) | 0.102 (+0.051) |

#### 100,000 iterations

| Map                   | Set        | Get        | Has          | Delete         |
| --------------------- | ---------- | ---------- | ------------ | -------------- |
| **Map**               | 2.7        | 1.0        | 1.0          | 0.560          |
| **DopeMap**           | 5.4 (+2.7) | 3.1 (+2.0) | 2.9 (+1.9)   | 0.609 (+0.049) |
| **DopeMap w/hash-it** | 5.7 (+2.9) | 3.1 (+2.1) | 3.0 (+2.0)   | 0.612 (+0.052) |
| **DopeMap V1**        | 4.5 (+1.8) | 3.4 (+2.3) | 1.8 (+0.777) | 1.1 (+0.504)   |

<!-- BENCHMARK RESULTS END -->
