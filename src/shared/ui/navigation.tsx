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
      { key: "dashboard", labelKey: "nav.dashboard", icon: <DashboardOutlined />, to: "/staff/dashboard" },
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
          { key: "source", labelKey: "nav.source", to: "/staff/acquisition/sources" },
          { key: "partners", labelKey: "nav.partners", to: "/staff/acquisition/partners" },
          { key: "campaigns", labelKey: "nav.campaigns", to: "/staff/acquisition/campaigns" },
          { key: "performance", labelKey: "nav.performance", to: "/staff/acquisition/performance" },
        ],
      },
    ],
  },
  {
    key: "admin",
    labelKey: "nav.groupAdmin",
    items: [
      { key: "reporting", labelKey: "nav.reporting", icon: <BarChartOutlined />, to: "/staff/reporting" },
      { key: "users", labelKey: "nav.users", icon: <UserOutlined />, to: "/staff/users" },
    ],
  },
];

/**
 * The rail for one role — each entry from the WBS's own role column, not from a
 * judgement about seniority. Hidden keys cover both top-level items and the
 * acquisition group's children:
 *
 *   users        — Epic 2 story 3 gives "view admin/underwriter" to the Admin
 *                  and OPA Staff only, so an Underwriter is not offered it.
 *   review-queue — Loan Decisioning names "Underwriter / OPA Staff" and never
 *                  the Admin, so the Admin is not offered it. Being Epic 2's
 *                  superuser does not carry over; access is granted story by
 *                  story.
 *   acquisition  — Epic 10. Manage Sources / Partners / Campaigns are Admin
 *                  ALONE; "Analyse performance" (and View/Search) add the
 *                  Underwriter; OPA Staff is on NO acquisition story. So the
 *                  Underwriter keeps only `performance` and OPA Staff loses the
 *                  whole group, which drops out when all its children are gone.
 *
 * Navigation, not enforcement: the real restriction is a route guard, Dev's in
 * /app, and each screen already draws its own 403 for a role that arrives by URL.
 */
const HIDDEN_FOR: Partial<Record<StaffRole, string[]>> = {
  underwriter: ["users", "source", "partners", "campaigns"],
  admin: ["review-queue"],
  staff: ["acquisition"],
};

export const staffNavFor = (role: StaffRole): NavSection[] => {
  const hidden = HIDDEN_FOR[role];
  if (!hidden) return staffNav;
  return staffNav.map((section) => ({
    ...section,
    items: section.items
      // Drop hidden top-level items…
      .filter((item) => !hidden.includes(item.key))
      // …thin a group's children…
      .map((item) =>
        item.children
          ? { ...item, children: item.children.filter((child) => !hidden.includes(child.key)) }
          : item
      )
      // …and drop a group left with no children.
      .filter((item) => !item.children || item.children.length > 0),
  }));
};
