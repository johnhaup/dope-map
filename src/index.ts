import hash from "hash-it";

type KeyType =
  | string
  | number
  | boolean
  | null
  | undefined
  | object
  | Array<any>;

type KeyValue<T> = {
  key: string | number | boolean | null | undefined | object | Array<any>;
  value: T;
};

const primitiveKeySet = new Set(["string", "number", "boolean"]);

export default class DapperMapper<T> {
  private map: Map<string, { key: KeyType; value: T }>;

  constructor() {
    this.map = new Map<string, KeyValue<T>>();
  }

  private static getHashedKey(key: any): string {
    if (primitiveKeySet.has(typeof key) || key === null) {
      return key; // Use the primitive key as is
    }
    return `dapper:${hash(key)}`; // Hash non-primitive keys
  }

  set(key: KeyType, value: T): void {
    const hashedKey = DapperMapper.getHashedKey(key);
    this.map.set(hashedKey, { key, value });
  }

  get(key: KeyType): T | undefined {
    const hashedKey = DapperMapper.getHashedKey(key);
    const entry = this.map.get(hashedKey);
    return entry ? entry.value : undefined;
  }

  has(key: KeyType): boolean {
    const hashedKey = DapperMapper.getHashedKey(key);
    return this.map.has(hashedKey);
  }

  delete(key: KeyType): boolean {
    const hashedKey = DapperMapper.getHashedKey(key);
    return this.map.delete(hashedKey);
  }

  clear(): void {
    this.map.clear();
  }

  get size(): number {
    return this.map.size;
  }

  export(): Array<{ hash: string; key: KeyType; value: T }> {
    return Array.from(this.map.entries()).map(([hash, { key, value }]) => ({
      hash,
      key,
      value,
    }));
  }
}
