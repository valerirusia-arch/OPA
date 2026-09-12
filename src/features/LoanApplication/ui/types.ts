// src/features/LoanApplication/ui/types.ts
//
// The presentation contract for a loan application, taken from the WBS's own
// vocabulary. Owned by the screens that render it; Dev adapts /models onto it.

/** WBS story 9: "the system shall track the invitation status". */
export type InvitationStatus = "none" | "pending" | "accepted" | "expired";

export type CoBorrowerInvitation = {
  firstName: string;
  lastName: string;
  email: string;
  status: Exclude<InvitationStatus, "none">;
  /** WBS: an invitation expires 5 calendar days after it is sent. */
  expiresOn: string;
};

export type IncomeValues = {
  annualIncome: number;
  documentType?: string;
  /** File names only — the prototype never uploads anything. */
  documents: string[];
};

export type LoanDetailsValues = {
  /** WBS: "their USCIS application (single select from predefined values)". */
  uscisApplication?: string;
  /** WBS: "the application type, which defines the size of the loan". */
  applicationType?: string;
};

/** WBS story 7: what is asked for at the very end. */
export type HouseholdValues = {
  householdIncome: number;
  householdSize?: number;
  veteran?: boolean;
  heardAbout?: string;
};

/**
 * WBS story 6: OPA never holds the card, only the token Repay returns.
 *
 * Brand, last four and the expiry are what a processor hands back and what a
 * borrower needs to recognise their own card. The number, the CVV and the
 * name never appear here, because they never reach OPA.
 */
export type CardToken = {
  brand: string;
  last4: string;
  /** MM/YY, as printed on the card. */
  expiry: string;
};
