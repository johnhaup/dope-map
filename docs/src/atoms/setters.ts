import { atom } from "jotai";
import { jsMapAtom, dopeMapAtom } from "./state";

export const handleMapSetAtom = atom(null, (get, set, { key, value }) => {
  const updatedAt = Date.now();

  const mapSize = get(jsMapAtom).map.size;
  const dopeMapSize = get(dopeMapAtom).map.size;

  get(jsMapAtom).map.set(key, value);
  get(dopeMapAtom).map.set(key, value);

  set(jsMapAtom, (p) => ({ map: p.map, updatedAt }));
  set(dopeMapAtom, (p) => ({ map: p.map, updatedAt }));

  return {
    map: mapSize - get(jsMapAtom).map.size,
    dopeMap: dopeMapSize - get(dopeMapAtom).map.size,
  };
});

export const handleKeyMapMethodAtom = atom(
  null,
  (
    get,
    set,
    { key, method }: { key: any; method: "get" | "delete" | "has" }
  ) => {
    const updatedAt = Date.now();
    const mapResp = get(jsMapAtom).map[method](key);
    const dopeResp = get(dopeMapAtom).map[method](key);

    set(jsMapAtom, (p) => ({ map: p.map, updatedAt }));
    set(dopeMapAtom, (p) => ({ map: p.map, updatedAt }));

    return { map: mapResp, dopeMap: dopeResp };
  }
);
