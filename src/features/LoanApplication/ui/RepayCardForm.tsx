// src/features/LoanApplication/ui/RepayCardForm.tsx
//
// A MOCK of Repay's embedded card form.
//
// The WBS is emphatic that OPA does not build this: "card details are
// collected using a secure embedded form from Repay that works as a 'black
// box' for the OPA application. No card information is stored in the OPA
// application, only card token." The wireframe drew these fields in OPA's own
// styling, which would tell a borrower they are handing their card to OPA.
//
// So the fields are here to make the prototype demonstrable — a reviewer can
// see the whole step happen — and they are labelled, framed and worded as
// Repay's. Nothing typed here leaves the component: what comes out is the
// token Repay would return, which is a brand, four digits and an expiry.
//
// Dumb: no request, no storage, no validation beyond shape — length, a real
// month, an expiry that has not passed. Whether the card is GOOD is Repay's
// answer, and it comes back as `declined` on the step above.

import { useState } from "react";
import { Button, Flex, Form, Input, Typography } from "antd";
import { useT } from "../../../shared/ui/i18n/useT";
import { useAuthRules } from "../../Auth/ui/validation";
import { digitsOnly } from "../../Auth/ui/masks";
import { TEST_CARDS, cardNetwork } from "../../Auth/ui/cardNetwork";
import { styles } from "./RepayCardForm.styles";
import type { CardToken } from "./types";

export type RepayCardFormProps = {
  onSave?: (card: CardToken) => void;
  onCancel?: () => void;
};

type CardFormValues = { number?: string; expiry?: string; cvv?: string };

/** 4111111111111111 -> "4111 1111 1111 1111". */
const groupDigits = (raw: string) =>
  digitsOnly(raw, 19).replace(/(.{4})/g, "$1 ").trim();

/** 1225 -> "12/25". */
const formatExpiry = (raw: string) => {
  const digits = digitsOnly(raw, 4);
  return digits.length <= 2 ? digits : `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

/**
 * The network, from the leading digits.
 *
 * The ranges live in one place — the same module the card-number rule reads —
 * so the form cannot accept a number the token then describes differently.
 * The fallback is unreachable while validation stands, and it is kept because
 * a name is the one field on the token that must never come back empty.
 */
const brandOf = (digits: string) => cardNetwork(digits)?.name ?? "Card";

export function RepayCardForm({ onSave, onCancel }: RepayCardFormProps) {
  const t = useT();
  const rules = useAuthRules();
  const [form] = Form.useForm<CardFormValues>();
  /** Which test card the DEV button hands over next. */
  const [testCard, setTestCard] = useState(0);

  /**
   * Fills the form with a card that actually passes, and moves to the next one.
   *
   * Cycling rather than repeating: the four networks are drawn differently on
   * the saved card and Amex asks for a fourth CVV digit, so the states worth
   * looking at are all one click apart.
   */
  const fillTestCard = () => {
    const card = TEST_CARDS[testCard % TEST_CARDS.length];
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 3);
    const expiry = `${String(expires.getMonth() + 1).padStart(2, "0")}/${String(
      expires.getFullYear() % 100
    ).padStart(2, "0")}`;

    // setFields, not setFieldsValue: it clears whatever the last attempt left
    // on screen. It also skips `normalize`, so the formatting is applied here.
    form.setFields([
      { name: "number", value: groupDigits(card.number), errors: [] },
      { name: "expiry", value: expiry, errors: [] },
      { name: "cvv", value: card.cvv, errors: [] },
    ]);
    setTestCard((index) => index + 1);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      style={styles.form}
      validateTrigger={["onBlur", "onChange"]}
      onFinish={({ number = "", expiry = "" }: CardFormValues) => {
        const digits = digitsOnly(number);
        // Only the token crosses this line — never what was typed.
        console.log("Repay returned a card token");
        onSave?.({
          brand: brandOf(digits),
          last4: digits.slice(-4),
          expiry: formatExpiry(expiry),
        });
      }}
    >
      <Form.Item
        label={t("card.number")}
        name="number"
        rules={rules.cardNumber}
        required
        normalize={groupDigits}
      >
        <Input size="large" style={styles.number} inputMode="numeric" placeholder="4111 1111 1111 1111" />
      </Form.Item>

      <Flex gap={16}>
        <Form.Item
          label={t("card.expiry")}
          name="expiry"
          rules={rules.cardExpiry}
          required
          normalize={formatExpiry}
          style={styles.form}
        >
          <Input size="large" inputMode="numeric" placeholder="MM/YY" />
        </Form.Item>
        <Form.Item
          label={t("card.cvv")}
          name="cvv"
          rules={rules.cardCvv("number")}
          required
          normalize={(value: string) => digitsOnly(value, 4)}
          style={styles.form}
        >
          <Input size="large" inputMode="numeric" placeholder="123" />
        </Form.Item>
      </Flex>

      <Form.Item style={styles.actions}>
        <Flex gap={12} align="center">
          <Button type="primary" size="large" htmlType="submit">
            {t("card.save")}
          </Button>
          <Button type="text" size="large" onClick={onCancel}>
            {t("common.cancel")}
          </Button>
        </Flex>
      </Form.Item>

      <Flex align="center" gap={12} style={styles.note}>
        <Typography.Text type="secondary" style={styles.noteText}>
          {t("card.mockNote")}
        </Typography.Text>

        {/* A card number that passes is a published string nobody remembers,
            and hunting for one to click through your own prototype is not
            part of the design. DEV only — it cannot reach a build. */}
        {import.meta.env.DEV ? (
          <Button type="link" size="small" style={styles.fill} onClick={fillTestCard}>
            {t("card.fillTest")}
          </Button>
        ) : null}
      </Flex>
    </Form>
  );
}

export default RepayCardForm;
