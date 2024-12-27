export declare function fastStableHash(value: unknown, options?: {
    sortKeys?: boolean;
    handleCycles?: boolean;
}, stack?: WeakSet<WeakKey>): string;
