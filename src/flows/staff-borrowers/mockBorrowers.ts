// src/flows/staff-borrowers/mockBorrowers.ts
//
// The borrowers the prototype is populated with. Designer-owned mock data:
// the list screen and the detail screen read the same set, so a row you click
// in one opens the record you expected in the other.
//
// The spread is deliberate — every state the WBS names appears at least once:
// no application, submitted, under review, co-borrower required, approved,
// declined, a funded loan, and one borrower on the DO NOT LOAN list.
//
// Two of the addresses are deliberately long. A prototype whose sample data
// all fits neatly never shows what happens when it does not, and the answer
// here — cut with an ellipsis, full value on hover — is worth being able to
// see rather than take on trust.

import type { Borrower } from "../../features/Borrowers/ui/types";
import type { Installment } from "../../features/Payments/ui/types";

/**
 * A $760.00 loan at 1% APR over 12 months comes to $63.68 a month, with the
 * last line carrying the rounding. Both funded loans below are that size.
 *
 * WBS Manage Payments story 1 fixes the dates: "repayment begins within 45
 * days after the loan is approved, with payments due on the 1st of each
 * month", so the first line is the first of the month after that window.
 */
const INSTALLMENT = "$63.68";
const LAST_INSTALLMENT = "$63.64";

/**
 * @param from   the month the first payment falls in, e.g. "01 Oct 2026"
 * @param months twelve dates, in order
 * @param paid   how many lines have been paid
 * @param overdue how many of the rest are past due
 * @param fees   the fee on each overdue line, oldest first. A line missed
 *               fewer than 16 days ago has NOT been charged yet, so a short
 *               list is the point rather than an omission.
 */
const buildSchedule = (
  months: string[],
  paid: number,
  overdue = 0,
  fees: string[] = []
): Installment[] =>
  months.map((due, index) => ({
    id: `i${index + 1}`,
    number: index + 1,
    due,
    amount: index === months.length - 1 ? LAST_INSTALLMENT : INSTALLMENT,
    status: index < paid ? "paid" : index < paid + overdue ? "overdue" : "scheduled",
    ...(index >= paid && index < paid + overdue && fees[index - paid]
      ? { fee: fees[index - paid] }
      : null),
  }));

/** 1001: funded 14 Aug 2026, so repayment opens on 01 Oct 2026. */
const MONTHS_1001 = [
  "01 Oct 2026", "01 Nov 2026", "01 Dec 2026", "01 Jan 2027",
  "01 Feb 2027", "01 Mar 2027", "01 Apr 2027", "01 May 2027",
  "01 Jun 2027", "01 Jul 2027", "01 Aug 2027", "01 Sep 2027",
];

/** 1007: funded 02 Jun 2026, so repayment opened on 01 Aug 2026. */
const MONTHS_1007 = [
  "01 Aug 2026", "01 Sep 2026", "01 Oct 2026", "01 Nov 2026",
  "01 Dec 2026", "01 Jan 2027", "01 Feb 2027", "01 Mar 2027",
  "01 Apr 2027", "01 May 2027", "01 Jun 2027", "01 Jul 2027",
];

export const mockBorrowers: Borrower[] = [
  {
    id: "1001",
    active: true,
    doNotLoan: false,
    profile: {
      firstName: "Maria",
      middleName: "Elena",
      lastName: "Gonzalez",
      dateOfBirth: "14 May 1990",
      ssn: "•••-••-2602",
      country: "Mexico",
      email: "maria.gonzalez@example.com",
      phone: "(213) 555-0101",
      street: "712 Cesar Chavez Avenue, Apt 4B",
      city: "Los Angeles",
      state: "CA",
      zip: "90033",
      communication: "Email",
      emailVerified: true,
      phoneVerified: true,
      identityVerified: true,
    },
    application: {
      status: "approved",
      uscisType: "N-400",
      loanAmount: "$760.00",
      annualIncome: "$48,000.00",
      incomeDocUploaded: true,
      coBorrowerRequired: false,
      docsSigned: true,
      householdSize: 3,
      submitted: "11 Aug 2026",
      referral: "Community organization",
    },
    loan: {
      loanId: "app_5ts3wcit",
      status: "funded",
      amount: "$760.00",
      rate: "1.00%",
      // $760.00 at 1% APR over 12 months, the same arithmetic the schedule
      // below is built from.
      repaymentTerms: "12 months · $63.68/mo",
      repaymentStartsOn: "01 Oct 2026",
      agreementSigned: true,
      virtualCard: "•••• 2602",
      virtualCardUsed: true,
      debitCard: "•••• 4417",
      fundedOn: "14 Aug 2026",
      package: [
        { key: "agreement", name: "Loan agreement", signed: true },
        { key: "state", name: "State-specific disclosures", signed: true },
        { key: "underwriting", name: "Underwriting documents", signed: true },
      ],
      documents: [
        { id: "l0", name: "Pay stub - June.pdf", type: "income", on: "11 Aug 2026", uploadedBy: "Maria Gonzalez" },
        { id: "l1", name: "Loan agreement.pdf", type: "loan_agreement", on: "13 Aug 2026", executed: true, uploadedBy: "system" },
        { id: "l2", name: "Truth in Lending disclosure.pdf", type: "disclosure", on: "13 Aug 2026", executed: true, uploadedBy: "system" },
      ],
      comments: [
        {
          id: "c1",
          on: "14 Aug 2026 10:20",
          by: "Priya Raman",
          text: "Funded on the same day the agreement came back signed. Nothing outstanding.",
        },
      ],
      /* WBS story 1: the schedule is generated ON FUNDING, which means a
         freshly funded loan has a full schedule and an empty history. That is
         a normal record, and one the internal view has to read well. */
      payments: {
        schedule: buildSchedule(MONTHS_1001, 0),
        history: [],
      },
      /*
       * Tracked. Note this is NOT the same thing as the application's
       * `referral: "Community organization"` above: that is what the borrower
       * said when asked how they heard about OPA, and this is what the system
       * classified the loan as from the referral code it arrived with. The WBS
       * has both, and they are allowed to disagree.
       */
      acquisition: {
        source: "Partner referral",
        referralPartner: "Casa Legal",
        campaign: "Naturalisation drive 2026",
      },
    },
  },
  {
    id: "1002",
    active: true,
    doNotLoan: true,
    profile: {
      firstName: "Andrés",
      lastName: "Molina",
      dateOfBirth: "02 Feb 1986",
      ssn: "•••-••-8841",
      country: "Guatemala",
      email: "andres.molina@example.com",
      phone: "(646) 555-0134",
      street: "88 Roosevelt Ave",
      city: "Queens",
      state: "NY",
      zip: "11372",
      communication: "SMS",
      emailVerified: true,
      phoneVerified: false,
      identityVerified: false,
    },
    application: {
      status: "review",
      uscisType: "I-485",
      loanAmount: "$1,440.00",
      annualIncome: "$36,500.00",
      incomeDocUploaded: false,
      coBorrowerRequired: false,
      docsSigned: false,
      householdSize: 4,
      submitted: "02 Sep 2026",
      referral: "Search",
    },
  },
  {
    id: "1003",
    active: true,
    doNotLoan: false,
    profile: {
      firstName: "Grace",
      lastName: "Okafor",
      dateOfBirth: "30 Nov 1993",
      ssn: "•••-••-1177",
      country: "Nigeria",
      email: "grace.okafor@example.com",
      phone: "(312) 555-0188",
      street: "4410 North Sheridan Road, Unit 1207",
      city: "Chicago",
      state: "IL",
      zip: "60640",
      communication: "Email",
      emailVerified: true,
      phoneVerified: true,
      identityVerified: true,
    },
    application: {
      status: "coBorrower",
      uscisType: "N-400",
      loanAmount: "$760.00",
      annualIncome: "$21,800.00",
      incomeDocUploaded: true,
      coBorrowerRequired: true,
      docsSigned: false,
      householdSize: 2,
      submitted: "28 Aug 2026",
      referral: "Partner: Casa Legal",
    },
    /* Daniel Okafor co-signs this one. His details are HIS record (1008), not
       a copy kept here — see `coBorrowerId` in types. */
    coBorrowerId: "1008",
  },
  /*
   * A CO-BORROWER, AS THE WBS HAS THEM: a borrower record like any other.
   *
   * He co-signs 1003's application and has not applied for anything himself,
   * so he has an account and a profile and NO `application` — which is exactly
   * what "Accept borrower invitation (registration through the invitation) —
   * the system shall allow a co-borrower to create a personal account" leaves
   * behind. He appears in the borrower list, he opens, and Manage account
   * edits him, none of which a nested sub-record could do.
   */
  /*
   * WBS story 9's own case: approved, funded, and CANCELLED before the virtual
   * card was ever used. It exists so the state has somewhere to be seen — the
   * back office could not show a cancelled loan at all, and story 10 gives
   * internal users "all loan information".
   */
  {
    id: "1009",
    active: true,
    doNotLoan: false,
    profile: {
      firstName: "Tomas",
      lastName: "Rivera",
      dateOfBirth: "22 Sep 1987",
      ssn: "•••-••-3310",
      country: "Guatemala",
      email: "tomas.rivera@example.com",
      phone: "(602) 555-0143",
      street: "915 East Roosevelt Street",
      city: "Phoenix",
      state: "AZ",
      zip: "85006",
      communication: "SMS",
      emailVerified: true,
      phoneVerified: true,
      identityVerified: true,
    },
    application: {
      status: "approved",
      uscisType: "I-485",
      loanAmount: "$1,440.00",
      annualIncome: "$46,500.00",
      incomeDocUploaded: true,
      coBorrowerRequired: false,
      docsSigned: true,
      householdSize: 4,
      submitted: "24 Jul 2026",
      referral: "Search",
    },
    loan: {
      loanId: "app_4mn8xqz2",
      status: "cancelled",
      amount: "$1,440.00",
      rate: "1.00%",
      repaymentTerms: "12 months · $120.65/mo",
      repaymentStartsOn: "—",
      agreementSigned: true,
      virtualCard: "•••• 7781",
      /* The whole condition of story 9: cancelling is allowed only while this
         is false, and it stayed false. */
      virtualCardUsed: false,
      debitCard: "•••• 5120",
      fundedOn: "29 Jul 2026",
      documents: [
        { id: "x1", name: "Loan agreement.pdf", type: "loan_agreement", on: "28 Jul 2026", executed: true, uploadedBy: "system" },
      ],
      comments: [
        {
          id: "x2",
          on: "31 Jul 2026 09:05",
          by: "Priya Raman",
          text: "Borrower cancelled before spending the card. Nothing was drawn.",
        },
      ],
      payments: { schedule: [], history: [] },
    },
  },
  {
    id: "1008",
    active: true,
    doNotLoan: false,
    profile: {
      firstName: "Daniel",
      lastName: "Okafor",
      dateOfBirth: "07 Feb 1991",
      ssn: "•••-••-4820",
      country: "Nigeria",
      email: "daniel.okafor@example.com",
      phone: "(312) 555-0190",
      street: "4410 North Sheridan Road, Unit 1207",
      city: "Chicago",
      state: "IL",
      zip: "60640",
      communication: "Email",
      emailVerified: true,
      phoneVerified: true,
      identityVerified: true,
    },
  },
  {
    id: "1004",
    active: true,
    doNotLoan: false,
    profile: {
      firstName: "Liliana",
      lastName: "Reyes",
      dateOfBirth: "19 Jun 1997",
      ssn: "•••-••-3320",
      country: "El Salvador",
      email: "liliana.reyes@example.com",
      phone: "(915) 555-0142",
      street: "1200 Avenida Del Sol",
      city: "El Paso",
      state: "TX",
      zip: "79905",
      communication: "Email",
      emailVerified: true,
      phoneVerified: true,
      identityVerified: true,
    },
    application: {
      status: "submitted",
      uscisType: "I-765",
      loanAmount: "$520.00",
      annualIncome: "$29,400.00",
      incomeDocUploaded: true,
      coBorrowerRequired: false,
      docsSigned: false,
      householdSize: 1,
      submitted: "03 Sep 2026",
      referral: "Referral from an existing borrower",
    },
  },
  {
    id: "1005",
    active: false,
    doNotLoan: false,
    profile: {
      firstName: "Rahul",
      lastName: "Mehta",
      dateOfBirth: "08 Jan 1989",
      ssn: "•••-••-9052",
      country: "India",
      email: "rahul.mehta@example.com",
      phone: "(408) 555-0177",
      street: "355 S Winchester Blvd",
      city: "San Jose",
      state: "CA",
      zip: "95128",
      communication: "Email",
      emailVerified: true,
      phoneVerified: true,
      identityVerified: false,
    },
    application: {
      status: "declined",
      uscisType: "I-130",
      loanAmount: "$675.00",
      annualIncome: "$18,200.00",
      incomeDocUploaded: false,
      coBorrowerRequired: false,
      docsSigned: false,
      householdSize: 5,
      submitted: "21 Jul 2026",
      referral: "Search",
    },
  },
  {
    id: "1006",
    active: true,
    doNotLoan: false,
    profile: {
      firstName: "Camila",
      lastName: "Duarte",
      dateOfBirth: "23 Mar 1995",
      ssn: "•••-••-6614",
      country: "Colombia",
      email: "camila.duarte@example.com",
      phone: "(305) 555-0119",
      street: "2900 NW 7th St",
      city: "Miami",
      state: "FL",
      zip: "33125",
      communication: "SMS",
      emailVerified: false,
      phoneVerified: true,
      identityVerified: false,
    },
  },
  {
    id: "1007",
    active: true,
    doNotLoan: false,
    profile: {
      firstName: "Oleh",
      lastName: "Kravets",
      dateOfBirth: "12 Oct 1984",
      ssn: "•••-••-4408",
      country: "Ukraine",
      email: "oleh.kravets@example.com",
      phone: "(702) 555-0163",
      street: "3150 S Maryland Pkwy",
      city: "Las Vegas",
      state: "NV",
      zip: "89109",
      communication: "Email",
      emailVerified: true,
      phoneVerified: true,
      identityVerified: true,
    },
    application: {
      status: "approved",
      uscisType: "N-400",
      loanAmount: "$760.00",
      annualIncome: "$52,100.00",
      incomeDocUploaded: true,
      coBorrowerRequired: false,
      docsSigned: true,
      householdSize: 2,
      submitted: "18 May 2026",
      referral: "Campaign: Naturalisation drive",
    },
    loan: {
      loanId: "app_9kd2mrb4",
      status: "repaying",
      amount: "$760.00",
      rate: "1.00%",
      repaymentTerms: "12 months · $63.68/mo",
      repaymentStartsOn: "01 Aug 2026",
      agreementSigned: true,
      virtualCard: "•••• 7731",
      virtualCardUsed: true,
      debitCard: "•••• 1908",
      fundedOn: "02 Jun 2026",
      package: [
        { key: "agreement", name: "Loan agreement", signed: true },
        { key: "state", name: "State-specific disclosures", signed: true },
        { key: "underwriting", name: "Underwriting documents", signed: true },
      ],
      documents: [
        { id: "l1", name: "Loan agreement.pdf", type: "loan_agreement", on: "01 Jun 2026", executed: true, uploadedBy: "system" },
      ],
      comments: [],
      /*
       * Two missed payments, ONE late fee, and it is $3.18.
       *
       * This is the WBS's formula running the other way round: "$5.00 or 5% of
       * the unpaid installment amount, whichever is less." Five per cent of
       * $63.68 is $3.18, so $3.18 is the charge here, where the borrower's own
       * $120.65 installment is charged the $5.00 cap instead. Both branches of
       * the rule are in the prototype's data on purpose.
       *
       * The August line was missed 39 days ago and has its fee. The September
       * line was missed 8 days ago and has none: the fee lands on the 16th day
       * after the due date, not on the day it is missed. An internal user
       * reading a fee column of one has to be able to see that is correct.
       */
      payments: {
        schedule: buildSchedule(MONTHS_1007, 0, 2, ["$3.18"]),
        history: [
          {
            id: "p3",
            on: "01 Sep 2026",
            amount: "$63.68",
            status: "failed",
            cardLast4: "1908",
            paidBy: "borrower",
            reference: "RPY-P3-2277",
            installmentId: "i2",
            noteKey: "payments.noteDeclined",
          },
          {
            id: "p2",
            on: "03 Aug 2026",
            amount: "$63.68",
            status: "failed",
            cardLast4: "1908",
            paidBy: "borrower",
            reference: "RPY-P2-2276",
            installmentId: "i1",
            noteKey: "payments.noteInsufficient",
          },
          {
            id: "p1",
            on: "01 Aug 2026",
            amount: "$63.68",
            status: "failed",
            cardLast4: "1908",
            paidBy: "borrower",
            reference: "RPY-P1-2275",
            installmentId: "i1",
            noteKey: "payments.noteDeclined",
          },
        ],
      },
    },
  },
  {
    id: "1008",
    active: true,
    doNotLoan: false,
    profile: {
      firstName: "Ana",
      lastName: "Villalobos",
      dateOfBirth: "05 Dec 1991",
      ssn: "•••-••-2098",
      country: "Honduras",
      email: "ana.villalobos@example.com",
      phone: "(602) 555-0155",
      street: "1717 W Camelback Rd",
      city: "Phoenix",
      state: "AZ",
      zip: "85015",
      communication: "Email",
      emailVerified: true,
      phoneVerified: false,
      identityVerified: true,
    },
    application: {
      status: "review",
      uscisType: "I-485",
      loanAmount: "$1,440.00",
      annualIncome: "$33,700.00",
      incomeDocUploaded: true,
      coBorrowerRequired: false,
      docsSigned: false,
      householdSize: 3,
      submitted: "01 Sep 2026",
      referral: "Partner: Frontera Aid",
    },
  },
];
