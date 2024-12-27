import { MapEntry, DopeMapConfig, DopeKey } from "./types.js";
export default class DopeMap<V> {
    private dopeMap;
    private primitiveKeys;
    private hashFunction;
    private hashConfig;
    constructor(config?: DopeMapConfig);
    private handleConfig;
    private isHashedKey;
    private getHashedKey;
    set(k: DopeKey, v: V): void;
    get(k: DopeKey): V | undefined;
    has(k: DopeKey): boolean;
    delete(k: DopeKey): boolean;
    /**
     * Returns Dope Map's current size
     */
    get size(): number;
    /**
     * Returns the full Dope Map as an object
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
