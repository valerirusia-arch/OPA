// src/shared/ui/nextDestination.ts
//
// Where a shared screen should send you when it is done.
//
// Registration and sign-in are one screen each, reached from several places.
// Somebody who arrives at them from a co-borrower invitation has to land back
// on that application afterwards — dropping them on their profile loses the
// only reason they followed the link. But the screens cannot know who sent
// them, and giving them a prop does not help: the router renders them with no
// props at all.
//
// So the sender puts the destination in the URL — `/register?next=/co-application`
// — and the screen reads it here. Navigation, not routing logic: no loader, no
// guard, nothing runs on route entry.

import { useLocation } from "@tanstack/react-router";

export const NEXT_PARAM = "next";

/**
 * The `next` in the current URL, or `fallback` when there isn't one.
 *
 * Only same-site paths are honoured. A `next` is a destination taken from the
 * address bar, and anything that is not a plain "/…" path — "//evil.example",
 * "https://…", "javascript:" — is somebody trying to use our own sign-in page
 * to bounce a visitor somewhere else.
 */
export function useNextDestination(fallback: string): string {
  const { searchStr } = useLocation();
  const next = new URLSearchParams(searchStr).get(NEXT_PARAM);
  if (!next || !next.startsWith("/") || next.startsWith("//")) return fallback;
  return next;
}
