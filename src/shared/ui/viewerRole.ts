// src/shared/ui/viewerRole.ts
//
// Whose eyes the prototype is currently being viewed through.
//
// Five people use this product and none of them sees the same thing. The WBS
// gives Admin, Underwriter and OPA Staff genuinely different back-office
// screens — an Underwriter never sees the internal-users list at all, OPA
// Staff reads a borrower's record but cannot act on it. And on the customer
// side a Borrower and a Co-borrower fill in DIFFERENT applications: six steps
// against five, an optional income upload against a required one.
//
// A prototype that always renders one of them hides most of the design, so who
// you are is switchable from the DevBar and every screen reads it.
//
// PREVIEW PLUMBING, not product state. It is the same category as the
// light/dark switch in src/theme/themeMode.ts: a designer-owned control over
// what is rendered, with no data, no store and no logic behind it. It uses a
// module-level value plus useSyncExternalStore rather than a context so that
// no provider has to be mounted — which would mean editing /app, and adding a
// screen must never require that.
//
// During integration Dev replaces the reads with the signed-in user's real
// role and deletes this file; the screens' `viewerRole` prop does not change.

import { useSyncExternalStore } from "react";

/** The three internal roles. Only these ever reach a back-office screen. */
export type StaffRole = "admin" | "underwriter" | "staff";
/** The two customer-side ones. */
export type BorrowerRole = "borrower" | "coBorrower";
export type ViewerRole = StaffRole | BorrowerRole;

/** A name per role, so switching is visible in the top bar too. */
const identities: Record<ViewerRole, string> = {
  admin: "Maria Alvarez",
  underwriter: "Priya Raman",
  staff: "Devon Marsh",
  borrower: "Levi Ackerman",
  coBorrower: "Daniel Okafor",
};

export const isStaffRole = (role: ViewerRole): role is StaffRole =>
  role === "admin" || role === "underwriter" || role === "staff";

const STORAGE_KEY = "opa.viewAs";

const isRole = (value: unknown): value is ViewerRole =>
  typeof value === "string" && value in identities;

/**
 * Remembered for the tab's lifetime. Without it a reload silently drops you
 * back into the default view, which is exactly when a reviewer stops trusting
 * that the switch does anything.
 *
 * AND THE DEFAULT IS THE BORROWER. It was the Admin, which meant opening the
 * app for the first time landed in the back office — the one audience that is
 * not "a user arriving at OPA". The customer's side is where the product
 * starts, so it is where the prototype starts, at the stage `loanRecord` opens
 * on: nothing applied for yet.
 */
const restore = (): ViewerRole => {
  const stored = window.sessionStorage?.getItem(STORAGE_KEY);
  return isRole(stored) ? stored : "borrower";
};

let current: ViewerRole = restore();
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const setViewerRole = (role: ViewerRole) => {
  current = role;
  window.sessionStorage?.setItem(STORAGE_KEY, role);
  listeners.forEach((listener) => listener());
};

export const useViewerRole = (): ViewerRole =>
  useSyncExternalStore(subscribe, () => current, () => current);

/** The role plus the name the top bar shows for it. */
export function useViewer() {
  const role = useViewerRole();
  return { role, name: identities[role] };
}

/**
 * The same, narrowed for the back office.
 *
 * A back-office screen cannot render "as a borrower" — there is no such view
 * of the users list — so rather than every one of them handling a role it can
 * never show, they read this and get the Admin's view while the DevBar is
 * pointed at a customer. Switching personas navigates away from these screens
 * anyway; this only covers the frame between the two.
 */
export function useStaffViewer(): { role: StaffRole; name: string } {
  const role = useViewerRole();
  return isStaffRole(role)
    ? { role, name: identities[role] }
    : { role: "admin", name: identities.admin };
}

/**
 * The same, narrowed for the customer portal.
 *
 * The mirror of `useStaffViewer`, and for the same reason: a borrower screen
 * cannot render "as an Underwriter" — there is no such view of a repayment
 * schedule — so rather than ten screens each writing the same ternary, they
 * read this and get the Borrower's view while the DevBar is pointed at the
 * back office. Switching personas navigates away from these screens anyway;
 * this only covers the frame between the two.
 */
export function useCustomerViewer(): { role: BorrowerRole; name: string } {
  const role = useViewerRole();
  return role === "coBorrower"
    ? { role, name: identities.coBorrower }
    : { role: "borrower", name: isStaffRole(role) ? identities.borrower : identities[role] };
}

/** In the order the DevBar offers them: the two customers, then the office. */
export const VIEWER_ROLES: ViewerRole[] = [
  "borrower",
  "coBorrower",
  "admin",
  "underwriter",
  "staff",
];
