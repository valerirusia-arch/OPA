// src/shared/ui/cardSkin.ts
//
// Which finish the virtual card's face is drawn in, while the designer picks
// between two:
//
//   "deep"  the blue that walks from a light sky at the top to a deep one at
//           the hem, printing in white
//   "light" the designer's #90D5FF, the same walk in a pale register,
//           printing in the product's warm ink
//
// There is no right answer to read off the code: a card face is a surface,
// and the only way to choose one is to see both on the real page. So this is
// a switch on the DevBar, and the two finishes live side by side until the
// choice is made.
//
// PREVIEW PLUMBING, not product state — the same category as
// src/shared/ui/viewerRole.ts and src/theme/themeMode.ts. Module value plus
// useSyncExternalStore, so no provider has to be mounted and /app stays
// untouched. When the finish is settled, the losing skin and this file go
// together.

import { useSyncExternalStore } from "react";

export type CardSkin = "deep" | "light";

export const CARD_SKINS: CardSkin[] = ["deep", "light"];

/** What the switch calls each one, so the bar says more than a word. */
export const CARD_SKIN_LABELS: Record<CardSkin, string> = {
  deep: "Card · deep",
  light: "Card · light",
};

const STORAGE_KEY = "opa.cardSkin";

const isSkin = (value: unknown): value is CardSkin =>
  value === "deep" || value === "light";

/** Remembered for the tab's lifetime: comparing two surfaces means walking
 *  away and coming back, and a reload that silently resets the choice is how
 *  a reviewer stops trusting the switch. */
const restore = (): CardSkin => {
  const stored = window.sessionStorage?.getItem(STORAGE_KEY);
  return isSkin(stored) ? stored : "deep";
};

let current: CardSkin = restore();
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const setCardSkin = (skin: CardSkin) => {
  current = skin;
  window.sessionStorage?.setItem(STORAGE_KEY, skin);
  listeners.forEach((listener) => listener());
};

export const useCardSkin = (): CardSkin =>
  useSyncExternalStore(subscribe, () => current, () => current);
