// src/flows/_devbar/devChrome.ts
//
// Is the dev chrome on screen at all?
//
// "Dev chrome" is everything the prototype wears that the product does not:
// the DevBar, the stage dock, the card-status dock, and the staff detail
// page's floating layout switch. Hiding used to be the DevBar's own private
// useState, which meant the bar could step aside while the other controls
// stayed — fine while you work, wrong when you want to LOOK at the design, or
// screenshot it, with nothing of the tool in the frame.
//
// So the flag lives here, where every piece of chrome can read it, and
// SHIFT+D flips all of it at once (the listener is in DevBar.tsx — it is the
// one part that is always mounted).
//
// PREVIEW PLUMBING, not product state — the same category as
// src/shared/ui/cardSkin.ts and viewerRole.ts. Module value plus
// useSyncExternalStore, so nothing has to be provided and /app stays
// untouched. It goes away with the rest of the dev toolbar.

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "opa.devChrome";

/** Remembered for the tab's lifetime. Hiding the chrome is usually the start
 *  of a session of looking — clicking through screens, reloading — and a
 *  reload that puts the toolbar back is the toolbar barging into the shot. */
const restore = (): boolean => window.sessionStorage?.getItem(STORAGE_KEY) !== "hidden";

let shown = restore();
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const setDevChrome = (next: boolean) => {
  shown = next;
  window.sessionStorage?.setItem(STORAGE_KEY, next ? "shown" : "hidden");
  listeners.forEach((listener) => listener());
};

export const toggleDevChrome = () => setDevChrome(!shown);

/** True while the prototype may wear its tooling. */
export const useDevChrome = (): boolean =>
  useSyncExternalStore(subscribe, () => shown, () => shown);
