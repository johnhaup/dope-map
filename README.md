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
| **DopeMap** | 0.049 (+0.048) | 0.003 (+0.002) | 0.002 (+0.001) | 0.052 (+0.049) | 0.049 (+0.047) |
| **DopeMap w/hash-it** | 0.059 (+0.057) | 0.003 (+0.003) | 0.002 (+0.002) | 0.063 (+0.060) | 0.060 (+0.058) |
| **DopeMap V1** | 0.072 (+0.071) | 0.072 (+0.071) | 0.072 (+0.072) | 0.153 (+0.150) | 0.075 (+0.073) |

#### 1,000 entries
| Map | Set | Get | Has | Delete | Clear |
|-----------|-----------|-----------|-----------|-----------|----------- |
| **Map** | 0.020 | 0.007 | 0.007 | 0.035 | 0.020 |
| **DopeMap** | 0.493 (+0.473) | 0.034 (+0.027) | 0.021 (+0.014) | 0.524 (+0.489) | 0.491 (+0.471) |
| **DopeMap w/hash-it** | 0.590 (+0.570) | 0.043 (+0.036) | 0.023 (+0.016) | 0.647 (+0.612) | 0.599 (+0.580) |
| **DopeMap V1** | 0.735 (+0.715) | 0.727 (+0.720) | 0.698 (+0.691) | 1.5 (+1.5) | 0.748 (+0.729) |

#### 10,000 entries
| Map | Set | Get | Has | Delete | Clear |
|-----------|-----------|-----------|-----------|-----------|----------- |
| **Map** | 0.277 | 0.064 | 0.054 | 0.513 | 0.268 |
| **DopeMap** | 5.2 (+4.9) | 0.508 (+0.444) | 0.259 (+0.205) | 5.8 (+5.3) | 5.3 (+5.1) |
| **DopeMap w/hash-it** | 6.4 (+6.1) | 0.642 (+0.578) | 0.610 (+0.556) | 7.5 (+6.9) | 6.5 (+6.2) |
| **DopeMap V1** | 7.8 (+7.5) | 7.7 (+7.7) | 7.6 (+7.6) | 15.4 (+14.9) | 7.6 (+7.3) |

#### 100,000 entries
| Map | Set | Get | Has | Delete | Clear |
|-----------|-----------|-----------|-----------|-----------|----------- |
| **Map** | 4.0 | 2.3 | 2.2 | 7.2 | 4.2 |
| **DopeMap** | 72.6 (+68.6) | 8.4 (+6.1) | 7.0 (+4.9) | 85.2 (+78.0) | 78.6 (+74.4) |
| **DopeMap w/hash-it** | 81.2 (+77.2) | 9.1 (+6.8) | 6.3 (+4.1) | 93.5 (+86.3) | 83.0 (+78.8) |
| **DopeMap V1** | 91.5 (+87.6) | 82.1 (+79.7) | 82.5 (+80.4) | 174.5 (+167.3) | 92.5 (+88.4) |

### PRIMITIVES keys
#### 100 entries
| Map | Set | Get | Has | Delete | Clear |
|-----------|-----------|-----------|-----------|-----------|----------- |
| **Map** | 0.002 | 0.001 | 0.001 | 0.003 | 0.002 |
| **DopeMap** | 0.002 | 0.001 (+0.001) | 0.001 | 0.004 (+0.001) | 0.002 |
| **DopeMap w/hash-it** | 0.002 | 0.001 (+0.001) | 0.001 | 0.004 (+0.001) | 0.002 |
| **DopeMap V1** | 0.003 (+0.001) | 0.002 (+0.001) | 0.001 | 0.005 (+0.002) | 0.003 (+0.001) |

#### 1,000 entries
| Map | Set | Get | Has | Delete | Clear |
|-----------|-----------|-----------|-----------|-----------|----------- |
| **Map** | 0.022 | 0.008 | 0.007 | 0.045 | 0.022 |
| **DopeMap** | 0.027 (+0.005) | 0.022 (+0.015) | 0.010 (+0.003) | 0.053 (+0.008) | 0.027 (+0.005) |
| **DopeMap w/hash-it** | 0.027 (+0.005) | 0.021 (+0.014) | 0.009 (+0.001) | 0.052 (+0.008) | 0.027 (+0.005) |
| **DopeMap V1** | 0.035 (+0.013) | 0.028 (+0.020) | 0.015 (+0.008) | 0.066 (+0.022) | 0.035 (+0.014) |

#### 10,000 entries
| Map | Set | Get | Has | Delete | Clear |
|-----------|-----------|-----------|-----------|-----------|----------- |
| **Map** | 0.521 | 0.055 | 0.054 | 0.949 | 0.520 |
| **DopeMap** | 0.550 (+0.029) | 0.271 (+0.217) | 0.064 (+0.010) | 0.955 (+0.006) | 0.561 (+0.041) |
| **DopeMap w/hash-it** | 0.551 (+0.030) | 0.270 (+0.215) | 0.064 (+0.010) | 0.952 (+0.003) | 0.555 (+0.035) |
| **DopeMap V1** | 0.597 (+0.076) | 0.296 (+0.241) | 0.098 (+0.044) | 1.0 (+0.077) | 0.595 (+0.075) |

#### 100,000 entries
| Map | Set | Get | Has | Delete | Clear |
|-----------|-----------|-----------|-----------|-----------|----------- |
| **Map** | 6.2 | 2.7 | 2.9 | 11.2 | 6.3 |
| **DopeMap** | 6.6 (+0.445) | 3.8 (+1.0) | 2.9 (-0.002) | 11.7 (+0.506) | 6.7 (+0.384) |
| **DopeMap w/hash-it** | 6.6 (+0.441) | 4.0 (+1.2) | 3.4 (+0.543) | 11.6 (+0.394) | 6.7 (+0.331) |
| **DopeMap V1** | 7.1 (+0.980) | 4.1 (+1.4) | 3.3 (+0.409) | 12.3 (+1.1) | 7.1 (+0.826) |

### Real-World Patterns

#### Read-Heavy (70% Get, 20% Set, 5% Has, 5% Delete) - objects keys, 10,000 entries
| Map | Avg Time (ms) |
|-----------|-----------|
| **Map** | 0.098 |
| **DopeMap** | 0.537 (+0.439) |
| **DopeMap w/hash-it** | 0.544 (+0.445) |
| **DopeMap V1** | 7.5 (+7.4) |

#### Write-Heavy (50% Set, 30% Get, 10% Has, 10% Delete) - objects keys, 10,000 entries
| Map | Avg Time (ms) |
|-----------|-----------|
| **Map** | 0.144 |
| **DopeMap** | 0.583 (+0.439) |
| **DopeMap w/hash-it** | 0.608 (+0.464) |
| **DopeMap V1** | 7.5 (+7.4) |

#### Read-Heavy (70% Get, 20% Set, 5% Has, 5% Delete) - primitives keys, 10,000 entries
| Map | Avg Time (ms) |
|-----------|-----------|
| **Map** | 0.136 |
| **DopeMap** | 0.218 (+0.083) |
| **DopeMap w/hash-it** | 0.218 (+0.082) |
| **DopeMap V1** | 0.269 (+0.133) |

#### Write-Heavy (50% Set, 30% Get, 10% Has, 10% Delete) - primitives keys, 10,000 entries
| Map | Avg Time (ms) |
|-----------|-----------|
| **Map** | 0.204 |
| **DopeMap** | 0.278 (+0.074) |
| **DopeMap w/hash-it** | 0.265 (+0.061) |
| **DopeMap V1** | 0.315 (+0.111) |

### Memory Usage

#### 1,000 entries - objects keys
| Map | Populated | After Clear | Freed |
|-----------|-----------|-----------|-----------|
| **Map** | -161.1 KB | -188.1 KB | 27.0 KB |
| **DopeMap** | 164.0 KB | 6.1 KB | 157.9 KB |
| **DopeMap w/hash-it** | 94.9 KB | -1.9 KB | 96.7 KB |
| **DopeMap V1** | 71.8 KB | 3.6 KB | 68.2 KB |

#### 10,000 entries - objects keys
| Map | Populated | After Clear | Freed |
|-----------|-----------|-----------|-----------|
| **Map** | 221.9 KB | -888 B | 222.8 KB |
| **DopeMap** | 1.50 MB | 82.9 KB | 1.42 MB |
| **DopeMap w/hash-it** | 860.0 KB | 2.1 KB | 857.9 KB |
| **DopeMap V1** | 635.3 KB | 1.3 KB | 634.0 KB |

#### 100,000 entries - objects keys
| Map | Populated | After Clear | Freed |
|-----------|-----------|-----------|-----------|
| **Map** | 3.50 MB | -2.5 KB | 3.50 MB |
| **DopeMap** | 17.68 MB | 786.9 KB | 16.91 MB |
| **DopeMap w/hash-it** | 11.01 MB | 6.0 KB | 11.01 MB |
| **DopeMap V1** | 7.51 MB | 9.3 KB | 7.51 MB |

#### 1,000 entries - primitives keys
| Map | Populated | After Clear | Freed |
|-----------|-----------|-----------|-----------|
| **Map** | 20.9 KB | -7.0 KB | 27.8 KB |
| **DopeMap** | 67.7 KB | 960 B | 66.8 KB |
| **DopeMap w/hash-it** | 67.7 KB | 880 B | 66.9 KB |
| **DopeMap V1** | 67.8 KB | 928 B | 66.9 KB |

#### 10,000 entries - primitives keys
| Map | Populated | After Clear | Freed |
|-----------|-----------|-----------|-----------|
| **Map** | 448.4 KB | 512 B | 447.9 KB |
| **DopeMap** | 841.9 KB | 3.5 KB | 838.4 KB |
| **DopeMap w/hash-it** | 840.4 KB | 1.9 KB | 838.4 KB |
| **DopeMap V1** | 840.1 KB | 3.5 KB | 836.6 KB |

#### 100,000 entries - primitives keys
| Map | Populated | After Clear | Freed |
|-----------|-----------|-----------|-----------|
| **Map** | 3.50 MB | -1.5 KB | 3.50 MB |
| **DopeMap** | 7.32 MB | 4.6 KB | 7.31 MB |
| **DopeMap w/hash-it** | 7.32 MB | 3.0 KB | 7.31 MB |
| **DopeMap V1** | 7.32 MB | 5.5 KB | 7.31 MB |

<!-- BENCHMARK RESULTS END -->
