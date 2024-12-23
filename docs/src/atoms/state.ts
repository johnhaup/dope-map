import { atom } from "jotai";
import DopeMap from "@johnhaup/dope-map";

export const jsMapAtom = atom({ map: new Map(), updatedAt: Date.now() });
export const dopeMapAtom = atom({ map: new DopeMap(), updatedAt: Date.now() });

export const jsMapSizeAtom = atom((get) => get(jsMapAtom).map.size);
export const dopeMapSizeAtom = atom((get) => get(dopeMapAtom).map.size);

export const jsMapEntriesArrayAtom = atom((get) => {
  return Array.from(get(jsMapAtom).map.entries());
});

export const dopeMapEntriesArrayAtom = atom((get) => {
  return Array.from(get(dopeMapAtom).map.entries());
});

export const handleMapSetAtom = atom(null, (get, set, { key, value }) => {
  const updatedAt = Date.now();
  get(jsMapAtom).map.set(key, value);
  get(dopeMapAtom).map.set(key, value);

  set(jsMapAtom, (p) => ({ map: p.map, updatedAt }));
  set(dopeMapAtom, (p) => ({ map: p.map, updatedAt }));
});

export const handleMapGetAtom = atom(null, (get, set, key) => {
  const updatedAt = Date.now();
  get(jsMapAtom).map.get(key);
  get(dopeMapAtom).map.get(key);

  set(jsMapAtom, (p) => ({ map: p.map, updatedAt }));
  set(dopeMapAtom, (p) => ({ map: p.map, updatedAt }));
});

export const handleMapDeleteAtom = atom(null, (get, set, key) => {
  const updatedAt = Date.now();
  get(jsMapAtom).map.delete(key);
  get(dopeMapAtom).map.delete(key);

  set(jsMapAtom, (p) => ({ map: p.map, updatedAt }));
  set(dopeMapAtom, (p) => ({ map: p.map, updatedAt }));
});
