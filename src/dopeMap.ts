import { dopeHash } from "./dopeHash.js";
import { HashedKey, HashFunction, DopeMapConfig, DopeKey } from "./types.js";

// Holds a non-primitive key. Primitive keys (string, number) are their own
// hash, so they are stored raw as `hash -> value` with no wrapper allocation
// and no extra pointer hop, keeping them at native Map speed. A user value can
// never be an Entry, so `instanceof` tells the two apart.
class Entry<K, V> {
  d = false; // dead: removed or cleared, so cached refs to it are stale
  constructor(public k: K, public v: V, public h: HashedKey) {}
}

export class DopeMap<V, K = DopeKey> {
  // hash -> V (primitive keys) or Entry (everything else). Owns order.
  private dopeMap: Map<HashedKey, V | Entry<K, V>>;
  // object reference -> entry: a key seen before costs one lookup, no rehash.
  // Shared between structurally equal references; stale ones are detected by
  // Entry.d and dropped lazily.
  private refs: Map<K, Entry<K, V>>;
  // True once any Entry exists. Until then primitive keys skip the Entry
  // check entirely. After, a primitive equal to some key's hash must resolve
  // to that same entry (custom hash functions can return such values).
  private mixed = false;

  private hashFunction: HashFunction = dopeHash;

  constructor(entries?: Iterable<[K, V]> | null, config?: DopeMapConfig) {
    this.handleConfig(config);
    this.dopeMap = new Map();
    this.refs = new Map();

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

  // Live entry for a non-primitive key, or undefined.
  private findRef(key: K): Entry<K, V> | undefined {
    let entry = this.refs.get(key);
    if (entry !== undefined) {
      if (!entry.d) return entry;
      this.refs.delete(key);
    }
    const found = this.dopeMap.get(this.hashFunction(key));
    if (found instanceof Entry) {
      entry = found;
      this.refs.set(key, entry);
      return entry;
    }
    return undefined;
  }

  set(k: K, v: V) {
    const t = typeof k;
    if (t === "string" || t === "number") {
      if (this.mixed) {
        const found = this.dopeMap.get(k as HashedKey);
        if (found instanceof Entry) {
          found.v = v;
          return this;
        }
      }
      this.dopeMap.set(k as HashedKey, v);
      return this;
    }

    const entry = this.refs.get(k);
    if (entry !== undefined && !entry.d) {
      entry.k = k;
      entry.v = v;
      return this;
    }

    const h = this.hashFunction(k);
    const found = this.dopeMap.get(h);
    if (found instanceof Entry) {
      found.k = k;
      found.v = v;
      this.refs.set(k, found);
    } else {
      this.mixed = true;
      const created = new Entry(k, v, h);
      this.dopeMap.set(h, created);
      this.refs.set(k, created);
    }
    return this;
  }

  get(k: K): V | undefined {
    const t = typeof k;
    if (t === "string" || t === "number") {
      const x = this.dopeMap.get(k as HashedKey);
      return (this.mixed && x instanceof Entry ? x.v : x) as V | undefined;
    }
    return this.getRef(k);
  }

  private getRef(k: K): V | undefined {
    const e = this.refs.get(k);
    if (e !== undefined && !e.d) return e.v;
    return this.findRef(k)?.v;
  }

  has(k: K) {
    const t = typeof k;
    if (t === "string" || t === "number") {
      return this.dopeMap.has(k as HashedKey);
    }
    const e = this.refs.get(k);
    if (e !== undefined && !e.d) return true;
    return this.findRef(k) !== undefined;
  }

  delete(k: K) {
    const t = typeof k;
    if (t === "string" || t === "number") {
      if (this.mixed) {
        const x = this.dopeMap.get(k as HashedKey);
        if (x instanceof Entry) x.d = true;
      }
      return this.dopeMap.delete(k as HashedKey);
    }
    const entry = this.findRef(k);
    if (entry === undefined) return false;
    entry.d = true;
    this.refs.delete(k);
    return this.dopeMap.delete(entry.h);
  }

  get size() {
    return this.dopeMap.size;
  }

  clear() {
    for (const x of this.dopeMap.values()) {
      if (x instanceof Entry) x.d = true;
    }
    this.refs.clear();
    this.mixed = false;
    return this.dopeMap.clear();
  }

  *entries(): IterableIterator<[K, V]> {
    for (const [h, x] of this.dopeMap) {
      yield x instanceof Entry ? [x.k, x.v] : [h as K, x];
    }
  }

  getEntries() {
    return Array.from(this.entries());
  }

  forEach(callback: (value: V, key: K, map: this) => void): void {
    for (const [h, x] of this.dopeMap) {
      if (x instanceof Entry) callback(x.v, x.k, this);
      else callback(x, h as K, this);
    }
  }

  *keys(): IterableIterator<K> {
    for (const [h, x] of this.dopeMap) {
      yield x instanceof Entry ? x.k : (h as K);
    }
  }

  getKeys() {
    return Array.from(this.keys());
  }

  *values(): IterableIterator<V> {
    for (const x of this.dopeMap.values()) {
      yield x instanceof Entry ? x.v : x;
    }
  }

  getValues() {
    return Array.from(this.values());
  }
}
