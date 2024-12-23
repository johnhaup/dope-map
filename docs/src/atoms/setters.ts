import { atom } from "jotai";
import { jsMapAtom, dopeMapAtom } from "./state";

export const handleMapSetAtom = atom(null, (get, set, { key, value }) => {
  const updatedAt = Date.now();
  get(jsMapAtom).map.set(key, value);
  get(dopeMapAtom).map.set(key, value);

  set(jsMapAtom, (p) => ({ map: p.map, updatedAt }));
  set(dopeMapAtom, (p) => ({ map: p.map, updatedAt }));
});

export const handleMapGetAtom = atom(null, (get, set, key) => {
  const updatedAt = Date.now();
  const mapResp = get(jsMapAtom).map.get(key);
  const dopeResp = get(dopeMapAtom).map.get(key);

  set(jsMapAtom, (p) => ({ map: p.map, updatedAt }));
  set(dopeMapAtom, (p) => ({ map: p.map, updatedAt }));

  alert(`Map response: ${mapResp}\nDopeMap response: ${dopeResp}`);
});

export const handleMapDeleteAtom = atom(null, (get, set, key) => {
  const updatedAt = Date.now();
  const mapResp = get(jsMapAtom).map.delete(key);
  const dopeResp = get(dopeMapAtom).map.delete(key);

  set(jsMapAtom, (p) => ({ map: p.map, updatedAt }));
  set(dopeMapAtom, (p) => ({ map: p.map, updatedAt }));

  alert(`Map response: ${mapResp}\nDopeMap response: ${dopeResp}`);
});
