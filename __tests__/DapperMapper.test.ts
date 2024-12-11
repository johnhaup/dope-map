import hash from "hash-it";
import DapperMapper from "../src/index";
import {
  nirvanaKey,
  nirvanaValue,
  weezerKey,
  weezerValue,
} from "../__fixtures__";

describe("DapperMapper", () => {
  type TestValue = { [key: number]: string };
  let mapper: DapperMapper<TestValue>;

  beforeEach(() => {
    mapper = new DapperMapper<TestValue>();
  });

  it("sets and retrieves a value by key", () => {
    mapper.set(nirvanaKey, nirvanaValue);
    expect(mapper.get(nirvanaKey)).toEqual(nirvanaValue);
  });

  it("allows for object keys to be equal but different references", () => {
    mapper.set(nirvanaKey, nirvanaValue);
    expect(mapper.get({ ...nirvanaKey })).toEqual(nirvanaValue);
  });

  it("returns undefined for a non-existing key", () => {
    mapper.set(nirvanaKey, nirvanaValue);
    expect(mapper.get(nirvanaKey)).toEqual(nirvanaValue);

    const partialNirvanaKey = {
      band: "nirvana",
      genre: "rock",
    };
    expect(mapper.get(partialNirvanaKey)).toBeUndefined();
  });

  it("confirms the presence of a key", () => {
    mapper.set(nirvanaKey, nirvanaValue);
    expect(mapper.get(nirvanaKey)).toEqual(nirvanaValue);
    expect(mapper.has(nirvanaKey)).toBe(true);
  });

  it("deletes a key", () => {
    mapper.set(nirvanaKey, nirvanaValue);
    expect(mapper.get(nirvanaKey)).toEqual(nirvanaValue);

    expect(mapper.delete(nirvanaKey)).toBe(true);
    expect(mapper.has(nirvanaKey)).toBe(false);
  });

  it("clears all keys", () => {
    mapper.set(nirvanaKey, nirvanaValue);
    mapper.set(weezerKey, weezerValue);

    mapper.clear();
    expect(mapper.size).toBe(0);
    expect(mapper.has(nirvanaKey)).toBe(false);
    expect(mapper.has(weezerKey)).toBe(false);
  });

  it("should export all entries", () => {
    mapper.set(weezerKey, weezerValue);
    const exported = mapper.export();

    expect(exported).toHaveLength(1);
    expect(exported[0].key).toEqual(weezerKey);
    expect(exported[0].value).toEqual(weezerValue);
  });

  it("hashes non-primitive keys but not primitive keys", () => {
    const keyPrimitive = "primitiveKey";
    const valuePrimitive = { 4: "primitive value" };
    mapper.set(keyPrimitive, valuePrimitive);

    const keyObject = { nested: "value" };
    const valueObject = { 5: "object value" };
    mapper.set(keyObject, valueObject);

    const exported = mapper.export();
    const exportedKeys = exported.map((entry) => entry.hash);

    expect(exportedKeys).toContain(keyPrimitive);
    expect(exportedKeys).toContain(`dapper:${hash(keyObject)}`);
  });
});
