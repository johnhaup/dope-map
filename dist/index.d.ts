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
    private dopeMap;
    private hashFunction;
    private primitiveKeys;
    constructor(config?: DopeMapConfig);
    private validateHashFunction;
    private isHashedKey;
    private getHashedKey;
    set(key: DopeKey, value: V): void;
    get(key: DopeKey): V | undefined;
    has(key: DopeKey): boolean;
    delete(key: DopeKey): boolean;
    /**
     * Returns Dope Map's current size
     */
    get size(): number;
    /**
     * Returns the full Dope Map as an object.  Keys will be hashed keys.
     */
    getMap(): {
        [k: string]: V;
    };
    clear(): void;
    entries(asArray: true): [HashedKey, V][];
    entries(asArray?: false): IterableIterator<[HashedKey, V]>;
    forEach(...args: Parameters<Map<string | number, V>["forEach"]>): void;
    keys(asArray: true): HashedKey[];
    keys(asArray?: false): IterableIterator<HashedKey>;
    values(asArray: true): V[];
    values(asArray?: false): IterableIterator<V>;
}
export {};
