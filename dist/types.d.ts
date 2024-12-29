export type DopeKey = unknown;
export type HashedKey = string | number;
export type HashFunction = (args: unknown) => HashedKey;
export type MapEntry<K, V> = {
    k: K;
    v: V;
};
export type DopeMapConfig = {
    /**
     *  Optional custom hash function.  Must return string or number.
     */
    hashFunction?: HashFunction;
};
