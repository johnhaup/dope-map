import { HashedKey, MapEntry, DopeMapConfig, DopeKey } from "./types.js";
export declare class DopeMap<V, K = DopeKey> {
    private dopeMap;
    private hashKeyMap;
    private hashFunction;
    constructor(entries?: Iterable<[K, V]> | null, config?: DopeMapConfig);
    private handleConfig;
    private isPrimitiveKey;
    private getHashedKey;
    set(k: K, v: V): Map<HashedKey, MapEntry<K, V>>;
    get(k: K): V | undefined;
    has(k: K): boolean;
    delete(k: K): boolean;
    get size(): number;
    clear(): void;
    entries(): IterableIterator<[K, V]>;
    getEntries(): [K, V][];
    forEach(callback: (value: V, key: K, map: this) => void): void;
    keys(): Generator<K, void, unknown>;
    getKeys(): K[];
    values(): Generator<V, void, unknown>;
    getValues(): V[];
}
