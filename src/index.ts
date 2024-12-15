import hashIt from "hash-it";

type DopeKey = unknown;
type HashFunction = (args: unknown) => unknown;

interface DopeMapConfig {
  /**
   *  Optional custom hash function
   */
  hashFunction?: HashFunction;
}

export default class DopeMap<V> {
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
    return `dope:${this.hashFunction(key)}`;
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
   * Returns the full Dope Map
   */
  get map() {
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

  forEach(args: Parameters<Map<string, V>["forEach"]>) {
    return this.dopeMap.forEach(...args);
  }

  keys(asArray: boolean = false) {
    const keys = this.dopeMap.keys();
    return asArray ? Array.from(keys) : keys;
  }

  values(asArray: boolean = false) {
    const values = this.dopeMap.values();
    return asArray ? Array.from(values) : values;
  }
}
