'use strict';

var hashIt = require('hash-it');

class DopeMap {
    dopeMap;
    hashFunction = hashIt;
    primitiveKeys = new Set(["string", "number"]);
    constructor(config = {}) {
        this.validateHashFunction(config.hashFunction);
        this.dopeMap = new Map();
    }
    validateHashFunction(fn) {
        if (fn) {
            if (typeof fn !== "function") {
                throw new Error("[DOPE] Provided hashFunction must be a function.  Not dope!");
            }
            this.hashFunction = fn;
        }
    }
    isHashedKey(key) {
        return this.primitiveKeys.has(typeof key);
    }
    getHashedKey(key) {
        if (this.isHashedKey(key)) {
            return key;
        }
        return this.hashFunction(key);
    }
    set(key, value) {
        const hashedKey = this.getHashedKey(key);
        this.dopeMap.set(hashedKey, value);
    }
    get(key) {
        const hashedKey = this.getHashedKey(key);
        const entry = this.dopeMap.get(hashedKey);
        return entry;
    }
    has(key) {
        const hashedKey = this.getHashedKey(key);
        return this.dopeMap.has(hashedKey);
    }
    delete(key) {
        const hashedKey = this.getHashedKey(key);
        return this.dopeMap.delete(hashedKey);
    }
    /**
     * Returns Dope Map's current size
     */
    get size() {
        return this.dopeMap.size;
    }
    /**
     * Returns the full Dope Map as an object.  Keys will be hashed keys.
     */
    getMap() {
        return Object.fromEntries(this.dopeMap.entries());
    }
    clear() {
        return this.dopeMap.clear();
    }
    entries(asArray) {
        if (asArray) {
            return Array.from(this.dopeMap.entries());
        }
        return this.dopeMap.entries();
    }
    forEach(...args) {
        return this.dopeMap.forEach(...args);
    }
    keys(asArray) {
        if (asArray) {
            return Array.from(this.dopeMap.keys());
        }
        return this.dopeMap.keys();
    }
    values(asArray) {
        if (asArray) {
            return Array.from(this.dopeMap.values());
        }
        return this.dopeMap.values();
    }
}

module.exports = DopeMap;
