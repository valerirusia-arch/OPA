// src/features/Payments/ui/MakePaymentModal.tsx
//
// Paying, as the wireframe draws it: one dialog with TWO TABS.
//
//   Scheduled payment   — WBS story 5, "make a scheduled loan payment". An
//                         Installment select, because the borrower may owe
//                         several and has to say which one.
//   Additional payment  — WBS story 6, "an additional (catch-up or extra)
//                         payment at any time" and "repay the outstanding loan
//                         balance before the scheduled maturity date". Two
//                         radios: a custom amount, or the payoff.
//
// The tabs are the point, and they are the WBS's own division rather than a
// visual choice: story 5 and story 6 are different stories, and folding them
// into one list of four radios (as this dialog did at first) loses the
// distinction between paying what you owe this month and paying extra.
//
// PAY OFF IS NOT DEFAULTED TO. It is the largest number in the dialog, and a
// preselected radio is a suggestion. The wireframe opens on Custom amount and
// so does this.
//
// The grey line above the buttons is the wireframe's, and it is the last thing
// read before money moves: what is being charged, and to which card. WBS story
// 5's note is "payments are processed through the Repay payment gateway. Only
// U.S. debit cards are supported."
//
// THE RESULT SCREEN IS NOT IN THE WIREFRAME AND IS REQUIRED. WBS story 12:
// "view the status of each payment transaction... The story covers only THE
// CONFIRMATION DISPLAYED WITHIN THE LMS." And story 13 — "if a payment failed
// or was reversed, borrower should be able to make another attempt" — is why a
// failure ends with a way forward rather than an OK button.
//
// Dumb: the result arrives as a prop. Nothing here charges anything.

import { Alert, Button, Flex, Form, InputNumber, Radio, Result, Select, Tabs, Typography, theme } from "antd";
import { ResponsiveModal } from "../../../shared/ui/ResponsiveModal";
import { useT } from "../../../shared/ui/i18n/useT";
import { useAuthRules } from "../../Auth/ui/validation";
import { formatAmount, toAmount } from "./money";
import { getStyles, styles } from "./MakePaymentModal.styles";
import type {
  Balance,
  Installment,
  PaymentNoteKey,
  PaymentStatus,
  RepaymentCard,
} from "./types";

/** What one attempt came back as. WBS story 12's confirmation. */
export type PaymentAttempt = {
  status: PaymentStatus;
  amount: string;
  reference: string;
  noteKey?: PaymentNoteKey;
};

/** Which tab, and within "Additional" which of the two amounts. */
type PayTab = "scheduled" | "additional";
type AdditionalKind = "custom" | "payoff";

export type MakePaymentModalProps = {
  open: boolean;
  balance: Balance;
  /** Everything still owed, for the Installment select. WBS story 5. */
  installments: Installment[];
  /** The row the dialog was opened from, when it was opened from one. */
  installment?: Installment;
  /** The active repayment method. Absent means there is nothing to charge. */
  card?: RepaymentCard;
  /** Set once an attempt has returned. Until then the dialog is a form. */
  attempt?: PaymentAttempt;
  submitting?: boolean;
  onSubmit?: (amount: string) => void;
  /** WBS story 13. */
  onRetry?: () => void;
  onAddCard?: () => void;
  onClose?: () => void;
};

type FormValues = {
  tab: PayTab;
  installmentId?: string;
  kind: AdditionalKind;
  custom?: number;
};

const resultTitleKeys = {
  succeeded: "payments.resultSucceeded",
  pending: "payments.resultPending",
  failed: "payments.resultFailed",
  refunded: "payments.resultRefunded",
  reversed: "payments.resultReversed",
} as const;

export function MakePaymentModal({
  open,
  balance,
  installments,
  installment,
  card,
  attempt,
  submitting = false,
  onSubmit,
  onRetry,
  onAddCard,
  onClose,
}: MakePaymentModalProps) {
  const t = useT();
  const rules = useAuthRules();
  const { token } = theme.useToken();
  const s = getStyles(token);
  const [form] = Form.useForm<FormValues>();

  /** Only what is still owed can be chosen. WBS story 5 is "a SCHEDULED payment". */
  const unpaid = installments.filter((row) => row.status !== "paid");

  /**
   * Which line the Scheduled tab opens on.
   *
   * The passed installment is honoured ONLY if it is still payable. A stale or
   * already-paid id — a Retry from the history that points at a line since
   * settled, or the schedule changing under an open dialog — would otherwise
   * sit in the Select as a raw id ("s3"), silently swap the charged figure to
   * the whole payoff, and disable Pay with nothing said. When the passed id is
   * not payable we fall back to the next line owed, so the dialog always opens
   * ready to pay the right thing.
   */
  const payable = (id?: string) => unpaid.some((row) => row.id === id);
  const initial: FormValues = {
    tab: "scheduled",
    installmentId: payable(installment?.id) ? installment?.id : unpaid[0]?.id,
    kind: "custom",
  };

  /**
   * Every value lives in the FORM, not in a useState beside it.
   *
   * It was both for a moment, kept in step by an effect, and that is the
   * cascading-render pattern React now warns about outright. There is no need
   * for a second copy: `destroyOnHidden` unmounts this form when the dialog
   * closes, so the next open starts from `initial` again and the dialog cannot
   * remember the row it was last opened from.
   */
  const tab = (Form.useWatch("tab", form) ?? initial.tab) as PayTab;
  const installmentId = (Form.useWatch("installmentId", form) ??
    initial.installmentId) as string | undefined;
  const kind = (Form.useWatch("kind", form) ?? initial.kind) as AdditionalKind;
  const custom = Form.useWatch("custom", form) as number | undefined;

  const chosen = unpaid.find((row) => row.id === installmentId);
  const payoff = toAmount(balance.payoff);

  const amount =
    tab === "scheduled"
      ? (chosen?.amount ?? balance.payoff)
      : kind === "payoff"
        ? balance.payoff
        : formatAmount(custom ?? 0);

  /** Nothing to charge, or nothing chosen to charge for. */
  const blocked = !card || (tab === "scheduled" && chosen === undefined);

  const note = card ? (
    <div style={s.note}>
      <Typography.Text type="secondary">
        {t("payments.payingWith", {
          amount,
          brand: card.brand,
          last4: card.last4,
        })}
      </Typography.Text>
    </div>
  ) : (
    /* WBS story 7: a co-borrower who never added a card lands here. */
    <Alert
      style={styles.card}
      type="warning"
      showIcon
      title={t("payments.noCardToCharge")}
      action={<Typography.Link onClick={onAddCard}>{t("payments.addCard")}</Typography.Link>}
    />
  );

  return (
    /* A phone opens this as a bottom sheet: the Pay button lands at the foot of
       the screen, under the thumb, where a long dialog's primary action should
       be. ResponsiveModal keeps the centred dialog on desktop. */
    <ResponsiveModal
      open={open}
      title={attempt ? undefined : t("payments.payTitle")}
      onCancel={onClose}
      destroyOnHidden
      width={560}
      /* The footer is written out rather than left to Modal's okText/onOk,
         because the bottom sheet has no built-in OK/Cancel bar — one node
         renders on both surfaces. The result is its own screen, so it has no
         footer: the form's buttons would offer to pay a second time for
         something that has already gone through. */
      footer={
        attempt ? null : (
          <Flex gap={12} justify="flex-end">
            <Button size="large" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button
              type="primary"
              size="large"
              disabled={blocked}
              loading={submitting}
              onClick={() => form.submit()}
            >
              {t("payments.payAmount", { amount })}
            </Button>
          </Flex>
        )
      }
    >
      {attempt ? (
        <Result
          status={
            attempt.status === "succeeded"
              ? "success"
              : attempt.status === "failed"
                ? "error"
                : "info"
          }
          title={t(resultTitleKeys[attempt.status])}
          subTitle={
            <Flex vertical align="center" gap={4}>
              <Typography.Text style={styles.resultAmount}>{attempt.amount}</Typography.Text>
              {attempt.noteKey ? (
                <Typography.Text type="secondary">{t(attempt.noteKey)}</Typography.Text>
              ) : null}
              {/* WBS story 7's note: what OPA keeps is "the payment
                  token/reference received from Repay". This is that reference,
                  and it is what support asks for on the phone. */}
              <Typography.Text type="secondary" style={styles.reference}>
                {t("payments.reference")}: {attempt.reference}
              </Typography.Text>
            </Flex>
          }
          extra={
            <Flex gap={12} justify="center">
              {attempt.status === "failed" ? (
                <>
                  <Button type="primary" size="large" onClick={onRetry}>
                    {t("payments.retry")}
                  </Button>
                  <Button type="text" size="large" onClick={onClose}>
                    {t("common.done")}
                  </Button>
                </>
              ) : (
                <Button type="primary" size="large" onClick={onClose}>
                  {t("common.done")}
                </Button>
              )}
            </Flex>
          }
        />
      ) : (
        <Form
          form={form}
          /* Remount the form when the SET OF PAYABLE LINES changes — the demo
             dock walking the loan to another stage under an open dialog. The
             field would otherwise keep an id that is no longer an option and
             fall back to painting it raw; a remount re-applies `initial`, whose
             guard lands on a payable line. `destroyOnHidden` already covers the
             ordinary open/close, so this only bites on a live schedule change. */
          key={unpaid.map((row) => row.id).join(",")}
          layout="vertical"
          initialValues={initial}
          onFinish={() => onSubmit?.(amount)}
          style={styles.form}
        >
          {/* The tabs are a form field: which one is open decides what is
              charged, so it is part of the answer and not chrome around it. */}
          <Form.Item name="tab" style={styles.tabsItem}>
            <Tabs
              activeKey={tab}
              onChange={(key) => form.setFieldValue("tab", key as PayTab)}
              items={[
                {
                  key: "scheduled",
                  label: t("payments.tabScheduled"),
                  children: (
                    <Form.Item
                      label={t("payments.installmentLabel")}
                      name="installmentId"
                      rules={[rules.required(t("payments.installmentRequired"))]}
                      required
                    >
                      <Select
                        size="large"
                        placeholder={t("payments.installmentPlaceholder")}
                        options={unpaid.map((row) => ({
                          value: row.id,
                          label: t("payments.installmentOption", {
                            number: String(row.number),
                            due: row.due,
                            amount: row.amount,
                          }),
                        }))}
                        notFoundContent={t("payments.nothingDue")}
                      />
                    </Form.Item>
                  ),
                },
                {
                  key: "additional",
                  label: t("payments.tabAdditional"),
                  children: (
                    <>
                      <Form.Item name="kind" style={styles.kind}>
                        <Radio.Group
                          onChange={(event) =>
                            form.setFieldValue("kind", event.target.value as AdditionalKind)
                          }
                        >
                          <Flex vertical gap={8}>
                            <Radio value="custom">{t("payments.choiceOther")}</Radio>
                            <Radio value="payoff">
                              {t("payments.choicePayoff", { payoff: balance.payoff })}
                            </Radio>
                          </Flex>
                        </Radio.Group>
                      </Form.Item>

                      {kind === "custom" ? (
                        <Form.Item
                          label={t("payments.otherLabel")}
                          name="custom"
                          /* `amount`, not `required`: zero is not a blank, and
                             a payment of nothing is the one figure this field
                             must never accept. */
                          rules={[
                            rules.amount(t("payments.otherRequired")),
                            {
                              validator: (_rule, value: number) =>
                                typeof value === "number" && value > payoff
                                  ? Promise.reject(
                                      new Error(
                                        t("payments.otherTooMuch", { payoff: balance.payoff })
                                      )
                                    )
                                  : Promise.resolve(),
                            },
                          ]}
                          required
                        >
                          <InputNumber<number>
                            size="large"
                            style={styles.input}
                            min={0}
                            precision={2}
                            prefix="$"
                            controls={false}
                            placeholder="0.00"
                          />
                        </Form.Item>
                      ) : null}
                    </>
                  ),
                },
              ]}
            />
          </Form.Item>

          {note}
        </Form>
      )}
    </ResponsiveModal>
  );
}

export default MakePaymentModal;
