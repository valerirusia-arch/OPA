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

  const current = approvedAmount ?? requestedAmount;

  return (
    /*
      NO FRAMES INSIDE THE FRAME, and the decision first.

      Each action used to sit in a bordered block of its own, inside the card
      that is already titled "Underwriting actions" — a box in a box, three
      times over, with the two buttons that end the application at the very
      bottom of the stack. *"ამ ჩარჩოში ეს კიდევ ჩარჩო არ მომწონს; ჩარჩო
      მოხსენი და მაქსიმალურად გაშალე, რომ ელემენტებმა შიგნით ისუნთქონ."*

      So the borders come off and the space does the separating: 32 between
      sections against 12 inside them, which is a wider gap than any frame was
      drawing. Each section still has its own title, which is what actually
      said "this is a thing on its own" — the outline was only repeating it.

      AND THE DECISION LEADS. Approve and Decline are what this column exists
      for; they were under a note field and a collapsed amount panel, which is
      the order the wireframe happened to list them in, not the order an
      underwriter works in. *"აფრუვი და დექლაინი შეგვიძლია მაღლა ავიტანოთ."*
    */
    <Flex vertical gap={32}>
      {/* THE DECISION LIVES IN THE CARD HEADER NOW — Decline / Approve, or
          Override once the rules have settled it — pinned to the right of the
          "Underwriting actions" title where the screen renders the Card
          (ApplicationDetailsScreen). *"ეს ღილაკები მაღლა ავიტანოთ, თაითლისგან
          უკიდურეს მარჯვნივ."* What stays here is the one line that EXPLAINS an
          automated decision, because it is context the Override button in the
          header refers to, and it is a sentence, not a control. */}
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

      {/* WBS: "Underwriter shall be able to request additional documents or
          information from the borrower." Its note: "Assuming the underwriter
          should provide a text note with the required details" — so the note
          is the story, and it is required. */}
      <div>
        <Typography.Text style={s.blockTitle}>{t("appAction.requestInfo")}</Typography.Text>
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
      </div>

      {/* WBS: "The Underwriter may reduce or adjust the requested loan amount
          BEFORE THE FINAL APPROVAL DECISION", so it closes once decided. */}
      {canChangeAmount ? (
        <Collapse
          ghost
          style={styles.panel}
          items={[
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
                    CURRENT AND NEW IN ONE CONTAINER.

                    They used to be two figures stacked — a read-out, then the
                    RangeField's own big number below it — which read as scattered:
                    you could not tell the fact from the control. *"ქურენთ მაღლა
                    ამ კონტენერშივე რომ ჩავსვა."* Now the current value is a quiet
                    line INSIDE the field's box, above the editable figure, so the
                    box holds the whole before/after: currently X, change it to Y.
                  */}
                  <Form.Item
                    label={t("amountPanel.newAmount")}
                    name="amount"
                    rules={[rules.amount()]}
                    required
                  >
                    <RangeField
                      compact
                      min={0}
                      max={requestedAmount}
                      step={10}
                      prefix="$"
                      caption={t("amountPanel.currentIs", { amount: money(current) })}
                    />
                  </Form.Item>

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
          ]}
        />
      ) : null}
    </Flex>
  );
}

export default UnderwritingActions;
