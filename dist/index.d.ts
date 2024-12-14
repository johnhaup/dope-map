type DopeKey = any;
interface DopeMapConfig {
    /**
     *  Optional custom hash function
     */
    hashFunction?: Function;
}
export default class DopeMap<V> {
    private dopeMap;
    private hashFunction;
    constructor(config?: DopeMapConfig);
    private validateHashFunction;
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
     * Returns the full Dope Map
     */
    get map(): {
        [k: string]: V;
    };
    clear(): void;
    entries(asArray: true): [string, V][];
    entries(asArray?: false): IterableIterator<[string, V]>;
    forEach(args: Parameters<Map<string, V>["forEach"]>): void;
    keys(asArray?: boolean): MapIterator<string> | string[];
    values(asArray?: boolean): MapIterator<V> | V[];
}
export {};
