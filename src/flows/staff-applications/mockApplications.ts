// src/flows/staff-applications/mockApplications.ts
//
// The queue, as a reviewer would meet it. Mock data only — nothing is fetched.
//
// The set is chosen to cover every state the WBS names, because a queue with
// five happy rows proves nothing: one routed by each of the automated steps,
// one waiting on the borrower, one already decided automatically, one
// overridden, and one where an integration failed rather than the applicant.

import type { ApplicationRecord } from "../../features/Applications/ui/types";

export const mockApplications: ApplicationRecord[] = [
  {
    id: "A-2481",
    status: "review",
    borrower: {
      name: "Maria Alvarez",
      email: "maria.alvarez@example.com",
      phone: "(213) 555-0101",
      state: "CA",
      checks: [
        { key: "identity", outcome: "passed", detail: "Full match", ranOn: "Sep 05, 2026" },
        { key: "ofac", outcome: "passed", detail: "No match", ranOn: "Sep 05, 2026" },
        { key: "noLend", outcome: "passed", detail: "No open application or loan", ranOn: "Sep 05, 2026" },
        { key: "credit", outcome: "review", detail: "648", ranOn: "Sep 05, 2026" },
        { key: "income", outcome: "passed", detail: "W-2 · 1 file read", ranOn: "Sep 05, 2026" },
        { key: "rules", outcome: "review", detail: "Score below the automatic-approval band" },
      ],
    },
    uscisType: "I-485 · Adjust Status / Register Permanent Residence",
    requestedAmount: 1_440,
    annualIncome: 48_000,
    submittedOn: "Sep 05, 2026",
    routedBy: "credit",
    coBorrowerRequired: false,
    documents: ["Credit authorization", "Electronic communications consent", "Privacy notice", "W-2 2025.pdf"],
    requests: [],
    audit: [
      { id: "1", on: "Sep 05, 2026 14:12", by: "System", action: "audit.submitted" },
      { id: "2", on: "Sep 05, 2026 14:13", by: "System", action: "audit.routed", reason: "Credit check" },
    ],
  },
  {
    id: "A-2479",
    status: "pendingAction",
    borrower: {
      name: "Daniel Okonkwo",
      email: "daniel.okonkwo@example.com",
      phone: "(312) 555-0148",
      state: "IL",
      checks: [
        { key: "identity", outcome: "passed", detail: "Full match", ranOn: "Sep 03, 2026" },
        { key: "ofac", outcome: "passed", detail: "No match", ranOn: "Sep 03, 2026" },
        { key: "noLend", outcome: "passed", detail: "No open application or loan", ranOn: "Sep 03, 2026" },
        { key: "credit", outcome: "passed", detail: "712", ranOn: "Sep 03, 2026" },
        { key: "income", outcome: "review", detail: "Document unreadable", ranOn: "Sep 03, 2026" },
        { key: "rules", outcome: "pending" },
      ],
    },
    uscisType: "N-400 · Application for Naturalization",
    requestedAmount: 760,
    annualIncome: 52_100,
    submittedOn: "Sep 03, 2026",
    routedBy: "income",
    coBorrowerRequired: false,
    documents: ["Credit authorization", "Electronic communications consent", "Privacy notice", "payslip.jpg"],
    requests: [
      {
        id: "r1",
        askedOn: "Sep 04, 2026",
        askedBy: "Priya Raman",
        note: "The pay stub you uploaded is too dark to read. Please send a clearer photo or a PDF of the same document.",
      },
    ],
    audit: [
      { id: "1", on: "Sep 03, 2026 09:40", by: "System", action: "audit.submitted" },
      { id: "2", on: "Sep 03, 2026 09:41", by: "System", action: "audit.routed", reason: "Income verification" },
      { id: "3", on: "Sep 04, 2026 11:02", by: "Priya Raman", action: "audit.infoRequested" },
    ],
  },
  {
    id: "A-2476",
    status: "review",
    borrower: {
      recordId: "1003",
      name: "Grace Okafor",
      email: "grace.okafor@example.com",
      phone: "(915) 555-0177",
      state: "TX",
      checks: [
        { key: "identity", outcome: "passed", detail: "Full match", ranOn: "Sep 02, 2026" },
        { key: "ofac", outcome: "passed", detail: "No match", ranOn: "Sep 02, 2026" },
        { key: "noLend", outcome: "passed", detail: "No open application or loan", ranOn: "Sep 02, 2026" },
        { key: "credit", outcome: "review", detail: "601", ranOn: "Sep 02, 2026" },
        { key: "income", outcome: "passed", detail: "1099 · 2 files read", ranOn: "Sep 02, 2026" },
        { key: "rules", outcome: "review", detail: "Co-borrower required" },
      ],
    },
    coBorrower: {
      /* The same person as borrower record 1008, because the record is where
         his details are edited and this page links to it. Two mocks that
         disagree would put a name on this page and a different one behind its
         own link. */
      recordId: "1008",
      name: "Daniel Okafor",
      email: "daniel.okafor@example.com",
      phone: "(312) 555-0190",
      state: "IL",
      checks: [
        { key: "identity", outcome: "passed", detail: "Full match", ranOn: "Sep 06, 2026" },
        { key: "ofac", outcome: "passed", detail: "No match", ranOn: "Sep 06, 2026" },
        { key: "noLend", outcome: "passed", detail: "No open application or loan", ranOn: "Sep 06, 2026" },
        { key: "credit", outcome: "passed", detail: "744", ranOn: "Sep 06, 2026" },
        { key: "income", outcome: "passed", detail: "W-2 · 1 file read", ranOn: "Sep 06, 2026" },
        { key: "rules", outcome: "passed" },
      ],
    },
    uscisType: "I-765 · Application for Employment Authorization",
    requestedAmount: 1_520,
    /*
     * Reduced twice by an underwriter, so the amount panel's change history
     * has something to show. WBS: "All changes shall be logged with the
     * previous value, updated value, user, date, and reason."
     */
    approvedAmount: 1_400,
    annualIncome: 61_400,
    submittedOn: "Sep 02, 2026",
    routedBy: "rules",
    coBorrowerRequired: true,
    documents: [
      "Credit authorization",
      "Electronic communications consent",
      "Privacy notice",
      "Co-borrower acknowledgement",
      "1099 2025.pdf",
    ],
    requests: [],
    audit: [
      { id: "1", on: "Sep 02, 2026 16:20", by: "System", action: "audit.submitted" },
      { id: "2", on: "Sep 02, 2026 16:21", by: "System", action: "audit.coBorrowerRequired" },
      { id: "3", on: "Sep 06, 2026 10:15", by: "System", action: "audit.coBorrowerCompleted" },
      {
        id: "4",
        on: "Sep 06, 2026 11:02",
        by: "Priya Raman",
        action: "audit.amountChanged",
        from: "$1,520.00",
        to: "$1,450.00",
        reason: "USCIS fee for I-765 filed with I-485 is lower",
      },
      {
        id: "5",
        on: "Sep 07, 2026 09:40",
        by: "Priya Raman",
        action: "audit.amountChanged",
        from: "$1,450.00",
        to: "$1,400.00",
        reason: "Reduced to the band the credit score supports",
      },
    ],
  },
  {
    id: "A-2470",
    status: "review",
    borrower: {
      name: "Chen Wei",
      email: "chen.wei@example.com",
      phone: "(206) 555-0134",
      state: "WA",
      checks: [
        { key: "identity", outcome: "review", detail: "Partial match on address", ranOn: "Aug 31, 2026" },
        { key: "ofac", outcome: "passed", detail: "No match", ranOn: "Aug 31, 2026" },
        { key: "noLend", outcome: "passed", detail: "No open application or loan", ranOn: "Aug 31, 2026" },
        { key: "credit", outcome: "pending" },
        { key: "income", outcome: "pending" },
        { key: "rules", outcome: "pending" },
      ],
    },
    uscisType: "I-130 · Petition for Alien Relative",
    requestedAmount: 760,
    annualIncome: 44_250,
    submittedOn: "Aug 31, 2026",
    routedBy: "identity",
    coBorrowerRequired: false,
    documents: ["Credit authorization", "Electronic communications consent", "Privacy notice", "W-2 2025.pdf"],
    requests: [],
    audit: [
      { id: "1", on: "Aug 31, 2026 08:05", by: "System", action: "audit.submitted" },
      { id: "2", on: "Aug 31, 2026 08:06", by: "System", action: "audit.routed", reason: "Identity verification" },
    ],
  },
  {
    id: "A-2468",
    status: "submitted",
    borrower: {
      name: "Aisha Rahman",
      email: "aisha.rahman@example.com",
      phone: "(718) 555-0190",
      state: "NY",
      checks: [
        { key: "identity", outcome: "passed", detail: "Full match", ranOn: "Aug 30, 2026" },
        { key: "ofac", outcome: "passed", detail: "No match", ranOn: "Aug 30, 2026" },
        { key: "noLend", outcome: "passed", detail: "No open application or loan", ranOn: "Aug 30, 2026" },
        // The WBS's technical failure: an answer about the integration, not
        // about her. It must not read as a decline.
        { key: "credit", outcome: "unavailable", detail: "Equifax did not respond", ranOn: "Aug 30, 2026" },
        { key: "income", outcome: "pending" },
        { key: "rules", outcome: "pending" },
      ],
    },
    uscisType: "N-600 · Application for Certificate of Citizenship",
    requestedAmount: 1_170,
    annualIncome: 39_800,
    submittedOn: "Aug 30, 2026",
    /*
     * Routed by the credit step, because that is the step that could not
     * answer. WBS: "Technical failures during credit check shall NOT cause the
     * application to be rejected. The application shall be resumed after the
     * issue is resolved" — resuming is a person's job, so it is in the queue
     * and it says which step is waiting. It had no Source at all, which read
     * as "nothing sent this here" on a row that plainly needs somebody.
     */
    routedBy: "credit",
    coBorrowerRequired: false,
    documents: ["Credit authorization", "Electronic communications consent", "Privacy notice", "W-2 2025.pdf"],
    requests: [],
    audit: [
      { id: "1", on: "Aug 30, 2026 13:55", by: "System", action: "audit.submitted" },
      { id: "2", on: "Aug 30, 2026 13:58", by: "System", action: "audit.checkUnavailable", reason: "Credit check" },
    ],
  },
  {
    id: "A-2455",
    status: "approved",
    borrower: {
      name: "Sofia Marquez",
      email: "sofia.marquez@example.com",
      phone: "(602) 555-0122",
      state: "AZ",
      checks: [
        { key: "identity", outcome: "passed", detail: "Full match", ranOn: "Aug 24, 2026" },
        { key: "ofac", outcome: "passed", detail: "No match", ranOn: "Aug 24, 2026" },
        { key: "noLend", outcome: "passed", detail: "No open application or loan", ranOn: "Aug 24, 2026" },
        { key: "credit", outcome: "passed", detail: "781", ranOn: "Aug 24, 2026" },
        { key: "income", outcome: "passed", detail: "W-2 · 1 file read", ranOn: "Aug 24, 2026" },
        { key: "rules", outcome: "passed", detail: "All approval criteria met" },
      ],
    },
    uscisType: "N-400 · Application for Naturalization",
    requestedAmount: 760,
    annualIncome: 57_900,
    submittedOn: "Aug 24, 2026",
    coBorrowerRequired: false,
    documents: ["Credit authorization", "Electronic communications consent", "Privacy notice", "W-2 2025.pdf"],
    requests: [],
    decision: { outcome: "approved", source: "automated", by: "System", on: "Aug 24, 2026 15:31" },
    audit: [
      { id: "1", on: "Aug 24, 2026 15:29", by: "System", action: "audit.submitted" },
      { id: "2", on: "Aug 24, 2026 15:31", by: "System", action: "audit.approvedAuto" },
    ],
  },
  {
    id: "A-2441",
    status: "declined",
    borrower: {
      name: "Tomas Rivera",
      email: "tomas.rivera@example.com",
      phone: "(505) 555-0111",
      state: "NM",
      checks: [
        { key: "identity", outcome: "passed", detail: "Full match", ranOn: "Aug 18, 2026" },
        { key: "ofac", outcome: "passed", detail: "No match", ranOn: "Aug 18, 2026" },
        { key: "noLend", outcome: "failed", detail: "Denied application within the last 6 months", ranOn: "Aug 18, 2026" },
        { key: "credit", outcome: "pending" },
        { key: "income", outcome: "pending" },
        { key: "rules", outcome: "failed", detail: "NO LEND list" },
      ],
    },
    uscisType: "I-485 · Adjust Status / Register Permanent Residence",
    requestedAmount: 1_440,
    annualIncome: 46_500,
    approvedAmount: undefined,
    submittedOn: "Aug 18, 2026",
    coBorrowerRequired: false,
    documents: ["Credit authorization", "Electronic communications consent", "Privacy notice"],
    requests: [],
    decision: {
      outcome: "declined",
      source: "override",
      reason: "Automated decline confirmed after manual review of the NO LEND match.",
      by: "Priya Raman",
      on: "Aug 19, 2026 09:12",
    },
    audit: [
      { id: "1", on: "Aug 18, 2026 11:02", by: "System", action: "audit.submitted" },
      { id: "2", on: "Aug 18, 2026 11:03", by: "System", action: "audit.declinedAuto", reason: "NO LEND list" },
      {
        id: "3",
        on: "Aug 19, 2026 09:12",
        by: "Priya Raman",
        action: "audit.overridden",
        from: "Declined (automated)",
        to: "Declined (manual)",
        reason: "Automated decline confirmed after manual review of the NO LEND match.",
      },
    ],
  },
];
