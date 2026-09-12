// src/features/Auth/ui/PersonalInfoStep.tsx
//
// Registration step 1 of 3: who the applicant is.
//
// It goes first because a name is the easiest thing anyone can type — no
// decision, no invention, just recall. Opening a form with the field that
// costs least is what gets people past the first screen.
//
// These are also the fields the identity check runs against, which is why the
// SSN carries a line explaining what it is for — asking a stranger for their
// social security number without saying why is how forms lose people.
//
// WBS: part of "Register" — country of origination, first/middle/last name,
// DoB, SSN.

import { useEffect } from "react";
import { Alert, Col, Form, Input, Row, Select, Tooltip, Typography, theme } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import type { Dayjs } from "dayjs";
import { useT } from "../../../shared/ui/i18n/useT";
import { DateOfBirthPicker } from "./DateOfBirthPicker";
import { formatSsn } from "./masks";
import { useCountryOptions } from "./options";
import { useAuthRules } from "./validation";
import { WizardActions } from "./WizardActions";
import { getStyles, styles } from "./WizardStep.styles";

export type PersonalInfoValues = {
  country: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: Dayjs;
  ssn: string;
};

export type PersonalInfoStepProps = {
  initialValues?: Partial<PersonalInfoValues>;
  onSubmit?: (values: PersonalInfoValues) => void;
  onBack?: () => void;
  submitting?: boolean;
  fieldErrors?: { name: keyof PersonalInfoValues; errors: string[] }[];
  formError?: string;
};

/** Everything that must be filled in before the step can be submitted. */
const REQUIRED = ["country", "firstName", "lastName", "dateOfBirth", "ssn"] as const;

export function PersonalInfoStep({
  initialValues,
  onSubmit,
  onBack,
  submitting,
  fieldErrors,
  formError,
}: PersonalInfoStepProps) {
  const [form] = Form.useForm<PersonalInfoValues>();
  // Watching the form (rather than validating in an effect) keeps this a
  // plain render-time answer: has every required field been filled in?
  const watched = Form.useWatch([], form);
  const t = useT();
  const { token } = theme.useToken();
  const s = getStyles(token);
  const rules = useAuthRules();
  const countryOptions = useCountryOptions();

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
      initialValues={initialValues}
      onFinish={(values) => onSubmit?.(values)}
    >
      <Typography.Title level={2} style={styles.title}>
        {t("register.personalTitle")}
      </Typography.Title>
      <Typography.Text type="secondary" style={styles.description}>
        {t("register.personalSubtitle")}
      </Typography.Text>

      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Form.Item
            label={t("field.firstName")}
            name="firstName"
            rules={[rules.required()]}
          >
            <Input autoComplete="given-name" autoFocus />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          {/* Optional on purpose: not everyone has a middle name. */}
          <Form.Item label={t("field.middleName")} name="middleName">
            <Input autoComplete="additional-name" />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item label={t("field.lastName")} name="lastName" rules={[rules.required()]}>
            <Input autoComplete="family-name" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label={t("field.country")} name="country" rules={[rules.required()]}>
        <Select
          showSearch
          optionFilterProp="label"
          placeholder={t("field.countryPlaceholder")}
          options={countryOptions}
        />
      </Form.Item>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            label={t("field.dateOfBirth")}
            name="dateOfBirth"
            rules={rules.dateOfBirth}
            // The rule checks presence with a validator rather than antd's
            // `required` flag (a Dayjs reads as empty to it), so the asterisk
            // has to be asked for explicitly.
            required
          >
            <DateOfBirthPicker />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label={t("field.ssn")}
            name="ssn"
            rules={rules.ssn}
            normalize={(value: string) => formatSsn(value)}
          >
            {/* The reassurance lives on the field itself rather than under it:
                two lines of small print below an input push the whole form
                down, and this one only matters at the moment you hesitate. */}
            <Input
              placeholder="123-45-6789"
              inputMode="numeric"
              autoComplete="off"
              suffix={
                <Tooltip title={t("register.ssnHint")}>
                  <InfoCircleOutlined
                    style={s.hintIcon}
                    tabIndex={0}
                    aria-label={t("register.ssnHint")}
                  />
                </Tooltip>
              }
            />
          </Form.Item>
        </Col>
      </Row>

      {formError && <Alert type="error" showIcon style={styles.alert} title={formError} />}

      <Form.Item style={styles.actions}>
        <WizardActions onBack={onBack} submitting={submitting} disabled={!ready} />
      </Form.Item>
    </Form>
  );
}

export default PersonalInfoStep;
