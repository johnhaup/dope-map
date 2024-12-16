import hashIt from "hash-it";

type DopeKey = unknown;
type HashFunction = (args: unknown) => string | number;

interface DopeMapConfig {
  /**
   *  Optional custom hash function.  Must return string or number.
   */
  hashFunction?: HashFunction;
}

export default class DopeMap<V> {
  private hashPrefix = "_dope:";
  private dopeMap: Map<string, V>;
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

  private getHashedKey(key: DopeKey): string {
    if (typeof key === "string" && key.startsWith(this.hashPrefix)) {
      return key;
    }

    return `${this.hashPrefix}${this.hashFunction(key)}`;
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

  entries(asArray: true): [string, V][];
  entries(asArray?: false): IterableIterator<[string, V]>;
  entries(asArray?: boolean): [string, V][] | IterableIterator<[string, V]> {
    if (asArray) {
      return Array.from(this.dopeMap.entries());
    }
    return this.dopeMap.entries();
  }

  forEach(...args: Parameters<Map<string, V>["forEach"]>) {
    return this.dopeMap.forEach(...args);
  }

  keys(asArray: true): string[];
  keys(asArray?: false): IterableIterator<string>;
  keys(asArray?: boolean): string[] | IterableIterator<string> {
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
