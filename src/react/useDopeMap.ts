import { useEffect, useRef } from "react";
import { DopeMap } from "../dopeMap.js";
import { DopeMapConfig, DopeKey } from "../types.js";

export function useDopeMap<V, K = DopeKey>(
  entries?: Iterable<[K, V]> | null,
  config?: DopeMapConfig
): DopeMap<V, K> {
  const dopeMapRef = useRef<DopeMap<V, K> | null>(null);

  if (dopeMapRef.current === null) {
    dopeMapRef.current = new DopeMap<V, K>(entries, config);
  }

  useEffect(() => {
    return () => {
      dopeMapRef.current?.clear();
    };
  }, []);

  return dopeMapRef.current;
}
