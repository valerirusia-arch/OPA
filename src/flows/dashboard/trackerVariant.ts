// src/flows/dashboard/trackerVariant.ts
//
// WHICH OF THE TWO TRACKERS THE DASHBOARD IS DRAWING.
//
// The designer asked for both to be built and compared in the running app
// rather than picked from a description: *"გავტესტოთ ორივე ნაირი ტრეკერი
// გადამრთველით."* Two screenshots side by side answer which one looks better;
// a switch over the real record answers which one still works when a date is
// missing, when a step has failed, and when the labels are in Spanish.
//
// It is a COMPARISON, not a product setting. Nothing in the WBS offers a
// borrower a choice of progress indicator, and nothing should: the switch
// lives on the dev dock, next to the stage walker, and one of the two
// variants is deleted the moment the designer says which.
//
// PREVIEW PLUMBING, same category and the same mechanism as
// `shared/ui/viewerRole.ts` and `theme/themeMode.ts`: a module-level value
// plus `useSyncExternalStore`, so there is no provider to mount — which would
// mean editing /app. No store library, no data, no logic.
//
// Deliberately not persisted. It resets to the default on reload, which is
// what you want from a thing that is being chosen rather than configured.

import { useSyncExternalStore } from "react";
import type { TrackVariant } from "../../features/Dashboard/ui/StageTrack";

/** The nodes rail opens, because it is the one the references lead with. */
let variant: TrackVariant = "nodes";

const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const snapshot = () => variant;

export const setTrackerVariant = (next: TrackVariant) => {
  if (next === variant) return;
  variant = next;
  listeners.forEach((listener) => listener());
};

export const useTrackerVariant = () =>
  useSyncExternalStore(subscribe, snapshot, snapshot);
