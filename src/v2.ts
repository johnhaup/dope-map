import { hash_js_object } from "rust-hash";
import { HashedKey, MapEntry, DopeKey } from "./types.js";

export default class FastMap<V> {
  private dopeMap: Map<HashedKey, MapEntry<V>>;
  private hashFunction = hash_js_object;
  private primitiveKeys = new Set<HashedKey>(["string", "number"]);

  constructor() {
    this.dopeMap = new Map();
  }

  /**
   * Check if a key is a primitive (string or number)
   */
  private isHashedKey(key: DopeKey): key is HashedKey {
    return this.primitiveKeys.has(typeof key);
  }

  /**
   * Get a consistent hashed key using Rust or a fallback JavaScript function
   */
  private getHashedKey(key: DopeKey): HashedKey {
    if (this.isHashedKey(key)) {
      return key;
    }

    return this.hashFunction(key);
  }

  /**
   * Set a key-value pair in the map
   */
  set(k: DopeKey, v: V): void {
    const hashedKey = this.getHashedKey(k);

    this.dopeMap.set(hashedKey, { k, v });
  }

  /**
   * Get a value by key
   */
  get(k: DopeKey): V | undefined {
    const hashedKey = this.getHashedKey(k);
    const entry = this.dopeMap.get(hashedKey);
    return entry?.v;
  }

  /**
   * Check if a key exists in the map
   */
  has(k: DopeKey): boolean {
    const hashedKey = this.getHashedKey(k);
    return this.dopeMap.has(hashedKey);
  }

  /**
   * Delete a key from the map
   */
  delete(k: DopeKey): boolean {
    const hashedKey = this.getHashedKey(k);
    return this.dopeMap.delete(hashedKey);
  }

  /**
   * Clear all entries in the map
   */
  clear(): void {
    this.dopeMap.clear();
  }

  /**
   * Get the size of the map
   */
  get size(): number {
    return this.dopeMap.size;
  }

  /**
   * Get the full map as an object
   */
  getMap(): Record<string, V> {
    return Object.fromEntries(
      Array.from(this.dopeMap.entries()).map(([, entry]) => [entry.k, entry.v])
    );
  }

  /**
   * Get all entries in the map
   */
  entries(asArray: true): [DopeKey, V][];
  entries(asArray?: false): IterableIterator<[DopeKey, V]>;
  entries(asArray?: boolean): [DopeKey, V][] | IterableIterator<[DopeKey, V]> {
    const iterator = (function* (map: Map<HashedKey, MapEntry<V>>) {
      for (const { k, v } of map.values()) {
        yield [k, v] as [DopeKey, V];
      }
    })(this.dopeMap);

    return asArray ? Array.from(iterator) : iterator;
  }

  /**
   * Iterate over each entry in the map
   */
  forEach(callback: (value: V, key: DopeKey, map: this) => void): void {
    for (const { k, v } of this.dopeMap.values()) {
      callback(v, k, this);
    }
  }

  /**
   * Get all keys in the map
   */
  keys(asArray: true): DopeKey[];
  keys(asArray?: false): IterableIterator<DopeKey>;
  keys(asArray?: boolean): DopeKey[] | IterableIterator<DopeKey> {
    const iterator = (function* (map: Map<HashedKey, MapEntry<V>>) {
      for (const { k } of map.values()) {
        yield k;
      }
    })(this.dopeMap);

    return asArray ? Array.from(iterator) : iterator;
  }

  /**
   * Get all values in the map
   */
  values(asArray: true): V[];
  values(asArray?: false): IterableIterator<V>;
  values(asArray?: boolean): V[] | IterableIterator<V> {
    const iterator = (function* (map: Map<HashedKey, MapEntry<V>>) {
      for (const { v } of map.values()) {
        yield v;
      }
    })(this.dopeMap);

    return asArray ? Array.from(iterator) : iterator;
  }
}
