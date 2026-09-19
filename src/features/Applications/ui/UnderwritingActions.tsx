// src/features/Applications/ui/UnderwritingActions.tsx
//
// Everything an Underwriter can do to an application, in the right-hand column
// the wireframe draws for it. Five WBS stories, in the wireframe's order:
//
//   Request additional information   — inline note + Send request
//   Decline / Approve                — the decision
//   Override automated decision      — only when the rules already decided
//   Update the requested amount      — Current, New amount, Reason, and the
//                                      change history underneath
//
// WHY SOME OF THIS IS INLINE AND SOME IS A DIALOG. The wireframe puts the
// note and the amount panel on the page, and they belong there: both are
// things an underwriter composes while reading the application beside them,
// and a modal would cover the evidence they are writing about. Approve,
// Decline and Override stay dialogs, because each has to capture something
// before it happens and two of them are irreversible:
//
//   Approve  — "Approval reason and timestamp are recorded."   optional note
//   Decline  — "Decline reason is mandatory."                  REQUIRED
//   Override — "Override reason is mandatory and recorded for audit
//               purposes."                                     REQUIRED
//
// The wireframe's Decline and Approved buttons carry no reason field, which is
// the one place it is missing something the WBS requires. So they open the
// dialogs that ask.
//
// OPA STAFF SEES NONE OF THIS. The WBS: "OPA Staff has read-only access to
// application information and cannot modify application data or PERFORM
// BUSINESS ACTIONS." The column is not rendered for them rather than rendered
// and disabled — a disabled panel of five controls reads as a page that is
// waiting for something.
//
// Dumb: local form state, and every action reports out by callback.

import { Button, Collapse, Divider, Flex, Form, Input, Typography, theme } from "antd";
import { useT } from "../../../shared/ui/i18n/useT";
import { useAuthRules } from "../../Auth/ui/validation";
import { RangeField } from "../../LoanApplication/ui/RangeField";
import { ChangeHistory } from "./ChangeHistory";
import { getStyles, styles } from "./UnderwritingActions.styles";

/**
 * THE LOAN'S OWN TERMS, so the panel can say what it just did.
 *
 * Both numbers are the product's, not this screen's invention. The rate is the
 * WBS's one stated figure — "The APR remains at 1%" — and the term is the one
 * every loan in this product is written for, which is what the loan pages and
 * the schedules already show.
 *
 * Standard amortisation: the payment that clears the principal and its
 * interest in `TERM_MONTHS` equal instalments. A zero amount has no payment
 * rather than a division by zero.
 */
const APR = 0.01;
const TERM_MONTHS = 12;

const instalment = (amount: number) => {
  if (!amount) return 0;
  const monthly = APR / 12;
  return (amount * monthly) / (1 - Math.pow(1 + monthly, -TERM_MONTHS));
};
import type { AuditEntry, Decision } from "./types";

export type AmountChange = { amount: number; reason: string };

export type UnderwritingActionsProps = {
  /** What the borrower asked for, and what stands now. */
  requestedAmount: number;
  approvedAmount?: number;
  /** Set once the rules or a person has decided. Drives Override vs decide. */
  decision?: Decision;
  /** The trail, for the amount panel's change history. */
  audit: AuditEntry[];
  /** WBS: the loan amount may be changed "before the final approval decision". */
  canChangeAmount?: boolean;
  onRequestInfo?: (note: string) => void;
  onChangeAmount?: (change: AmountChange) => void;
};

const money = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD" });

export function UnderwritingActions({
  requestedAmount,
  approvedAmount,
  decision,
  audit,
  canChangeAmount = true,
  onRequestInfo,
  onChangeAmount,
}: UnderwritingActionsProps) {
  const t = useT();
  const rules = useAuthRules();
  const { token } = theme.useToken();
  const s = getStyles(token);
  const [requestForm] = Form.useForm<{ note: string }>();
  const [amountForm] = Form.useForm<{ amount: number; reason: string }>();
  /** What the field holds right now, so the terms under it move with it. */
  const nextAmount = Form.useWatch("amount", amountForm);

  const current = approvedAmount ?? requestedAmount;

  return (
    /*
      TWO QUIET ROWS, BOTH CLOSED ON ARRIVAL.

      The card is already titled "Underwriting actions"; inside it, an open
      textarea, a Send button and a second collapsible panel read as a lot of
      standing chrome for a surface an underwriter often just scans past on the
      way to a decision. *"ორივე თავიდან შეკეცილი — უფრო სუფთა."* So both actions
      are rows of ONE Collapse, closed by default: the card is two calm lines
      until the underwriter reaches for one. The decision itself (Approve /
      Decline / Override) lives in the page header, not here.
    */
    <Flex vertical gap={16}>
      {/* The one line that EXPLAINS an automated decision — context the Override
          button in the header refers to. A sentence, not a control. */}
      {decision ? (
        <Typography.Text style={styles.autoLine}>
          {t(
            decision.source === "automated"
              ? "appAction.autoDecided"
              : "appAction.alreadyDecided",
            { outcome: t(`appAction.outcome.${decision.outcome}`) }
          )}
        </Typography.Text>
      ) : null}

      <Collapse
        ghost
        style={styles.panel}
        items={[
          {
            // WBS: "Underwriter shall be able to request additional documents or
            // information from the borrower" — a required text note.
            key: "request",
            label: (
              <Typography.Text style={s.blockTitle}>
                {t("appAction.requestInfo")}
              </Typography.Text>
            ),
            children: (
              <Form
                form={requestForm}
                layout="vertical"
                validateTrigger={["onBlur", "onChange"]}
                onFinish={({ note }) => {
                  onRequestInfo?.(note);
                  requestForm.resetFields();
                }}
                style={styles.form}
              >
                <Form.Item name="note" rules={[rules.required()]} style={styles.field}>
                  <Input.TextArea rows={4} placeholder={t("requestModal.notePlaceholder")} />
                </Form.Item>
                <Button block onClick={() => requestForm.submit()}>
                  {t("requestModal.send")}
                </Button>
              </Form>
            ),
          },
          // WBS: the amount may be adjusted "BEFORE THE FINAL APPROVAL DECISION",
          // so this row is gone once a decision stands.
          ...(canChangeAmount
            ? [
                {
                  key: "amount",
                  label: (
                    <Typography.Text style={s.blockTitle}>
                      {t("appAction.editAmount")}
                    </Typography.Text>
                  ),
                  children: (
                    <Form
                      form={amountForm}
                      layout="vertical"
                      validateTrigger={["onBlur", "onChange"]}
                      initialValues={{ amount: current }}
                      onFinish={(values) => onChangeAmount?.(values)}
                      style={styles.form}
                    >
                      {/*
                        Current and new in one container: the current value is a
                        quiet line inside the field's box, above the editable
                        figure, so the box holds the whole before/after.
                      */}
                      {/* No label: the field is obviously the new amount, and
                          its own caption already reads "Currently $X". */}
                      <Form.Item name="amount" rules={[rules.amount()]}>
                        <RangeField
                          compact
                          min={0}
                          max={requestedAmount}
                          step={10}
                          prefix="$"
                          caption={t("amountPanel.currentIs", { amount: money(current) })}
                        />
                      </Form.Item>

                      {/*
                        WHAT THE BORROWER WILL ACTUALLY PAY, recalculated as the
                        figure moves.

                        WBS: "The system shall validate the updated amount,
                        RECALCULATE LOAN TERMS IF APPLICABLE, record the change
                        in the audit trail, and use the revised amount in
                        subsequent loan approval and agreement generation." The
                        panel changed the amount and said nothing about the
                        terms, so an underwriter reducing $760 to $610 could not
                        see what they had just done to the monthly instalment —
                        the one number the borrower lives with.

                        The rate and the term are the product's, not this
                        screen's: 1% APR from the WBS, over the term the loan is
                        written for. See `instalment`.
                      */}
                      <Typography.Text style={s.terms}>
                        {t("amountPanel.terms", {
                          months: String(TERM_MONTHS),
                          amount: money(instalment(nextAmount ?? current)),
                        })}
                      </Typography.Text>

                      <Form.Item
                        label={t("amountModal.reason")}
                        name="reason"
                        rules={[rules.required()]}
                        required
                        extra={t("amountModal.reasonHint")}
                      >
                        <Input placeholder={t("amountPanel.reasonPlaceholder")} />
                      </Form.Item>

                      <Button type="primary" block onClick={() => amountForm.submit()}>
                        {t("amountModal.save")}
                      </Button>

                      <Divider />
                      <Typography.Text style={s.blockTitle}>
                        {t("amountPanel.history")}
                      </Typography.Text>
                      <div style={styles.history}>
                        <ChangeHistory entries={audit} />
                      </div>
                    </Form>
                  ),
                },
              ]
            : []),
        ]}
      />
    </Flex>
  );
}

export default UnderwritingActions;
