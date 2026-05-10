<div align="center">
  <a href="https://youtu.be/lgErexMUTC0?si=e5aRXD95TYwhgihG">
    <img alt="dope" width=300 src="dope-badges.png">
  </a>
</div>

# dope-map

A wrapper around [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) that uses structural equality for key matching instead of the [SameValueZero algorithm](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map#key_equality). This means that (for example) objects of equal but not referential value will point to the same `DopeMap` entry. This can come with a slight performance tradeoff (see [Benchmarks](#benchmarks)), so if your dataset is very large take that into consideration.

Ships with a hardcoded (dep-free) implementation of [fast-json-stable-stringify](https://github.com/epoberezkin/fast-json-stable-stringify) and [xxhashjs](https://github.com/pierrec/js-xxhash) as its hashing function. You can supply a different hashing function in DopeMap's config (as long as it returns a `string` or `number`).

fafo [here](https://johnhaup.github.io/dope-map)

## Installation

```bash
yarn add @johnhaup/dope-map
```

## Comparison

<div>
    <img alt="dope" height=400 src="dope_demo.png">
    <img alt="dope" height=400 src="map_demo.png">
</div>

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

### Typescript

`DopeMap's` generics are flipped from traditional `Map`:

```typescript
DopeMap<Value, Key = unknown> // Map<Key = any, Value = any>
```

Key is optional so you can just type the value and go crazy with the keys you pass.

## Examples

#### API Cache

```javascript
import { DopeMap } from "@johnhaup/dope-map";

const apiCache = new DopeMap();

const filters = {
  category: "electronics",
  priceRange: [100, 500],
  tags: ["sale"],
};

async function fetchProducts(query) {
  if (apiCache.has(query)) {
    console.log("Cache hit");
    return apiCache.get(query);
  }

  console.log("Cache miss");
  const response = await fetch(`/api/products?${new URLSearchParams(query)}`);
  const data = await response.json();

  apiCache.set(query, data);
  return data;
}

await fetchProducts(filters);
await fetchProducts({
  priceRange: [100, 500],
  category: "electronics",
  tags: ["sale"],
}); // <- Cache hit
```

#### Product Lookup

```typescript
import { DopeMap } from "@johnhaup/dope-map";

type ProductAttributes = {
  color: string;
  size: string;
  material: string;
};

type Product = {
  id: string;
  price: number;
  promoPrice: number | null;
  title: string;
};

const initialEntries: [ProductAttributes, Product][] = [
  [
    { color: "blue", size: "sm", material: "cotton" },
    { id: "13nl54l", title: "Cool Blue", price: 24.99, promoPrice: null },
  ],
  [
    { color: "blue", size: "xs", material: "cotton" },
    { id: "909sadfj", title: "Cool Blue", price: 19.99, promoPrice: 9.99 },
  ],
];

const productMap = new DopeMap<Product>(initialEntries);

interface Props {
  filters: Partial<ProductAttributes>;
}

function SelectedProduct({ filters }: Props) {
  const product = useMemo(() => {
    return productMap.get(filters);
  }, [filters]);

  if (!product) {
    return null;
  }

  return (
    <div>
      <p>{product.title}</p>
      <p>{product.price}</p>
      <p>{product.promoPrice}</p>
    </div>
  );
}
```

## Benchmarks

_Each Dope/Map grows to the iteration size. Averages of method time are below. All times are in milliseconds._

<!-- BENCHMARK RESULTS START -->
### OBJECTS keys
#### 100 entries
| Map | Set | Get | Has | Delete | Clear |
|-----------|-----------|-----------|-----------|-----------|----------- |
| **Map** | 0.002 | 0.001 | 0.001 | 0.003 | 0.002 |
| **DopeMap** | 0.073 (+0.071) | 0.003 (+0.002) | 0.002 (+0.002) | 0.077 (+0.073) | 0.074 (+0.072) |
| **DopeMap w/hash-it** | 0.059 (+0.057) | 0.003 (+0.003) | 0.002 (+0.002) | 0.062 (+0.059) | 0.062 (+0.060) |

#### 1,000 entries
| Map | Set | Get | Has | Delete | Clear |
|-----------|-----------|-----------|-----------|-----------|----------- |
| **Map** | 0.020 | 0.007 | 0.007 | 0.034 | 0.019 |
| **DopeMap** | 0.764 (+0.744) | 0.036 (+0.029) | 0.021 (+0.014) | 0.828 (+0.794) | 0.771 (+0.751) |
| **DopeMap w/hash-it** | 0.594 (+0.574) | 0.042 (+0.035) | 0.021 (+0.015) | 0.639 (+0.605) | 0.595 (+0.576) |

#### 10,000 entries
| Map | Set | Get | Has | Delete | Clear |
|-----------|-----------|-----------|-----------|-----------|----------- |
| **Map** | 0.268 | 0.055 | 0.055 | 0.500 | 0.265 |
| **DopeMap** | 8.0 (+7.7) | 0.616 (+0.561) | 0.252 (+0.197) | 8.8 (+8.3) | 8.0 (+7.7) |
| **DopeMap w/hash-it** | 6.1 (+5.8) | 0.599 (+0.543) | 0.250 (+0.195) | 6.9 (+6.4) | 6.1 (+5.9) |

#### 100,000 entries
| Map | Set | Get | Has | Delete | Clear |
|-----------|-----------|-----------|-----------|-----------|----------- |
| **Map** | 4.0 | 0.550 | 0.541 | 7.2 | 4.0 |
| **DopeMap** | 95.5 (+91.5) | 6.5 (+6.0) | 2.4 (+1.9) | 104.7 (+97.6) | 95.3 (+91.3) |
| **DopeMap w/hash-it** | 77.6 (+73.6) | 7.4 (+6.9) | 2.4 (+1.9) | 94.1 (+87.0) | 1010.7 (+1006.7) |

### PRIMITIVES keys
#### 100 entries
| Map | Set | Get | Has | Delete | Clear |
|-----------|-----------|-----------|-----------|-----------|----------- |
| **Map** | 0.002 | 0.001 | 0.001 | 0.003 | 0.002 |
| **DopeMap** | 0.002 | 0.001 (+0.001) | 0.001 | 0.004 | 0.002 |
| **DopeMap w/hash-it** | 0.002 | 0.001 (+0.001) | 0.001 | 0.004 (+0.001) | 0.002 |

#### 1,000 entries
| Map | Set | Get | Has | Delete | Clear |
|-----------|-----------|-----------|-----------|-----------|----------- |
| **Map** | 0.023 | 0.009 | 0.009 | 0.044 | 0.022 |
| **DopeMap** | 0.025 (+0.002) | 0.021 (+0.012) | 0.009 | 0.053 (+0.008) | 0.026 (+0.004) |
| **DopeMap w/hash-it** | 0.026 (+0.003) | 0.023 (+0.014) | 0.010 (+0.001) | 0.051 (+0.007) | 0.026 (+0.003) |

#### 10,000 entries
| Map | Set | Get | Has | Delete | Clear |
|-----------|-----------|-----------|-----------|-----------|----------- |
| **Map** | 0.514 | 0.056 | 0.054 | 0.883 | 0.513 |
| **DopeMap** | 0.557 (+0.042) | 0.270 (+0.214) | 0.065 (+0.011) | 0.947 (+0.064) | 0.548 (+0.035) |
| **DopeMap w/hash-it** | 0.556 (+0.042) | 0.271 (+0.215) | 0.065 (+0.011) | 0.948 (+0.065) | 0.577 (+0.064) |

#### 100,000 entries
| Map | Set | Get | Has | Delete | Clear |
|-----------|-----------|-----------|-----------|-----------|----------- |
| **Map** | 6.8 | 3.2 | 2.9 | 11.3 | 6.1 |
| **DopeMap** | 7.2 (+0.395) | 3.9 (+0.742) | 3.4 (+0.533) | 12.8 (+1.5) | 6.7 (+0.540) |
| **DopeMap w/hash-it** | 6.9 (+0.061) | 3.8 (+0.637) | 3.5 (+0.652) | 11.8 (+0.495) | 6.7 (+0.615) |

### Real-World Patterns

#### Read-Heavy (70% Get, 20% Set, 5% Has, 5% Delete) - objects keys, 10,000 entries
| Map | Avg Time (ms) |
|-----------|-----------|
| **Map** | 0.098 |
| **DopeMap** | 0.630 (+0.532) |
| **DopeMap w/hash-it** | 0.570 (+0.472) |

#### Write-Heavy (50% Set, 30% Get, 10% Has, 10% Delete) - objects keys, 10,000 entries
| Map | Avg Time (ms) |
|-----------|-----------|
| **Map** | 0.146 |
| **DopeMap** | 0.682 (+0.536) |
| **DopeMap w/hash-it** | 0.621 (+0.474) |

#### Read-Heavy (70% Get, 20% Set, 5% Has, 5% Delete) - primitives keys, 10,000 entries
| Map | Avg Time (ms) |
|-----------|-----------|
| **Map** | 0.136 |
| **DopeMap** | 0.217 (+0.081) |
| **DopeMap w/hash-it** | 0.227 (+0.091) |

#### Write-Heavy (50% Set, 30% Get, 10% Has, 10% Delete) - primitives keys, 10,000 entries
| Map | Avg Time (ms) |
|-----------|-----------|
| **Map** | 0.169 |
| **DopeMap** | 0.273 (+0.103) |
| **DopeMap w/hash-it** | 0.260 (+0.090) |

### Memory Usage

#### 1,000 entries - objects keys
| Map | Populated | After Clear | Freed |
|-----------|-----------|-----------|-----------|
| **Map** | -94.7 KB | -121.7 KB | 27.0 KB |
| **DopeMap** | 98.5 KB | 6.3 KB | 92.2 KB |
| **DopeMap w/hash-it** | 97.6 KB | 816 B | 96.8 KB |

#### 10,000 entries - objects keys
| Map | Populated | After Clear | Freed |
|-----------|-----------|-----------|-----------|
| **Map** | 224.0 KB | 1.7 KB | 222.3 KB |
| **DopeMap** | 882.5 KB | 83.2 KB | 799.3 KB |
| **DopeMap w/hash-it** | 860.0 KB | 2.2 KB | 857.8 KB |

#### 100,000 entries - objects keys
| Map | Populated | After Clear | Freed |
|-----------|-----------|-----------|-----------|
| **Map** | 3.50 MB | -3.5 KB | 3.50 MB |
| **DopeMap** | 11.20 MB | 787.0 KB | 10.43 MB |
| **DopeMap w/hash-it** | 11.01 MB | 6.0 KB | 11.01 MB |

#### 1,000 entries - primitives keys
| Map | Populated | After Clear | Freed |
|-----------|-----------|-----------|-----------|
| **Map** | 23.5 KB | -2.9 KB | 26.4 KB |
| **DopeMap** | 67.7 KB | 896 B | 66.9 KB |
| **DopeMap w/hash-it** | 67.5 KB | 576 B | 66.9 KB |

#### 10,000 entries - primitives keys
| Map | Populated | After Clear | Freed |
|-----------|-----------|-----------|-----------|
| **Map** | 449.3 KB | 1.3 KB | 447.9 KB |
| **DopeMap** | 842.2 KB | 3.7 KB | 838.4 KB |
| **DopeMap w/hash-it** | 839.4 KB | 2.1 KB | 837.3 KB |

#### 100,000 entries - primitives keys
| Map | Populated | After Clear | Freed |
|-----------|-----------|-----------|-----------|
| **Map** | 3.50 MB | -280 B | 3.50 MB |
| **DopeMap** | 7.32 MB | 4.3 KB | 7.31 MB |
| **DopeMap w/hash-it** | 7.32 MB | 3.0 KB | 7.31 MB |

<!-- BENCHMARK RESULTS END -->
