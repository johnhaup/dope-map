import { HashedKey, MapEntry, DopeMapConfig, DopeKey } from "./types.js";
export default class DopeMap<V> {
    private dopeMap;
    private hashKeyMap;
    private hashFunction;
    constructor(entries?: Iterable<[DopeKey, V]> | null, config?: DopeMapConfig);
    private handleConfig;
    private getHashedKey;
    set(k: DopeKey, v: V): Map<HashedKey, MapEntry<V>>;
    get(k: DopeKey): V | undefined;
    has(k: DopeKey): boolean;
    delete(k: DopeKey): boolean;
    /**
     * Returns Dope Map's current size
     */
    get size(): number;
    /**
     * Returns size of dope map plus its internal hash map
     */
    getTotalSize(): number;
    /**
     * Returns an object in a hashedKey: value shape.
     */
    getMap(): {
        [k: string]: MapEntry<V>;
    };
    clear(): void;
    entries(asArray: true): [DopeKey, V][];
    entries(asArray?: false): IterableIterator<[DopeKey, V]>;
    forEach(callback: (value: V, key: DopeKey, map: this) => void): void;
    keys(asArray: true): DopeKey[];
    keys(asArray?: false): IterableIterator<DopeKey>;
    values(asArray: true): V[];
    values(asArray?: false): IterableIterator<V>;
}
