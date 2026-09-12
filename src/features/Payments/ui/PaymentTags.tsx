// src/features/Payments/ui/PaymentTags.tsx
//
// The two states this epic repeats: what happened to an attempt, and where an
// installment stands.
//
// Colour is spent carefully. Four of the five transaction outcomes are worth
// noticing — the fifth, `succeeded`, is the one the borrower expects, and a
// history where every row is green is a history where nothing stands out.
// It stays green anyway here, because unlike an application status a PAYMENT
// is a thing you did with your money and "it went through" is the answer you
// came to the page for.

import type { TranslationKey } from "../../../shared/ui/i18n/dictionary";
import { useT } from "../../../shared/ui/i18n/useT";
import { StatusPill } from "../../../shared/ui/StatusPill";
import type { InstallmentStatus, PaymentStatus } from "./types";

const paymentKeys: Record<PaymentStatus, TranslationKey> = {
  succeeded: "payments.succeeded",
  pending: "payments.pending",
  failed: "payments.failed",
  refunded: "payments.refunded",
  reversed: "payments.reversed",
};

/**
 * Refunded and reversed are not failures and are not successes: money moved
 * back. Neutral is the honest colour, and the word carries the meaning.
 */
const paymentColors: Partial<Record<PaymentStatus, string>> = {
  succeeded: "success",
  pending: "processing",
  failed: "error",
};

export function PaymentStatusTag({ status }: { status: PaymentStatus }) {
  const t = useT();
  return (
    <StatusPill color={paymentColors[status]}>{t(paymentKeys[status])}</StatusPill>
  );
}

const installmentKeys: Record<InstallmentStatus, TranslationKey> = {
  paid: "schedule.paid",
  scheduled: "schedule.scheduled",
  overdue: "schedule.overdue",
};

export function InstallmentStatusTag({ status }: { status: InstallmentStatus }) {
  const t = useT();
  return (
    <StatusPill
      color={status === "paid" ? "success" : status === "overdue" ? "error" : undefined}
    >
      {t(installmentKeys[status])}
    </StatusPill>
  );
}
