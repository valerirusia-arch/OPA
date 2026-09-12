// src/flows/staff-payments/mockStaffPayments.ts
//
// The back office's payments list, flattened out of the borrower records.
//
// WBS stories 14 and 15 are worded per borrower — "the repayment schedule",
// "all... payment transactions" — but the wireframe draws them as ONE table
// across every borrower, with a Borrower column and a "Filter by borrower"
// box. So the rows come from the same `loan.payments` the borrower's own
// record holds; there is no second set of numbers to disagree with the first.

import { mockBorrowers } from "../staff-borrowers/mockBorrowers";
import { fullName } from "../../features/Borrowers/ui/types";
import type { Installment, PaymentTransaction } from "../../features/Payments/ui/types";

/** Every scheduled installment in the book, oldest first. */
export const allInstallments: Installment[] = mockBorrowers.flatMap((borrower) => {
  const payments = borrower.loan?.payments;
  if (!payments) return [];
  const name = fullName(borrower.profile);
  return payments.schedule.map((row) => ({
    ...row,
    // Prefixed: two borrowers both have an "i1", and a table needs one key.
    id: `${borrower.id}-${row.id}`,
    borrower: name,
  }));
});

/** Every attempt, newest first. */
export const allTransactions: PaymentTransaction[] = mockBorrowers.flatMap((borrower) => {
  const payments = borrower.loan?.payments;
  if (!payments) return [];
  const name = fullName(borrower.profile);
  return payments.history.map((row) => ({
    ...row,
    id: `${borrower.id}-${row.id}`,
    borrower: name,
  }));
});

/** The names the filter offers: only borrowers who have a schedule. */
export const payingBorrowers: string[] = mockBorrowers
  .filter((borrower) => borrower.loan?.payments)
  .map((borrower) => fullName(borrower.profile));
