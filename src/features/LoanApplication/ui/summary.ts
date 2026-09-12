// src/features/LoanApplication/ui/summary.ts
//
// Everything the applicant answered, grouped by the step that asked for it.
//
// Built here rather than in each wizard because both wizards submit the same
// facts and neither should be free to describe them differently — a borrower
// and a co-borrower reviewing their own application should recognise the same
// list, in the same words.
//
// Presentation only: it formats values that already exist in the screen's
// state. Nothing is fetched, and nothing is derived that the applicant has not
// already been shown on the step it came from.

import { useT } from "../../../shared/ui/i18n/useT";
import type { ReviewSection } from "./ReviewStep";
import {
  findApplicationType,
  useDocumentTypeOptions,
  useUscisOptions,
} from "./options";
import type {
  CardToken,
  CoBorrowerInvitation,
  HouseholdValues,
  IncomeValues,
  LoanDetailsValues,
} from "./types";

export type ReviewInput = {
  /** Which wizard step each section returns to. */
  steps: {
    income: number;
    /** Omitted for a co-borrower: they did not choose the loan. */
    loan?: number;
    coBorrower?: number;
    sign: number;
    card: number;
    household: number;
  };
  income?: IncomeValues;
  loan?: LoanDetailsValues;
  invitation?: CoBorrowerInvitation;
  signedOn?: string;
  card?: CardToken;
  household?: HouseholdValues;
};

const money = (amount: number) =>
  `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

export function useApplicationReview({
  steps,
  income,
  loan,
  invitation,
  signedOn,
  card,
  household,
}: ReviewInput): ReviewSection[] {
  const t = useT();
  const uscis = useUscisOptions();
  const documentTypes = useDocumentTypeOptions();
  const missing = t("summary.notProvided");

  const fileCount = income?.documents?.length ?? 0;
  const docType =
    documentTypes.find((option) => option.value === income?.documentType)?.label;
  const files =
    fileCount === 1
      ? t("review.file", { count: fileCount })
      : t("review.files", { count: fileCount });
  const proofOfIncome = docType ? (fileCount ? `${docType} · ${files}` : docType) : missing;
  const type = findApplicationType(loan?.applicationType);
  const sections: ReviewSection[] = [];

  // The sections run in the order the steps were walked, so checking the
  // summary is re-reading the application rather than matching it up against a
  // different arrangement of the same answers.
  sections.push({
    key: "income",
    title: t("review.sectionIncome"),
    step: steps.income,
    rows: [
      {
        key: "annual",
        label: t("income.annual"),
        value: income?.annualIncome ? money(income.annualIncome) : missing,
      },
      {
        // The type and the count are one fact about one upload, so they are
        // one row: "W-2 · 1 file" rather than two lines to join up.
        key: "proof",
        label: t("review.proof"),
        value: proofOfIncome,
      },
    ],
  });

  // Only for the wizard that chose it: a co-borrower did not pick the loan.
  if (steps.loan !== undefined) {
    sections.push({
      key: "loan",
      title: t("review.sectionLoan"),
      step: steps.loan,
      rows: [
        {
          key: "uscis",
          label: t("review.uscis"),
          // The label, not the stored value: "i-485" is the database's word
          // for it, and the borrower chose "I-485 — Adjust Status".
          value: uscis.find((o) => o.value === loan?.uscisApplication)?.label ?? missing,
        },
        {
          key: "type",
          label: t("loanDetails.type"),
          value: type ? t(type.key) : missing,
        },
        {
          key: "amount",
          label: t("summary.loanAmount"),
          value: type ? money(type.amount) : missing,
          // The one figure being agreed to; everything else is a fact.
          emphasis: true,
        },
      ],
    });
  }

  if (steps.coBorrower !== undefined) {
    sections.push({
      key: "coBorrower",
      title: t("review.sectionCoBorrower"),
      step: steps.coBorrower,
      rows: invitation
        ? [
            {
              key: "name",
              label: t("review.name"),
              value: `${invitation.firstName} ${invitation.lastName}`,
            },
            { key: "email", label: t("field.email"), value: invitation.email },
            {
              key: "status",
              label: t("review.status"),
              value: t(`invitation.${invitation.status}`),
            },
          ]
        // No label: the section is already called "Co-borrower".
        : [{ key: "none", value: t("review.noCoBorrower") }],
    });
  }

  sections.push(
    {
      key: "documents",
      title: t("review.sectionDocuments"),
      step: steps.sign,
      // Once they are signed there is nothing left to change on that step.
      readOnly: Boolean(signedOn),
      // One fact, and it says what it is — so no label to repeat it.
      rows: [
        {
          key: "signed",
          value: signedOn
            ? t("review.signedVia", { date: signedOn })
            : t("review.notSigned"),
        },
      ],
    },
    {
      key: "card",
      title: t("review.sectionCard"),
      step: steps.card,
      // Brand, last four and expiry are how anybody identifies their own card,
      // and they are read together — so they are written together.
      rows: [
        {
          key: "card",
          value: card
            ? t("review.cardLine", {
                brand: card.brand,
                last4: card.last4,
                exp: card.expiry,
              })
            : missing,
        },
      ],
    },
    {
      key: "household",
      title: t("review.sectionHousehold"),
      step: steps.household,
      rows: [
        {
          key: "income",
          label: t("submitStep.householdIncome"),
          value: household?.householdIncome ? money(household.householdIncome) : missing,
        },
        {
          key: "size",
          label: t("submitStep.householdSize"),
          value: household?.householdSize ? String(household.householdSize) : missing,
        },
        {
          key: "veteran",
          label: t("submitStep.veteran"),
          // `false` is an answer, so it is checked against undefined, not
          // truthiness — "no, I am not a veteran" must not read as blank.
          value:
            household?.veteran === undefined
              ? missing
              : household.veteran
                ? t("common.yes")
                : t("common.no"),
        },
      ],
    }
  );

  return sections;
}
