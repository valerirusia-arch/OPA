// src/shared/ui/cardSkin.ts
//
// Which finish the virtual card's face is drawn in, while the designer
// compares:
//
//   "sleeveTeal"  THE DEFAULT. ONE and AMERICA in a single #008AA2
//                 (src/assets/card/card-teal.svg)
//   "sleeveSlate" the same, in #53858E (src/assets/card/card-slate.svg)
//   "sleeve"      the designer's card as they drew it, the lockup printing
//                 letter by letter in three teals (src/assets/card/card.svg)
//
// In both single-colour finishes "percent", "for" and the trademark stay
// white; only the letters of ONE and AMERICA change. The two candidate colours
// sit within 0.03 of each other for contrast on the card's ground (3.48 vs
// 3.45 at its palest), so this is a choice about character, not legibility —
// which is exactly why it is a switch and not an argument.
//
// The two differ only in how many greens the lockup carries — *"ხომ ხედავ
// ლოგოს სხვადასხვა მწვანე ფერი რომ აქვს, არ მომწონს"*. A THIRD finish, the
// same card wearing the short flame + OPA mark, was compared here and deleted:
// the full lockup won. "deep" (the old drawn navy card) is not selectable; it
// stays in the type only as the fallback drawing for the revealed-number face.
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

export type CardSkin = "deep" | "sleeve" | "sleeveTeal" | "sleeveSlate";

/** The single-colour lockups lead, because that is the direction; the original
 *  sits last to be compared against. "deep" is not selectable (it lives on only
 *  as the fallback for the revealed-number face). */
export const CARD_SKINS: CardSkin[] = ["sleeveTeal", "sleeveSlate", "sleeve"];

/** Named by the hex, because with two single-colour candidates that is the
 *  only thing that tells them apart — and it is how the designer asks for
 *  them. No "Card ·" prefix: a third option pushed the bar wide enough to
 *  crowd the Flow map button off the end, and the tooltip already says what
 *  the group is. */
export const CARD_SKIN_LABELS: Record<CardSkin, string> = {
  deep: "Deep",
  sleeve: "Original",
  /* No leading # on these two: the hex-literal guard reads one as a colour in
     source, which is exactly its job — the actual values live in the SVG
     files, where they belong. */
  sleeveTeal: "008AA2",
  sleeveSlate: "53858E",
};

const STORAGE_KEY = "opa.cardSkin";

const isSkin = (value: unknown): value is CardSkin =>
  value === "sleeve" || value === "sleeveTeal" || value === "sleeveSlate";

/** Remembered for the tab's lifetime: comparing two surfaces means walking
 *  away and coming back, and a reload that silently resets the choice is how
 *  a reviewer stops trusting the switch. */
const restore = (): CardSkin => {
  const stored = window.sessionStorage?.getItem(STORAGE_KEY);
  return isSkin(stored) ? stored : "sleeveTeal";
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
