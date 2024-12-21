import hashIt from "hash-it";

type DopeKey = unknown;
type HashedKey = string | number;
type HashFunction = (args: unknown) => HashedKey;

interface DopeMapConfig {
  /**
   *  Optional custom hash function.  Must return string or number.
   */
  hashFunction?: HashFunction;
}

export default class DopeMap<V> {
  private dopeMap: Map<HashedKey, V>;
  private hashFunction: HashFunction = hashIt;

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

  private getHashedKey(key: DopeKey) {
    return this.hashFunction(key);
  }

  set(key: DopeKey, value: V): void {
    const hashedKey = this.getHashedKey(key);
    this.dopeMap.set(hashedKey, value);
  }

  get(key: DopeKey) {
    const hashedKey = this.getHashedKey(key);
    const entry = this.dopeMap.get(hashedKey);
    return entry;
  }

  has(key: DopeKey) {
    const hashedKey = this.getHashedKey(key);
    return this.dopeMap.has(hashedKey);
  }

  delete(key: DopeKey) {
    const hashedKey = this.getHashedKey(key);
    return this.dopeMap.delete(hashedKey);
  }

  /**
   * Returns Dope Map's current size
   */
  get size() {
    return this.dopeMap.size;
  }

  /**
   * Returns the full Dope Map as an object.  Keys will be hashed keys.
   */
  getMap() {
    return Object.fromEntries(this.dopeMap.entries());
  }

  clear() {
    return this.dopeMap.clear();
  }

  entries(asArray: true): [HashedKey, V][];
  entries(asArray?: false): IterableIterator<[HashedKey, V]>;
  entries(
    asArray?: boolean
  ): [HashedKey, V][] | IterableIterator<[HashedKey, V]> {
    if (asArray) {
      return Array.from(this.dopeMap.entries());
    }
    return this.dopeMap.entries();
  }

  forEach(...args: Parameters<Map<string | number, V>["forEach"]>) {
    return this.dopeMap.forEach(...args);
  }

  keys(asArray: true): HashedKey[];
  keys(asArray?: false): IterableIterator<HashedKey>;
  keys(asArray?: boolean): HashedKey[] | IterableIterator<HashedKey> {
    if (asArray) {
      return Array.from(this.dopeMap.keys());
    }
    return this.dopeMap.keys();
  }

  values(asArray: true): V[];
  values(asArray?: false): IterableIterator<V>;
  values(asArray?: boolean): V[] | IterableIterator<V> {
    if (asArray) {
      return Array.from(this.dopeMap.values());
    }
    return this.dopeMap.values();
  }
}
