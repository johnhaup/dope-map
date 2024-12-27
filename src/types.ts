export type HashConfig = {
  /**
   * Set to true if your keys are objects in which you can't guarantee their key order.  Adds some performance overhead.
   * Defaults to false.
   */
  sortKeys?: boolean;
  /**
   * Set to true if your keys are objects that may contain circular references.  Adds some performance overhead.
   * Defaults to false.
   */
  handleCycles?: boolean;
};
export type DopeKey = unknown;
export type HashedKey = string | number;
export type HashFunction = (args: unknown, config?: HashConfig) => HashedKey;
export type MapEntry<V> = { k: DopeKey; v: V };

type DopeMapCustomHashConfig = {
  /**
   *  Optional custom hash function.  Must return string or number.
   */
  hashFunction: HashFunction;
  hashConfig?: never;
};

type DopeMapHashOptionsConfig = {
  /**
   * Optionally toggle on key sorting and circular reference handling. Cannot be combined with hashFunction.
   */
  hashConfig?: HashConfig;
  hashFunction?: never;
};

export type DopeMapConfig = DopeMapCustomHashConfig | DopeMapHashOptionsConfig;
