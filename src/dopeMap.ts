import { dopeHash } from "./dopeHash.js";
import {
  HashedKey,
  MapEntry,
  HashFunction,
  DopeMapConfig,
  DopeKey,
} from "./types.js";

export class DopeMap<V, K = DopeKey> {
  private dopeMap: Map<HashedKey, MapEntry<K, V>>;
  private hashKeyMap: Map<K, HashedKey>;

  private hashFunction: HashFunction = dopeHash;

  constructor(entries?: Iterable<[K, V]> | null, config?: DopeMapConfig) {
    this.handleConfig(config);
    this.dopeMap = new Map();
    this.hashKeyMap = new Map();

    if (entries) {
      for (const [key, value] of entries) {
        this.set(key, value);
      }
    }
  }

  private handleConfig(config?: DopeMapConfig) {
    if (config?.hashFunction) {
      if (typeof config.hashFunction !== "function") {
        throw new Error(
          "[DOPE] Provided hashFunction must be a function.  Not dope!"
        );
      }

      this.hashFunction = config.hashFunction;
    }
  }

  private isPrimitiveKey(key: DopeKey): key is HashedKey {
    return typeof key === "string" || typeof key === "number";
  }

  private getHashedKey(key: K): HashedKey {
    if (this.isPrimitiveKey(key)) {
      return key;
    }

    if (this.hashKeyMap.has(key)) {
      return this.hashKeyMap.get(key)!;
    }

    const hashedKey = this.hashFunction(key);
    this.hashKeyMap.set(key, hashedKey);
    return hashedKey;
  }

  set(k: K, v: V) {
    const hashedKey = this.getHashedKey(k);
    this.hashKeyMap.set(k, hashedKey);
    return this.dopeMap.set(hashedKey, { k, v });
  }

  get(k: K) {
    const hashedKey = this.getHashedKey(k);
    const entry = this.dopeMap.get(hashedKey);
    return entry?.v;
  }

  has(k: K) {
    const hashedKey = this.getHashedKey(k);
    return this.dopeMap.has(hashedKey);
  }

  delete(k: K) {
    const hashedKey = this.getHashedKey(k);
    return this.dopeMap.delete(hashedKey);
  }

  get size() {
    return this.dopeMap.size;
  }

  clear() {
    this.hashKeyMap.clear();
    return this.dopeMap.clear();
  }

  entries(): IterableIterator<[K, V]> {
    const iterator = (function* (map: Map<HashedKey, MapEntry<K, V>>) {
      for (const { k, v } of map.values()) {
        yield [k, v] as [K, V];
      }
    })(this.dopeMap);

    return iterator;
  }

  getEntries() {
    return Array.from(this.entries());
  }

  forEach(callback: (value: V, key: K, map: this) => void): void {
    for (const { k, v } of this.dopeMap.values()) {
      callback(v, k, this);
    }
  }

  keys() {
    const iterator = (function* (map: Map<HashedKey, MapEntry<K, V>>) {
      for (const { k } of map.values()) {
        yield k;
      }
    })(this.dopeMap);

    return iterator;
  }

  getKeys() {
    return Array.from(this.keys());
  }

  values() {
    const iterator = (function* (map: Map<HashedKey, MapEntry<K, V>>) {
      for (const { v } of map.values()) {
        yield v;
      }
    })(this.dopeMap);

    return iterator;
  }

  getValues() {
    return Array.from(this.values());
  }
}
