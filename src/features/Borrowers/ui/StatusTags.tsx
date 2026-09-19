// src/features/Borrowers/ui/StatusTags.tsx
//
// The two states that repeat all over the back office — where an application
// has got to, and whether a borrower is on the DO NOT LOAN list.
//
// WBS story 10 asks for the list marker to be "a visible ui element", so it is
// a tag with the words on it, not a coloured dot the reader has to learn.

import { StopOutlined } from "@ant-design/icons";
import type { TranslationKey } from "../../../shared/ui/i18n/dictionary";
import { useT } from "../../../shared/ui/i18n/useT";
import { StatusPill } from "../../../shared/ui/StatusPill";
import type { ApplicationStatus, LoanStatus } from "./types";

const applicationKeys: Record<ApplicationStatus, TranslationKey> = {
  none: "application.none",
  submitted: "application.submitted",
  review: "application.review",
  pendingAction: "application.pendingAction",
  coBorrower: "application.coBorrower",
  approved: "application.approved",
  declined: "application.declined",
};

/**
 * Only the outcomes are coloured. "Submitted" and "under review" are the
 * ordinary middle of the process — colouring those too would leave a list
 * where nothing stands out because everything does.
 */
const applicationColors: Partial<Record<ApplicationStatus, string>> = {
  approved: "success",
  declined: "error",
  // Both mean "stopped until a person does something" — one waits on the
  // borrower, the other on a co-borrower.
  pendingAction: "warning",
  coBorrower: "warning",
};

export function ApplicationStatusTag({
  status,
}: {
  status: ApplicationStatus;
}) {
  const t = useT();
  // No application yet is the absence of a state, not a state.
  if (status === "none") return <StatusPill>{t("application.none")}</StatusPill>;
  return (
    <StatusPill color={applicationColors[status]}>
      {t(applicationKeys[status])}
    </StatusPill>
  );
}

const loanKeys: Record<LoanStatus, TranslationKey> = {
  funded: "loan.funded",
  repaying: "loan.repaying",
  closed: "loan.closed",
  cancelled: "loan.cancelled",
};

export function LoanStatusTag({ status }: { status: LoanStatus }) {
  const t = useT();
  return (
    /* Funded and repaying are green: money moved and is moving back. Closed is
       neutral — it ran its course. CANCELLED is neutral too and deliberately
       NOT red: WBS story 9 makes it the borrower's own right to cancel before
       the card is spent, so it is an outcome, not a failure. */
    <StatusPill
      color={status === "closed" || status === "cancelled" ? undefined : "success"}
    >
      {t(loanKeys[status])}
    </StatusPill>
  );
}

export function DoNotLoanTag() {
  const t = useT();
  return (
    <StatusPill color="error" icon={<StopOutlined />}>
      {t("doNotLoan.tag")}
    </StatusPill>
  );
}
