// src/flows/staff-loans/mockStaffLoans.ts
//
// The back office's loan book, flattened out of the borrower records.
//
// One source: a loan on this list is the same object the borrower's own record
// holds, so opening it from either side shows the same figures. The list adds
// only the borrower's name and email, which is what the wireframe's search
// box matches on.

import { mockBorrowers } from "../staff-borrowers/mockBorrowers";
import { fullName } from "../../features/Borrowers/ui/types";
import type { Borrower, BorrowerLoan } from "../../features/Borrowers/ui/types";

export type LoanRow = {
  loan: BorrowerLoan;
  borrowerId: string;
  borrowerName: string;
  borrowerEmail: string;
};

/** Every loan in the book. A borrower without one is simply not here. */
export const allLoans: LoanRow[] = mockBorrowers
  .filter((borrower): borrower is Borrower & { loan: BorrowerLoan } =>
    borrower.loan !== undefined
  )
  .map((borrower) => ({
    loan: borrower.loan,
    borrowerId: borrower.id,
    borrowerName: fullName(borrower.profile),
    borrowerEmail: borrower.profile.email,
  }));
