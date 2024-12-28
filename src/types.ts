export type DopeKey = unknown;
export type HashedKey = string | number;
export type HashFunction = (args: unknown) => HashedKey;
export type MapEntry<V> = { k: DopeKey; v: V };

export type DopeMapConfig = {
  /**
   *  Optional custom hash function.  Must return string or number.
   */
  hashFunction?: HashFunction;
};
