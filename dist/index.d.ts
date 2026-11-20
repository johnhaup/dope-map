type DopeKey = unknown;
type HashedKey = string | number;
type HashFunction = (args: unknown) => HashedKey;
type DopeMapConfig = {
    /**
     *  Optional custom hash function.  Must return string or number.
     */
    hashFunction?: HashFunction;
};

declare class DopeMap<V, K = DopeKey> {
    private dopeMap;
    private refs;
    private mixed;
    private hashFunction;
    constructor(entries?: Iterable<[K, V]> | null, config?: DopeMapConfig);
    private handleConfig;
    private findRef;
    set(k: K, v: V): this;
    get(k: K): V | undefined;
    private getRef;
    has(k: K): boolean;
    delete(k: K): boolean;
    get size(): number;
    clear(): void;
    entries(): IterableIterator<[K, V]>;
    getEntries(): [K, V][];
    forEach(callback: (value: V, key: K, map: this) => void): void;
    keys(): IterableIterator<K>;
    getKeys(): K[];
    values(): IterableIterator<V>;
    getValues(): V[];
}

export { DopeMap };
