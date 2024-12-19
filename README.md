<div align="center">
  <a href="https://www.youtube.com/watch?v=3jqTqrGtGjg">
    <img alt="dope" width=300 src="dope.jpg">
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

dopeMap.set({ foo: "bar", to: "fu" }, [1, 2, 3, 4, 5]);

dopeMap.get({ foo: "bar", to: "fu" }); // [1, 2, 3, 4, 5]
dopeMap.get({ to: "fu", foo: "bar" }); // [1, 2, 3, 4, 5], same reference
```

```javascript
import DopeMap from "dope-map";
import blazeHasher from "blazing-fast-hash-package";

const dopeMap = new DopeMap({ hashFunction: blazeHasher });
```

## Benchmarks

<!-- BENCHMARK RESULTS START -->
#### Results for 100 entries
| Operation |  Map (ms) | DopeMap (ms) | Difference (ms) |
|-----------|-----------------|--------------|-----------------|
| Set       | 0.001      | 0.083     | 0.083          |
| Get       | 0.000      | 0.070     | 0.070          |
| Delete    | 0.000      | 0.076     | 0.076          |

#### Results for 1,000 entries
| Operation |  Map (ms) | DopeMap (ms) | Difference (ms) |
|-----------|-----------------|--------------|-----------------|
| Set       | 0.009      | 0.862     | 0.853          |
| Get       | 0.000      | 0.737     | 0.736          |
| Delete    | 0.005      | 0.784     | 0.779          |

#### Results for 10,000 entries
| Operation |  Map (ms) | DopeMap (ms) | Difference (ms) |
|-----------|-----------------|--------------|-----------------|
| Set       | 0.163      | 9.754     | 9.591          |
| Get       | 0.007      | 9.503     | 9.495          |
| Delete    | 0.052      | 8.681     | 8.629          |

#### Results for 100,000 entries
| Operation |  Map (ms) | DopeMap (ms) | Difference (ms) |
|-----------|-----------------|--------------|-----------------|
| Set       | 1.728      | 112.848     | 111.120          |
| Get       | 0.361      | 112.191     | 111.830          |
| Delete    | 0.602      | 95.297     | 94.695          |

<!-- BENCHMARK RESULTS END -->
