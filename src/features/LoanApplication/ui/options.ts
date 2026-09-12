// src/features/LoanApplication/ui/options.ts
//
// The predefined lists the WBS names, as MOCK reference data.
//
// WBS story 4: "supported values for USCIS application and application type are
// saved in the database, are predefined and NOT configurable" by the borrower.
// An Admin can change an AMOUNT when USCIS fees change — a separate story, so
// there is deliberately no UI for it here.
//
// The amount lives on the APPLICATION TYPE, because the WBS says that is what
// "defines the size of the loan".

import { useMemo } from "react";
import type { TranslationKey } from "../../../shared/ui/i18n/dictionary";
import { useT } from "../../../shared/ui/i18n/useT";

/** The USCIS form the applicant is filing. */
const uscisApplications: { value: string; key: TranslationKey }[] = [
  { value: "n-400", key: "uscis.n400" },
  { value: "i-485", key: "uscis.i485" },
  { value: "i-765", key: "uscis.i765" },
  { value: "i-130", key: "uscis.i130" },
  { value: "n-600", key: "uscis.n600" },
];

export function useUscisOptions() {
  const t = useT();
  return useMemo(
    () => uscisApplications.map(({ value, key }) => ({ value, label: t(key) })),
    [t]
  );
}

/**
 * What is being filed for, and therefore what it costs. The fee is USCIS's;
 * OPA lends exactly it.
 */
export type ApplicationType = {
  value: string;
  key: TranslationKey;
  /** The USCIS filing fee this type carries, in whole dollars. */
  amount: number;
};

export const applicationTypes: ApplicationType[] = [
  { value: "single", key: "applicationType.single", amount: 760 },
  { value: "singleReduced", key: "applicationType.singleReduced", amount: 380 },
  { value: "family2", key: "applicationType.family2", amount: 1520 },
  { value: "family3", key: "applicationType.family3", amount: 2280 },
];

export function useApplicationTypeOptions() {
  const t = useT();
  return useMemo(
    () => applicationTypes.map(({ value, key }) => ({ value, label: t(key) })),
    [t]
  );
}

export const findApplicationType = (value?: string) =>
  applicationTypes.find((type) => type.value === value);

/** WBS story 3: "select document type and upload a document". */
const documentTypes: { value: string; key: TranslationKey }[] = [
  { value: "paystub", key: "incomeDoc.paystub" },
  { value: "w2", key: "incomeDoc.w2" },
  { value: "taxReturn", key: "incomeDoc.taxReturn" },
  { value: "bankStatement", key: "incomeDoc.bankStatement" },
  { value: "employerLetter", key: "incomeDoc.employerLetter" },
];

export function useDocumentTypeOptions() {
  const t = useT();
  return useMemo(
    () => documentTypes.map(({ value, key }) => ({ value, label: t(key) })),
    [t]
  );
}

/** WBS story 7: "select how they heard about OPA". */
const heardAbout: { value: string; key: TranslationKey }[] = [
  { value: "search", key: "heardAbout.search" },
  { value: "friend", key: "heardAbout.friend" },
  { value: "community", key: "heardAbout.community" },
  { value: "attorney", key: "heardAbout.attorney" },
  { value: "social", key: "heardAbout.social" },
  { value: "other", key: "heardAbout.other" },
];

export function useHeardAboutOptions() {
  const t = useT();
  return useMemo(
    () => heardAbout.map(({ value, key }) => ({ value, label: t(key) })),
    [t]
  );
}

/**
 * WBS story 1: the package is generated from the borrower's STATE OF RESIDENCE
 * and their ROLE. The rules are pre-configured in code with no UI to change
 * them, which is exactly what this is — the shape Dev replaces with the real
 * configuration.
 *
 * Only what UNDERWRITING needs is signed here; the loan documents come after
 * approval and are not part of this epic.
 */
const commonDocuments: TranslationKey[] = [
  "doc.creditAuthorization",
  "doc.eConsent",
  "doc.privacyNotice",
];

const borrowerDocuments: TranslationKey[] = ["doc.creditScoreDisclosure"];
const coBorrowerDocuments: TranslationKey[] = ["doc.coBorrowerAcknowledgement"];

/** States whose regulators require an extra disclosure in the package. */
const stateDocuments: Record<string, TranslationKey> = {
  CA: "doc.caPrivacy",
  NY: "doc.nyDisclosure",
  TX: "doc.txDisclosure",
};

export function useDocumentPackage(state: string, role: "borrower" | "coBorrower") {
  const t = useT();
  return useMemo(() => {
    const keys = [
      ...commonDocuments,
      ...(role === "borrower" ? borrowerDocuments : coBorrowerDocuments),
    ];
    const stateDoc = stateDocuments[state];
    if (stateDoc) keys.push(stateDoc);
    return keys.map((key) => t(key));
  }, [t, state, role]);
}
