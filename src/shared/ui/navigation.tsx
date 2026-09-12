// src/shared/ui/navigation.tsx
//
// The primary navigation for each audience.
//
// Entries without a `to` are screens whose epic hasn't been built yet — they
// render disabled instead of pointing at a route that doesn't exist. Labels
// are translation keys; the shells resolve them.

import {
  AuditOutlined,
  BankOutlined,
  BarChartOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  NodeIndexOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { ReactNode } from "react";
import type { TranslationKey } from "./i18n/dictionary";
import type { StaffRole } from "./viewerRole";

export type NavItem = {
  key: string;
  labelKey: TranslationKey;
  /** Omit while the destination's epic hasn't been built — renders disabled. */
  to?: string;
  /** Shown in the back office rail; the borrower's top bar ignores it. */
  icon?: ReactNode;
  /** A count that needs attention, e.g. applications waiting for review. */
  badge?: number;
  /** Turns the entry into a expandable group. */
  children?: NavItem[];
};

/**
 * Borrower / co-borrower portal — ONE BAR, BOTH PEOPLE.
 *
 * It briefly pointed the Application entry at /co-application for a
 * co-borrower, which was a mistake with a reason behind it: being a
 * co-borrower is a relationship to one application, not an account type, so
 * before anybody invites them they are simply a borrower and their Application
 * tab is the ordinary one. /application reads the record and shows whichever
 * is true — start one, you are invited to one, your part is done — so the
 * split had nothing left to do.
 */
export const borrowerNav: NavItem[] = [
  { key: "dashboard", labelKey: "nav.dashboard", to: "/dashboard" },
  { key: "application", labelKey: "nav.application", to: "/application" },
  { key: "loan", labelKey: "nav.loan", to: "/loan" },
  { key: "payments", labelKey: "nav.payments", to: "/payments" },
  { key: "contact", labelKey: "nav.contact", to: "/contact" },
];

/** A titled run of entries in the back-office rail. */
export type NavSection = {
  key: string;
  labelKey: TranslationKey;
  items: NavItem[];
};

/**
 * Admin / Underwriter / OPA Staff back office.
 *
 * Two groups, not eight equal rows: the work an operator does every day, and
 * the things they set up or look back on. More groups than that turns the
 * rail into a table of contents for itself.
 */
export const staffNav: NavSection[] = [
  {
    key: "operations",
    labelKey: "nav.groupOperations",
    items: [
      { key: "dashboard", labelKey: "nav.dashboard", icon: <DashboardOutlined /> },
      { key: "borrowers", labelKey: "nav.borrowers", icon: <TeamOutlined />, to: "/staff/borrowers" },
      {
        key: "review-queue",
        labelKey: "nav.reviewQueue",
        icon: <AuditOutlined />,
        to: "/staff/applications",
        // What is waiting for a decision. Mock, like every other count here.
        badge: 4,
      },
      { key: "loans", labelKey: "nav.loans", icon: <BankOutlined />, to: "/staff/loans" },
      {
        key: "payment",
        labelKey: "nav.payment",
        icon: <CreditCardOutlined />,
        to: "/staff/payments",
      },
      {
        key: "acquisition",
        labelKey: "nav.acquisition",
        icon: <NodeIndexOutlined />,
        children: [
          { key: "source", labelKey: "nav.source" },
          { key: "partners", labelKey: "nav.partners" },
          { key: "campaigns", labelKey: "nav.campaigns" },
          { key: "performance", labelKey: "nav.performance" },
        ],
      },
    ],
  },
  {
    key: "admin",
    labelKey: "nav.groupAdmin",
    items: [
      { key: "reporting", labelKey: "nav.reporting", icon: <BarChartOutlined /> },
      { key: "users", labelKey: "nav.users", icon: <UserOutlined />, to: "/staff/users" },
    ],
  },
];

/**
 * The rail for one role.
 *
 * Two entries are role-specific, and both come from the WBS's own role column
 * rather than from a judgement about seniority:
 *
 *   users        — Epic 2 story 3 gives "view admin/underwriter" to the Admin
 *                  and OPA Staff only, so an Underwriter is not offered it.
 *   review-queue — Loan Decisioning names "Underwriter / OPA Staff" on "View
 *                  application details" and Underwriter alone on every action.
 *                  ADMIN IS NOT NAMED ON A SINGLE STORY IN THAT EPIC, so the
 *                  entry is not offered to them either. Being the superuser of
 *                  Epic 2 does not carry over; the WBS grants access story by
 *                  story, and this is the same reading that keeps an
 *                  Underwriter off the Users page.
 *
 * This is navigation, not enforcement: the real restriction is a route guard,
 * and that is Dev's, in /app.
 */
const HIDDEN_FOR: Partial<Record<StaffRole, string[]>> = {
  underwriter: ["users"],
  admin: ["review-queue"],
};

export const staffNavFor = (role: StaffRole): NavSection[] => {
  const hidden = HIDDEN_FOR[role];
  if (!hidden) return staffNav;
  return staffNav.map((section) => ({
    ...section,
    items: section.items.filter((item) => !hidden.includes(item.key)),
  }));
};
