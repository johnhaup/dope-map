import { DopeMap } from "@johnhaup/dope-map";
import { atom } from "jotai";

export const jsMapAtom = atom({ map: new Map(), updatedAt: Date.now() });
export const dopeMapAtom = atom({ map: new DopeMap(), updatedAt: Date.now() });

export const keyReferenceAtom = atom();
