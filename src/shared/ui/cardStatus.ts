// src/shared/ui/cardStatus.ts
//
// Which status the card's pill shows, for PREVIEW. The virtual card has two
// states in the WBS — "Not used" before it is spent and "In use" after
// ("...before the Virtual Payment Card has been used"). The designer's own
// exported card (the sleeve finish) bakes one word into the file, so the only
// way to see both on it is to drive the pill from the outside.
//
// PREVIEW PLUMBING, not product state — the same category as cardSkin.ts and
// viewerRole.ts. Module value plus useSyncExternalStore, so no provider is
// mounted and /app stays untouched. A floating dev button (CardStatusDock)
// walks it, and the sleeve card overlays a live pill that reads it. When Dev
// wires the real card, this reads from the loan's `used` flag instead.

import { useSyncExternalStore } from "react";

export type CardStatus = "notUsed" | "inUse";

export const CARD_STATUSES: CardStatus[] = ["notUsed", "inUse"];

/** The i18n key each one prints, so the pill stays translatable. `as const`
 *  keeps the literal key types, which is what `t` accepts. */
export const CARD_STATUS_LABEL_KEYS = {
  notUsed: "loanPage.cardUnused",
  inUse: "loanPage.cardUsed",
} as const satisfies Record<CardStatus, string>;

const STORAGE_KEY = "opa.cardStatus";

const isStatus = (value: unknown): value is CardStatus =>
  value === "notUsed" || value === "inUse";

const restore = (): CardStatus => {
  const stored = window.sessionStorage?.getItem(STORAGE_KEY);
  return isStatus(stored) ? stored : "notUsed";
};

let current: CardStatus = restore();
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const setCardStatus = (status: CardStatus) => {
  current = status;
  window.sessionStorage?.setItem(STORAGE_KEY, status);
  listeners.forEach((listener) => listener());
};

export const useCardStatus = (): CardStatus =>
  useSyncExternalStore(subscribe, () => current, () => current);
