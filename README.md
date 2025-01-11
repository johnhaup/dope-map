<div align="center">
  <a href="https://youtu.be/lgErexMUTC0?si=e5aRXD95TYwhgihG">
    <img alt="dope" width=300 src="dope-badges.png">
  </a>
</div>

# dope-map

A wrapper around [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) that adds the ability to uses keys of equal but not referential value. This comes with a performance tradeoff (see [Benchmarks](#benchmarks)), so if your dataset is large take that into consideration.

Ships with a hardcoded (dep-free) implementation of [fast-json-stable-stringify](https://github.com/epoberezkin/fast-json-stable-stringify) and [xxhashjs](https://github.com/pierrec/js-xxhash) as its hashing function. You can supply a different hashing function in DopeMap's config (as long as it returns a `string` or `number`).

fafo [here](https://johnhaup.github.io/dope-map)

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
| **DopeMap w/hash-it** | 0.004 (+0.004) | 0.002 (+0.002) | 0.001 (+0.001) | 0.002 (+0.002) |
| **DopeMap V1**        | 0.070 (+0.069) | 0.069 (+0.069) | 0.069 (+0.069) | 0.069 (+0.069) |

#### 1,000 iterations

| Map                   | Set            | Get            | Has            | Delete         |
| --------------------- | -------------- | -------------- | -------------- | -------------- |
| **Map**               | 0.012          | 0.0            | 0.0            | 0.005          |
| **DopeMap**           | 0.047 (+0.036) | 0.028 (+0.027) | 0.016 (+0.016) | 0.024 (+0.019) |
| **DopeMap w/hash-it** | 0.055 (+0.043) | 0.033 (+0.033) | 0.017 (+0.016) | 0.024 (+0.019) |
| **DopeMap V1**        | 0.719 (+0.707) | 0.709 (+0.709) | 0.675 (+0.675) | 0.684 (+0.679) |

#### 10,000 iterations

| Map                   | Set            | Get            | Has            | Delete         |
| --------------------- | -------------- | -------------- | -------------- | -------------- |
| **Map**               | 0.170          | 0.022          | 0.031          | 0.052          |
| **DopeMap**           | 0.681 (+0.511) | 0.523 (+0.501) | 0.188 (+0.157) | 0.310 (+0.258) |
| **DopeMap w/hash-it** | 0.653 (+0.484) | 0.488 (+0.466) | 0.191 (+0.159) | 0.282 (+0.230) |
| **DopeMap V1**        | 7.6 (+7.4)     | 7.3 (+7.3)     | 6.9 (+6.9)     | 6.9 (+6.9)     |

#### 100,000 iterations

| Map                   | Set          | Get          | Has          | Delete       |
| --------------------- | ------------ | ------------ | ------------ | ------------ |
| **Map**               | 1.7          | 1.5          | 1.5          | 0.584        |
| **DopeMap**           | 7.3 (+5.7)   | 5.9 (+4.4)   | 5.5 (+4.0)   | 3.1 (+2.5)   |
| **DopeMap w/hash-it** | 7.9 (+6.3)   | 6.2 (+4.7)   | 5.6 (+4.1)   | 2.8 (+2.2)   |
| **DopeMap V1**        | 88.0 (+86.3) | 83.1 (+81.6) | 82.9 (+81.5) | 75.5 (+74.9) |

### PRIMITIVES keys

#### 100 iterations

| Map                   | Set            | Get            | Has | Delete |
| --------------------- | -------------- | -------------- | --- | ------ |
| **Map**               | 0.001          | 0.0            | 0.0 | 0.0    |
| **DopeMap**           | 0.002 (+0.001) | 0.001 (+0.001) | 0.0 | 0.001  |
| **DopeMap w/hash-it** | 0.002 (+0.001) | 0.001 (+0.001) | 0.0 | 0.001  |
| **DopeMap V1**        | 0.002 (+0.001) | 0.001 (+0.001) | 0.0 | 0.001  |

#### 1,000 iterations

| Map                   | Set            | Get            | Has            | Delete         |
| --------------------- | -------------- | -------------- | -------------- | -------------- |
| **Map**               | 0.012          | 0.001          | 0.001          | 0.005          |
| **DopeMap**           | 0.033 (+0.021) | 0.013 (+0.012) | 0.003 (+0.003) | 0.006 (+0.001) |
| **DopeMap w/hash-it** | 0.034 (+0.022) | 0.013 (+0.012) | 0.003 (+0.003) | 0.006 (+0.001) |
| **DopeMap V1**        | 0.027 (+0.015) | 0.017 (+0.017) | 0.007 (+0.007) | 0.009 (+0.004) |

#### 10,000 iterations

| Map                   | Set            | Get            | Has            | Delete         |
| --------------------- | -------------- | -------------- | -------------- | -------------- |
| **Map**               | 0.203          | 0.036          | 0.036          | 0.050          |
| **DopeMap**           | 0.377 (+0.174) | 0.195 (+0.159) | 0.031 (-0.006) | 0.060 (+0.010) |
| **DopeMap w/hash-it** | 0.375 (+0.172) | 0.192 (+0.156) | 0.030 (-0.006) | 0.061 (+0.011) |
| **DopeMap V1**        | 0.320 (+0.117) | 0.239 (+0.204) | 0.059 (+0.022) | 0.091 (+0.041) |

#### 100,000 iterations

| Map                   | Set        | Get          | Has          | Delete         |
| --------------------- | ---------- | ------------ | ------------ | -------------- |
| **Map**               | 2.9        | 2.1          | 2.1          | 0.562          |
| **DopeMap**           | 5.4 (+2.5) | 3.0 (+0.879) | 2.9 (+0.771) | 0.596 (+0.034) |
| **DopeMap w/hash-it** | 5.4 (+2.5) | 3.0 (+0.890) | 2.7 (+0.588) | 0.598 (+0.037) |
| **DopeMap V1**        | 4.4 (+1.5) | 3.1 (+0.947) | 0.575 (-1.5) | 0.920 (+0.358) |

<!-- BENCHMARK RESULTS END -->
