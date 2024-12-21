<div align="center">
  <a href="https://youtu.be/lgErexMUTC0?si=e5aRXD95TYwhgihG">
    <img alt="dope" width=300 src="dope-badges.png">
  </a>
</div>

# dope-map

A wrapper around [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) that adds the ability to uses keys of equal but not referential value. This comes with a performance tradeoff (see [Benchmarks](#benchmarks)), so if your dataset is large take that into consideration.

Defaults to using [hash-it](https://github.com/planttheidea/hash-it) for its key hashing function. You can supply a different hashing function in DopeMap's config (as long as it returns a `string` or `number`).

## Installation

```bash
yarn add dope-map hash-it
```

## Usage

```javascript
import DopeMap from "dope-map";

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
import DopeMap from "dope-map";
import blazeHasher from "blazing-fast-hash-package";

const dopeMap = new DopeMap({ hashFunction: blazeHasher });
```

## Benchmarks

<!-- BENCHMARK RESULTS START -->

#### Results for 100 entries

| Operation | Map (ms) | DopeMap (ms) | Difference (ms) |
| --------- | -------- | ------------ | --------------- |
| Set       | 0.001    | 0.071        | 0.070           |
| Get       | 0.000    | 0.069        | 0.069           |
| Delete    | 0.000    | 0.070        | 0.069           |

#### Results for 1,000 entries

| Operation | Map (ms) | DopeMap (ms) | Difference (ms) |
| --------- | -------- | ------------ | --------------- |
| Set       | 0.009    | 0.729        | 0.720           |
| Get       | 0.000    | 0.699        | 0.699           |
| Delete    | 0.005    | 0.704        | 0.699           |

#### Results for 10,000 entries

| Operation | Map (ms) | DopeMap (ms) | Difference (ms) |
| --------- | -------- | ------------ | --------------- |
| Set       | 0.164    | 7.514        | 7.350           |
| Get       | 0.007    | 7.218        | 7.210           |
| Delete    | 0.053    | 7.314        | 7.261           |

#### Results for 100,000 entries

| Operation | Map (ms) | DopeMap (ms) | Difference (ms) |
| --------- | -------- | ------------ | --------------- |
| Set       | 1.762    | 94.037       | 92.274          |
| Get       | 0.369    | 88.134       | 87.765          |
| Delete    | 0.656    | 80.199       | 79.543          |

<!-- BENCHMARK RESULTS END -->
