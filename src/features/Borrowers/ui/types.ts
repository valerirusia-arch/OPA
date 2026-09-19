// src/features/Borrowers/ui/types.ts
//
// The shape the back office reads a borrower in.
//
// WBS, "View borrower details": "review all available borrower, co-borrower,
// application and loan information" — which is why this is four parts and not
// one flat record. A borrower with no application yet has neither an
// application nor a loan, and that is a normal state, not missing data.
//
// This is a PRESENTATION contract, owned by the screens that render it. Dev's
// models stay in /models and are adapted onto these props at integration.

import { ALL } from "../../../shared/ui/FacetFilters";
import type { LoanComment, LoanDocument } from "../../Loan/ui/types";
import type { Installment, PaymentTransaction } from "../../Payments/ui/types";

/**
 * WBS, "View application status and details": "Submitted, Under Review,
 * Pending action, Approved, declined".
 *
 * Plus the two the flow needs and the list above does not name: `none` for a
 * borrower who has not applied, and `coBorrower` for an application the rules
 * have stopped until a co-borrower finishes their part.
 *
 * One vocabulary for the whole product. The borrower list and the underwriting
 * queue show the same word for the same state because they read it from here.
 */
export type ApplicationStatus =
  | "none"
  | "submitted"
  | "review"
  | "pendingAction"
  | "coBorrower"
  | "approved"
  | "declined";

/**
 * WHAT STATE A LOAN IS IN, back office side.
 *
 * `cancelled` was missing and the WBS needs it twice over. Story 9: "Borrower
 * shall be able to cancel an approved loan before the virtual payment card has
 * been used" — so it is a state a loan really reaches, and the borrower's own
 * side has carried it since Epic 5 (`LoanStage`). Story 10: internal users
 * "shall be able to review ALL loan information" — and a loan that has been
 * cancelled is loan information. Without it the back office simply lost those
 * loans: not in the list, not in the filter, nowhere to open.
 */
export type LoanStatus = "funded" | "repaying" | "closed" | "cancelled";

export type BorrowerProfile = {
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  /** Masked. The full number is never shown in the back office. */
  ssn: string;
  country: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  communication: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  identityVerified: boolean;
};

/**
 * How the borrower says they heard about OPA, and how the SYSTEM classified
 * the loan, are two different things and both exist in the WBS.
 *
 * `BorrowerApplication.referral` is the borrower's own answer to Loan
 * Application story 7's question. `BorrowerLoan.acquisition` is assigned by
 * the system "by URL parameters / referral code" and is what reporting counts.
 * They can disagree, and neither is the other's source.
 */
export type BorrowerApplication = {
  status: Exclude<ApplicationStatus, "none">;
  uscisType: string;
  loanAmount: string;
  annualIncome: string;
  incomeDocUploaded: boolean;
  coBorrowerRequired: boolean;
  docsSigned: boolean;
  householdSize: number;
  submitted: string;
  referral: string;
};

/*
 * There is no CoBorrower TYPE, and that is the point.
 *
 * There used to be: six fields — name, relationship, email, phone, identity —
 * embedded in the borrower who invited them. It made a co-borrower a property
 * of one borrower's record, and three things in the WBS say they are not:
 *
 *   "Manage borrower accounts — Admin/Underwriter shall be able to manually
 *    update BORROWER/CO-BORROWER personal data" — so they must be editable,
 *    and a sub-record of somebody else's file had nowhere to be edited.
 *   "View the list of BORROWER/CO-BORROWERS" — so they are a row in that list.
 *   "The system shall allow a co-borrower to CREATE A PERSONAL ACCOUNT" — so
 *    they have one, with everything an account carries.
 *
 * And the cap settles it: "Co-borrowers can sponsor up to 3 borrowers." One
 * person co-signing three applications would have been three copies of the
 * same six fields, each separately editable and free to disagree.
 *
 * So a co-borrower IS a Borrower record, and the role is a link between two of
 * them on one application — `Borrower.coBorrowerId` below.
 */

export type BorrowerLoan = {
  /**
   * The loan's own reference, as the internal detail page shows it next to the
   * borrower's name ("Loan ID app_5ts3wcit"). Not the application's id: an
   * application becomes a loan, and support is asked about one or the other.
   */
  loanId: string;
  status: LoanStatus;
  amount: string;
  rate: string;
  /** WBS story 8's "repayment terms", as one line: "12 months · $63.68/mo". */
  repaymentTerms: string;
  /** When repayment opens. Manage Payments story 1 sets it. */
  repaymentStartsOn: string;
  agreementSigned: boolean;
  /** Masked, same as the SSN. */
  virtualCard: string;
  /** Whether the virtual card has been spent against. Manage Loan story 9. */
  virtualCardUsed?: boolean;
  debitCard: string;
  /**
   * The generated package and whether each part is signed.
   *
   * The internal wireframe summarises it as a row of chips above the document
   * table, which answers "is this loan executed" without reading ten rows.
   */
  package?: { key: string; name: string; signed: boolean }[];
  /**
   * WBS story 10 — internal users review "all loan information, FUNDING
   * STATUS and RELATED DOCUMENTS". The first was already here; these two are
   * the rest of that sentence.
   */
  fundedOn?: string;
  documents: LoanDocument[];
  /** WBS story 11: comments an Admin or Underwriter added. */
  comments: LoanComment[];
  /**
   * Where the loan came from.
   *
   * NOT this epic — it belongs to **Acquisition Channels, Referrals &
   * Campaign Management**, whose story "Associate Loans with Acquisition
   * Information" says the system "shall associate each loan with the
   * corresponding acquisition source, referral partner, partner group, and
   * marketing campaign". It lives on the loan because that is what the story
   * attaches it to, and the loan record displays it because "View Acquisition
   * Information for Loans" says so.
   *
   * THREE FIELDS, NOT FOUR. The WBS's own display note is "the acquisition
   * attributes available for display: campaign, partner, acquisition source.
   * Visible for admin/underwriter." Partner group is associated and reported
   * on, never shown here.
   *
   * Absent on a loan nobody tracked, which is a normal state and has its own
   * empty line on the record.
   */
  acquisition?: {
    source: string;
    referralPartner: string;
    campaign: string;
  };
  /**
   * Manage Payments stories 14 and 15 — the internal read of the repayment
   * schedule ("including... any fees applied") and of the payment history.
   *
   * Absent until the loan is funded, because WBS story 1 generates the
   * schedule ON FUNDING and there is nothing to show before that.
   */
  payments?: {
    schedule: Installment[];
    history: PaymentTransaction[];
  };
};

export type Borrower = {
  id: string;
  /**
   * WBS story 9 — "withdraw and reinstate access to the system for ANY user".
   * That includes borrowers, not only the internal accounts, so a borrower's
   * record carries the same state the users list shows.
   */
  active: boolean;
  profile: BorrowerProfile;
  application?: BorrowerApplication;
  /**
   * WHO CO-SIGNS THIS BORROWER'S APPLICATION — another borrower record's id.
   *
   * The role is per application, not a property of a person: whoever starts an
   * application is its borrower, whoever they invite is its co-borrower, and
   * the same person can be both on different applications. So this is a link,
   * not a nested record, and the co-borrower's own file is where their details
   * are read and changed.
   */
  coBorrowerId?: string;
  loan?: BorrowerLoan;
  /** WBS story 10 — the marker, and what the list filters on. */
  doNotLoan: boolean;
};

export const fullName = (person: { firstName: string; lastName: string }) =>
  `${person.firstName} ${person.lastName}`;

// The "no filter" value moved to the shared facet control, which is where it
// is used. Re-exported so the borrower screens keep importing it from here.
export { ALL };

/** What the borrower list is currently filtered by. */
export type BorrowerFilterValues = {
  state: string;
  status: string;
  flag: string;
};

export const emptyBorrowerFilters: BorrowerFilterValues = {
  state: ALL,
  status: ALL,
  flag: ALL,
};
