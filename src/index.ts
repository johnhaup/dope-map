import hashIt from "hash-it";

type DopeKey = unknown;
type HashedKey = string | number;
type HashFunction = (args: unknown) => HashedKey;
type MapEntry<V> = { k: DopeKey; v: V };

interface DopeMapConfig {
  /**
   *  Optional custom hash function.  Must return string or number.
   */
  hashFunction?: HashFunction;
}

export default class DopeMap<V> {
  private dopeMap: Map<HashedKey, MapEntry<V>>;
  private hashFunction: HashFunction = hashIt;
  private primitiveKeys = new Set<HashedKey>(["string", "number"]);

  constructor(config: DopeMapConfig = {}) {
    this.validateHashFunction(config.hashFunction);
    this.dopeMap = new Map();
  }

  private validateHashFunction(fn?: HashFunction) {
    if (fn) {
      if (typeof fn !== "function") {
        throw new Error(
          "[DOPE] Provided hashFunction must be a function.  Not dope!"
        );
      }

      this.hashFunction = fn;
    }
  }

  private isHashedKey(key: DopeKey): key is HashedKey {
    return this.primitiveKeys.has(typeof key);
  }

  private getHashedKey(key: DopeKey) {
    if (this.isHashedKey(key)) {
      return key;
    }

    return this.hashFunction(key);
  }

  set(k: DopeKey, v: V): void {
    const hashedKey = this.getHashedKey(k);
    this.dopeMap.set(hashedKey, { k, v });
  }

  get(k: DopeKey) {
    const hashedKey = this.getHashedKey(k);
    const entry = this.dopeMap.get(hashedKey);
    return entry?.v;
  }

  has(k: DopeKey) {
    const hashedKey = this.getHashedKey(k);
    return this.dopeMap.has(hashedKey);
  }

  delete(k: DopeKey) {
    const hashedKey = this.getHashedKey(k);
    return this.dopeMap.delete(hashedKey);
  }

  /**
   * Returns Dope Map's current size
   */
  get size() {
    return this.dopeMap.size;
  }

  /**
   * Returns the full Dope Map as an object
   */
  getMap() {
    return Object.fromEntries(this.dopeMap.entries());
  }

  clear() {
    return this.dopeMap.clear();
  }

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

  forEach(callback: (value: V, key: DopeKey, map: this) => void): void {
    for (const { k, v } of this.dopeMap.values()) {
      callback(v, k, this);
    }
  }

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
