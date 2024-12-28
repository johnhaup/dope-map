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

## Benchmarks

_Each Dope/Map grows to the entry size. Averages of method time are below. All times are in milliseconds._

<!-- BENCHMARK RESULTS START -->

#### OBJECTS keys / 100 entries

| Map                   | Set            | Get            | Has            | Delete         |
| --------------------- | -------------- | -------------- | -------------- | -------------- |
| **Map**               | 0.001          | 0.0            | 0.0            | 0.0            |
| **DopeMap**           | 0.004 (+0.003) | 0.002 (+0.002) | 0.001 (+0.001) | 0.002 (+0.001) |
| **DopeMap w/hash-it** | 0.004 (+0.003) | 0.002 (+0.002) | 0.001 (+0.001) | 0.002 (+0.001) |
| **DopeMap V1**        | 0.070 (+0.069) | 0.068 (+0.068) | 0.066 (+0.066) | 0.067 (+0.067) |

#### PRIMITIVES keys / 100 entries

| Map                   | Set            | Get            | Has            | Delete         |
| --------------------- | -------------- | -------------- | -------------- | -------------- |
| **Map**               | 0.001          | 0.0            | 0.0            | 0.0            |
| **DopeMap**           | 0.004 (+0.003) | 0.002 (+0.002) | 0.001 (+0.001) | 0.002 (+0.001) |
| **DopeMap w/hash-it** | 0.004 (+0.004) | 0.002 (+0.002) | 0.001 (+0.001) | 0.002 (+0.002) |
| **DopeMap V1**        | 0.002 (+0.001) | 0.001 (+0.001) | 0.001 (+0.001) | 0.001          |

#### OBJECTS keys / 1,000 entries

| Map                   | Set            | Get            | Has            | Delete         |
| --------------------- | -------------- | -------------- | -------------- | -------------- |
| **Map**               | 0.011          | 0.0            | 0.001          | 0.005          |
| **DopeMap**           | 0.047 (+0.036) | 0.027 (+0.026) | 0.016 (+0.015) | 0.019 (+0.015) |
| **DopeMap w/hash-it** | 0.050 (+0.039) | 0.033 (+0.032) | 0.017 (+0.016) | 0.024 (+0.020) |
| **DopeMap V1**        | 0.701 (+0.690) | 0.710 (+0.710) | 0.669 (+0.668) | 0.674 (+0.670) |

#### PRIMITIVES keys / 1,000 entries

| Map                   | Set            | Get            | Has            | Delete         |
| --------------------- | -------------- | -------------- | -------------- | -------------- |
| **Map**               | 0.012          | 0.001          | 0.001          | 0.005          |
| **DopeMap**           | 0.056 (+0.044) | 0.035 (+0.034) | 0.017 (+0.016) | 0.026 (+0.021) |
| **DopeMap w/hash-it** | 0.062 (+0.050) | 0.036 (+0.035) | 0.017 (+0.016) | 0.032 (+0.027) |
| **DopeMap V1**        | 0.028 (+0.016) | 0.019 (+0.018) | 0.009 (+0.008) | 0.011 (+0.006) |

#### OBJECTS keys / 10,000 entries

| Map                   | Set            | Get            | Has            | Delete         |
| --------------------- | -------------- | -------------- | -------------- | -------------- |
| **Map**               | 0.168          | 0.021          | 0.031          | 0.053          |
| **DopeMap**           | 0.590 (+0.421) | 0.441 (+0.419) | 0.186 (+0.155) | 0.235 (+0.182) |
| **DopeMap w/hash-it** | 0.623 (+0.455) | 0.483 (+0.462) | 0.186 (+0.155) | 0.281 (+0.228) |
| **DopeMap V1**        | 7.4 (+7.3)     | 7.2 (+7.2)     | 6.8 (+6.8)     | 6.9 (+6.8)     |

#### PRIMITIVES keys / 10,000 entries

| Map                   | Set            | Get            | Has            | Delete         |
| --------------------- | -------------- | -------------- | -------------- | -------------- |
| **Map**               | 0.198          | 0.021          | 0.021          | 0.049          |
| **DopeMap**           | 0.670 (+0.472) | 0.474 (+0.453) | 0.234 (+0.212) | 0.289 (+0.240) |
| **DopeMap w/hash-it** | 0.696 (+0.497) | 0.513 (+0.491) | 0.235 (+0.214) | 0.332 (+0.283) |
| **DopeMap V1**        | 0.328 (+0.130) | 0.245 (+0.224) | 0.071 (+0.050) | 0.102 (+0.052) |

#### OBJECTS keys / 100,000 entries

| Map                   | Set          | Get          | Has          | Delete       |
| --------------------- | ------------ | ------------ | ------------ | ------------ |
| **Map**               | 1.6          | 1.5          | 1.5          | 0.579        |
| **DopeMap**           | 6.7 (+5.1)   | 5.0 (+3.5)   | 4.6 (+3.1)   | 2.2 (+1.7)   |
| **DopeMap w/hash-it** | 7.2 (+5.6)   | 5.7 (+4.2)   | 5.2 (+3.7)   | 2.7 (+2.1)   |
| **DopeMap V1**        | 84.6 (+82.9) | 82.5 (+81.0) | 82.2 (+80.7) | 72.1 (+71.5) |

#### PRIMITIVES keys / 100,000 entries

| Map                   | Set         | Get        | Has            | Delete       |
| --------------------- | ----------- | ---------- | -------------- | ------------ |
| **Map**               | 2.7         | 0.675      | 0.833          | 0.520        |
| **DopeMap**           | 10.5 (+7.7) | 7.9 (+7.2) | 3.1 (+2.2)     | 3.7 (+3.2)   |
| **DopeMap w/hash-it** | 10.6 (+7.9) | 7.6 (+6.9) | 3.2 (+2.4)     | 4.1 (+3.6)   |
| **DopeMap V1**        | 4.5 (+1.8)  | 3.1 (+2.5) | 0.708 (-0.125) | 1.0 (+0.506) |

<!-- BENCHMARK RESULTS END -->
