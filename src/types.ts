export type HashConfig = {
  /**
   * Set to false if you are confident you can guarante your object keys' key order.
   * Defaults to true.
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
   * Optionally toggle off key sorting or on circular reference handling. Cannot be combined with hashFunction.
   */
  hashConfig?: HashConfig;
  hashFunction?: never;
};

export type DopeMapConfig = DopeMapCustomHashConfig | DopeMapHashOptionsConfig;
