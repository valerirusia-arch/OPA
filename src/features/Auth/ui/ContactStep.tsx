// src/features/Auth/ui/ContactStep.tsx
//
// Registration step 2 of 3: how OPA reaches the applicant.
//
// Address, phone and the SMS/email preference are one subject — every one of
// them is a way to contact someone — so they share a screen and a heading
// that covers all three. The state doubles as an eligibility answer, which is
// what the subtitle explains.
//
// WBS: part of "Register" — phone number, US address, communication
// preferences (SMS/email).

import { useEffect } from "react";
import { Alert, Col, Form, Input, Row, Select, Typography } from "antd";
import { useT } from "../../../shared/ui/i18n/useT";
import { digitsOnly, formatUsPhone } from "./masks";
import { stateOptions, useCommunicationOptions } from "./options";
import { useAuthRules } from "./validation";
import { WizardActions } from "./WizardActions";
import { styles } from "./WizardStep.styles";

export type ContactValues = {
  street: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  communication: string;
};

export type ContactStepProps = {
  initialValues?: Partial<ContactValues>;
  onSubmit?: (values: ContactValues) => void;
  onBack?: () => void;
  submitting?: boolean;
  fieldErrors?: { name: keyof ContactValues; errors: string[] }[];
  formError?: string;
  /** Lets the caller word the buttons when this is not the last form step. */
  submitLabel?: string;
  backLabel?: string;
  /**
   * The loan application reuses these fields inside its own wizard, which
   * already puts a heading above the card — two of them stacked reads as a
   * mistake. Registration, where this step IS the screen, keeps its own.
   */
  showHeading?: boolean;
};

/** Everything that must be filled in before the step can be submitted. */
const REQUIRED = ["phone", "street", "city", "state", "zip", "communication"] as const;

export function ContactStep({
  initialValues,
  onSubmit,
  onBack,
  submitting,
  fieldErrors,
  formError,
  submitLabel,
  backLabel,
  showHeading = true,
}: ContactStepProps) {
  const [form] = Form.useForm<ContactValues>();
  // Watching the form (rather than validating in an effect) keeps this a
  // plain render-time answer: has every required field been filled in?
  const watched = Form.useWatch([], form);
  const t = useT();
  const rules = useAuthRules();
  const communicationOptions = useCommunicationOptions();

  useEffect(() => {
    if (fieldErrors?.length) form.setFields(fieldErrors);
  }, [fieldErrors, form]);

  const ready = REQUIRED.every((name) => {
    const value = watched?.[name];
    return value !== undefined && value !== null && value !== "";
  });

  return (
    <Form
      form={form}
      layout="vertical"
      // Both triggers are offered; each RULE picks the one it needs.
      // "Required" listens for changes, so an error clears the moment the
      // field is filled. Format rules listen for blur, so half a typed email
      // is never flagged mid-word. See useAuthRules.
      validateTrigger={["onBlur", "onChange"]}
      scrollToFirstError
      style={styles.form}
      initialValues={{ communication: "email", ...initialValues }}
      onFinish={(values) => onSubmit?.(values)}
    >
      {showHeading ? (
        <>
          <Typography.Title level={2} style={styles.title}>
            {t("register.contactTitle")}
          </Typography.Title>
          <Typography.Text type="secondary" style={styles.descriptionLong}>
            {t("register.contactSubtitle")}
          </Typography.Text>
        </>
      ) : null}

      <Form.Item label={t("field.street")} name="street" rules={[rules.required()]}>
        <Input autoComplete="street-address" autoFocus />
      </Form.Item>

      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Form.Item label={t("field.city")} name="city" rules={[rules.required()]}>
            <Input autoComplete="address-level2" />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item label={t("field.state")} name="state" rules={[rules.required()]}>
            <Select
              showSearch
              optionFilterProp="label"
              placeholder={t("field.state")}
              options={stateOptions}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item
            label={t("field.zip")}
            name="zip"
            rules={rules.zip}
            normalize={(value: string) => digitsOnly(value, 5)}
          >
            <Input inputMode="numeric" autoComplete="postal-code" />
          </Form.Item>
        </Col>
      </Row>

      {/* The address answers "where"; these two answer "how" — so they pair. */}
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            label={t("field.phoneUs")}
            name="phone"
            rules={rules.phone}
            normalize={(value: string) => formatUsPhone(value)}
          >
            <Input placeholder="(555) 010-2020" inputMode="tel" autoComplete="tel" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label={t("field.communication")}
            name="communication"
            rules={[rules.required()]}
          >
            <Select options={communicationOptions} />
          </Form.Item>
        </Col>
      </Row>

      {formError && <Alert type="error" showIcon style={styles.alert} title={formError} />}

      <Form.Item style={styles.actions}>
        <WizardActions
          onBack={onBack}
          backLabel={backLabel}
          submitting={submitting}
          submitLabel={submitLabel}
          disabled={!ready}
        />
      </Form.Item>
    </Form>
  );
}

export default ContactStep;
