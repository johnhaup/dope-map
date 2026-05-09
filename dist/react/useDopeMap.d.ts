import { DopeMap } from "../dopeMap.js";
import { DopeMapConfig, DopeKey } from "../types.js";
export declare function useDopeMap<V, K = DopeKey>(entries?: Iterable<[K, V]> | null, config?: DopeMapConfig): DopeMap<V, K>;
