import { dopeHash } from "./dopeHash.js";
import {
  HashedKey,
  MapEntry,
  HashFunction,
  DopeMapConfig,
  DopeKey,
  HashConfig,
} from "./types.js";

export default class DopeMap<V> {
  private dopeMap: Map<HashedKey, MapEntry<V>>;
  private hashKeyMap: Map<DopeKey, HashedKey>;

  private hashFunction: HashFunction = dopeHash;
  private hashConfig: HashConfig | undefined = undefined;

  constructor(config: DopeMapConfig = {}) {
    this.handleConfig(config);
    this.dopeMap = new Map();
    this.hashKeyMap = new Map();
  }

  private handleConfig(config?: DopeMapConfig) {
    if (config?.hashFunction) {
      if (typeof config.hashFunction !== "function") {
        throw new Error(
          "[DOPE] Provided hashFunction must be a function.  Not dope!"
        );
      }

      this.hashFunction = config.hashFunction;
    } else {
      this.hashConfig = config?.hashConfig;
    }
  }

  private getHashedKey(key: DopeKey) {
    if (this.hashKeyMap.has(key)) {
      return this.hashKeyMap.get(key) as string;
    }

    return this.hashFunction(key, this.hashConfig);
  }

  set(k: DopeKey, v: V): void {
    const hashedKey = this.getHashedKey(k);
    this.dopeMap.set(hashedKey, { k, v });
    this.hashKeyMap.set(k, hashedKey);
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
   * Returns size of dope map plus its internal hash map
   */
  getTotalSize() {
    return this.dopeMap.size + this.hashKeyMap.size;
  }

  /**
   * Returns an object in a hashedKey: value shape.
   */
  getMap() {
    return Object.fromEntries(this.dopeMap.entries());
  }

  clear() {
    this.hashKeyMap.clear();
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
