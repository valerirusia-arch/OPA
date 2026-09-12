// src/features/Auth/ui/useIdleTimer.ts
//
// Watches for real user activity and reports when it has been quiet for too
// long. Presentation-level only: it decides nothing about the session, it just
// flips a boolean the screen can act on.
//
// The period is "configurable" per the WBS — pass whatever Dev settles on.

import { useEffect, useState } from "react";

const ACTIVITY_EVENTS = ["mousedown", "keydown", "scroll", "touchstart"] as const;

/** Default idle window before the warning appears. */
export const DEFAULT_IDLE_MS = 15 * 60 * 1000;

export function useIdleTimer(idleMs: number = DEFAULT_IDLE_MS) {
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    let timer = window.setTimeout(() => setIdle(true), idleMs);

    const reset = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setIdle(true), idleMs);
    };

    ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, reset, { passive: true }));

    return () => {
      window.clearTimeout(timer);
      ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, reset));
    };
  }, [idleMs]);

  return { idle, reset: () => setIdle(false) };
}
