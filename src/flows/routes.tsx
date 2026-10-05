// src/flows/routes.tsx
//
// DESIGNER-OWNED. The declarative route tree: structure and navigation only.
// There is deliberately no `loader` or `guard` field — there's nowhere to put
// logic, which is what keeps this folder safe to own.
//
// /app/router.tsx consumes this tree generically and builds the real router
// from it. Adding a screen = drop a component in src/flows/<name>/ and add an
// entry here. You never touch /app.
//
// Param syntax is `:id` (readable). The bridge in /app translates it to
// TanStack's `$id` — don't write `$id` here.
//
// Epics are built one at a time. Built so far: Epic 1 — User authentication
// and profile management; Epic 2 — Users management; Epic 3 — Loan
// application; Epic 4 — Loan decisioning; Epic 5 — Manage loan; Epic 6 —
// Manage payments.

import type { ComponentType } from "react";
import LoginScreen from "./login/LoginScreen";
import RegisterScreen from "./register/RegisterScreen";
import ForgotPasswordScreen from "./forgot-password/ForgotPasswordScreen";
import ResetPasswordScreen from "./reset-password/ResetPasswordScreen";
import ProfileScreen from "./profile/ProfileScreen";
import StaffProfileScreen from "./staff-profile/StaffProfileScreen";
import StaffUsersScreen from "./staff-users/StaffUsersScreen";
import StaffBorrowersScreen from "./staff-borrowers/StaffBorrowersScreen";
import StaffApplicationsScreen from "./staff-applications/StaffApplicationsScreen";
import StaffPaymentsScreen from "./staff-payments/StaffPaymentsScreen";
import StaffLoansScreen from "./staff-loans/StaffLoansScreen";
import LoanRecordScreen from "./staff-loans/loan-details/LoanRecordScreen";
import ApplicationDetailsScreen from "./staff-applications/application-details/ApplicationDetailsScreen";
import StaffReportingScreen from "./staff-reporting/StaffReportingScreen";
import AcquisitionSourcesScreen from "./staff-acquisition/AcquisitionSourcesScreen";
import AcquisitionPartnersScreen from "./staff-acquisition/AcquisitionPartnersScreen";
import AcquisitionCampaignsScreen from "./staff-acquisition/AcquisitionCampaignsScreen";
import AcquisitionPerformanceScreen from "./staff-acquisition/AcquisitionPerformanceScreen";
import StaffDashboardScreen from "./staff-dashboard/StaffDashboardScreen";
import BorrowerDetailsScreen from "./staff-borrowers/borrower-details/BorrowerDetailsScreen";
import SetPasswordScreen from "./set-password/SetPasswordScreen";
import ApplicationStartScreen from "./application/ApplicationStartScreen";
import LoanApplicationScreen from "./application/new/LoanApplicationScreen";
import ApplicationSubmittedScreen from "./application/submitted/ApplicationSubmittedScreen";
import AdditionalInformationScreen from "./application/information/AdditionalInformationScreen";
import InviteCoBorrowerScreen from "./application/co-borrower/InviteCoBorrowerScreen";
import ContactScreen from "./contact/ContactScreen";
import LoanScreen from "./loan/LoanScreen";
import SignLoanScreen from "./loan/sign/SignLoanScreen";
import PaymentsScreen from "./payments/PaymentsScreen";
import DashboardScreen from "./dashboard/DashboardScreen";
import CoBorrowerInvitationScreen from "./invitation/CoBorrowerInvitationScreen";
import CoBorrowerApplicationScreen from "./co-application/CoBorrowerApplicationScreen";

export type FlowRoute = {
  /** "/" | "loans" | ":id". Nested under the parent's path. */
  path: string;
  /** The screen. Omit on a node that exists purely to group children. */
  component?: ComponentType;
  children?: FlowRoute[];
  /**
   * Design annotation ONLY — grouping/labels for the DevBar and the Flow Map.
   * NOT enforcement: `meta.role: "admin"` restricts nothing.
   * Real role guards are dev's, in /app.
   */
  meta?: {
    role?: string;
    flow?: string;
    label?: string;
    /** Sample values so detail routes are clickable, e.g. { id: "1001" }. */
    sampleParams?: Record<string, string>;
  };
};

export const routes: FlowRoute[] = [
  {
    path: "/",
    component: LoginScreen,
    meta: { role: "public", flow: "Authentication", label: "Sign in" },
  },
  {
    path: "register",
    component: RegisterScreen,
    meta: { role: "borrower", flow: "Authentication", label: "Create account" },
  },
  {
    path: "forgot-password",
    component: ForgotPasswordScreen,
    meta: { role: "public", flow: "Authentication", label: "Forgot password" },
  },
  {
    path: "reset-password",
    component: ResetPasswordScreen,
    meta: { role: "public", flow: "Authentication", label: "Set a new password" },
  },
  {
    path: "set-password",
    component: SetPasswordScreen,
    meta: { role: "public", flow: "Users management", label: "Set your password" },
  },
  {
    path: "profile",
    component: ProfileScreen,
    meta: { role: "borrower", flow: "Profile", label: "My profile" },
  },
  {
    path: "dashboard",
    component: DashboardScreen,
    meta: { role: "borrower", flow: "Dashboard", label: "Dashboard" },
  },
  {
    path: "application",
    component: ApplicationStartScreen,
    meta: { role: "borrower", flow: "Loan application", label: "Start an application" },
    children: [
      {
        path: "new",
        component: LoanApplicationScreen,
        meta: { role: "borrower", flow: "Loan application", label: "Application wizard" },
      },
      {
        path: "information",
        component: AdditionalInformationScreen,
        meta: {
          role: "borrower",
          flow: "Loan decisioning",
          label: "Send more information",
        },
      },
      {
        path: "co-borrower",
        component: InviteCoBorrowerScreen,
        meta: {
          role: "borrower",
          flow: "Loan application",
          label: "Invite a co-borrower",
        },
      },
      {
        path: "submitted",
        component: ApplicationSubmittedScreen,
        meta: {
          role: "borrower",
          flow: "Loan application",
          label: "Application submitted",
        },
      },
    ],
  },
  {
    path: "invitation",
    component: CoBorrowerInvitationScreen,
    meta: { role: "public", flow: "Loan application", label: "Co-borrower invitation" },
  },
  {
    path: "co-application",
    component: CoBorrowerApplicationScreen,
    meta: {
      role: "co-borrower",
      flow: "Loan application",
      label: "Co-borrower application",
    },
  },
  {
    path: "loan",
    component: LoanScreen,
    meta: { role: "borrower", flow: "Manage loan", label: "My loan" },
    children: [
      {
        path: "sign",
        component: SignLoanScreen,
        meta: { role: "borrower", flow: "Manage loan", label: "Sign the loan agreement" },
      },
    ],
  },
  {
    path: "payments",
    component: PaymentsScreen,
    meta: { role: "borrower", flow: "Manage payments", label: "My payments" },
  },
  {
    path: "contact",
    component: ContactScreen,
    meta: { role: "borrower", flow: "Loan application", label: "Contact OPA" },
  },
  {
    path: "staff",
    meta: { role: "staff" },
    children: [
      {
        path: "profile",
        component: StaffProfileScreen,
        meta: { role: "staff", flow: "Profile", label: "OPA staff profile" },
      },
      {
        path: "dashboard",
        component: StaffDashboardScreen,
        meta: { role: "staff", flow: "Admin dashboard", label: "Dashboard" },
      },
      {
        path: "users",
        component: StaffUsersScreen,
        meta: { role: "admin", flow: "Users management", label: "Users" },
      },
      {
        path: "reporting",
        component: StaffReportingScreen,
        meta: { role: "staff", flow: "Reporting audit", label: "Reporting" },
      },
      {
        path: "acquisition",
        meta: { role: "admin", flow: "Acquisition channels" },
        children: [
          {
            path: "sources",
            component: AcquisitionSourcesScreen,
            meta: { role: "admin", flow: "Acquisition channels", label: "Acquisition sources" },
          },
          {
            path: "partners",
            component: AcquisitionPartnersScreen,
            meta: { role: "admin", flow: "Acquisition channels", label: "Referral partners" },
          },
          {
            path: "campaigns",
            component: AcquisitionCampaignsScreen,
            meta: { role: "admin", flow: "Acquisition channels", label: "Marketing campaigns" },
          },
          {
            path: "performance",
            component: AcquisitionPerformanceScreen,
            meta: { role: "staff", flow: "Acquisition channels", label: "Lending performance" },
          },
        ],
      },
      {
        path: "applications",
        component: StaffApplicationsScreen,
        meta: { role: "staff", flow: "Loan decisioning", label: "Applications" },
        children: [
          {
            path: ":id",
            component: ApplicationDetailsScreen,
            meta: {
              role: "staff",
              flow: "Loan decisioning",
              label: "Application details",
              sampleParams: { id: "A-2481" },
            },
          },
        ],
      },
      {
        path: "loans",
        component: StaffLoansScreen,
        meta: { role: "staff", flow: "Manage loan", label: "Loans" },
        children: [
          {
            path: ":id",
            component: LoanRecordScreen,
            meta: {
              role: "staff",
              flow: "Manage loan",
              label: "Loan record",
              sampleParams: { id: "app_5ts3wcit" },
            },
          },
        ],
      },
      {
        path: "payments",
        component: StaffPaymentsScreen,
        meta: { role: "staff", flow: "Manage payments", label: "Payments" },
      },
      {
        path: "borrowers",
        component: StaffBorrowersScreen,
        meta: { role: "staff", flow: "Users management", label: "Borrowers" },
        children: [
          {
            path: ":id",
            component: BorrowerDetailsScreen,
            meta: {
              role: "staff",
              flow: "Users management",
              label: "Borrower details",
              sampleParams: { id: "1001" },
            },
          },
        ],
      },
    ],
  },
];
