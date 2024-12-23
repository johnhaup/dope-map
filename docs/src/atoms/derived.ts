import { atom } from "jotai";
import { jsMapAtom, dopeMapAtom } from "./state";

export const jsMapSizeAtom = atom((get) => get(jsMapAtom).map.size);
export const dopeMapSizeAtom = atom((get) => get(dopeMapAtom).map.size);

export const jsMapEntriesArrayAtom = atom((get) => {
  return Array.from(get(jsMapAtom).map.entries());
});

export const dopeMapEntriesArrayAtom = atom((get) => {
  return Array.from(get(dopeMapAtom).map.entries());
});
