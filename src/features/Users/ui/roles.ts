// src/features/Users/ui/roles.ts
//
// The internal roles the WBS names, as MOCK reference data.
//
// "Admin / Underwriter / OPA Staff" is the cast the WBS uses throughout the
// document; these are the same three, worded for the interface. What each one
// is allowed to do is enforced by Dev in /app — here a role is only a label.

import { useMemo } from "react";
import type { TranslationKey } from "../../../shared/ui/i18n/dictionary";
import { useT } from "../../../shared/ui/i18n/useT";

export type UserRole = "admin" | "underwriter" | "staff";
/** WBS: "withdraw and reinstate access to the system for any user". */
export type UserStatus = "active" | "inactive";
/** Whether the invited user has followed their set-password link yet. */
export type PasswordState = "set" | "pending";

const roleKeys: Record<UserRole, TranslationKey> = {
  admin: "role.admin",
  underwriter: "role.underwriter",
  staff: "role.staff",
};

const order: UserRole[] = ["admin", "underwriter", "staff"];

export function useRoleLabel() {
  const t = useT();
  return (role: UserRole) => t(roleKeys[role]);
}

/**
 * OPA Staff carries its own note: it is the one role that only reads, and an
 * Admin picking from a list of three deserves to know that before saving.
 */
export function useRoleOptions() {
  const t = useT();
  return useMemo(
    () =>
      order.map((role) => ({
        value: role,
        label:
          role === "staff"
            ? `${t(roleKeys[role])} (${t("role.staffHint")})`
            : t(roleKeys[role]),
      })),
    [t]
  );
}
