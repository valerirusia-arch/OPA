// src/features/Borrowers/ui/ManageBorrowerModal.tsx
//
// WBS: "Admin/Underwriter shall be able to manually update borrower/co-borrower
// personal data (name, email, address, etc.)", with the note "it is assumed
// that email and phone number are updated as simple inputs (without initialling
// email/phone number validation)".
//
// Two consequences, both deliberate:
//   - email and phone are plain fields here. No format rule, and no one-time
//     code — the staff member is correcting a record, not proving an identity,
//     and the borrower is not made to re-verify something they never changed.
//   - name, date of birth and SSN are locked for the BORROWER in self-service
//     (Epic 1) but not for staff: this modal is the exception the WBS names.
//
// Dumb: it collects values and hands them back.

import { useEffect } from "react";
import {
  Button,
  Col,
  Divider,
  Flex,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Typography,
  theme,
} from "antd";
import { useT } from "../../../shared/ui/i18n/useT";
import type { Dayjs } from "dayjs";
import { DateOfBirthPicker } from "../../Auth/ui/DateOfBirthPicker";
import { useCountryOptions } from "../../Auth/ui/options";
import { useAuthRules } from "../../Auth/ui/validation";
import { stateOptions } from "../../Auth/ui/options";
import { getStyles, styles } from "./ManageBorrowerModal.styles";

export type ManageBorrowerValues = {
  firstName: string;
  middleName?: string;
  lastName: string;
  /** Dayjs while the form holds it; the screen formats it onto the record. */
  dateOfBirth?: Dayjs | null;
  /**
   * A NEW full SSN, or nothing.
   *
   * The back office never holds the stored number — the record carries a mask
   * and only a mask — so there is nothing to put in this field and nothing to
   * correct in place. It is a REPLACEMENT: left empty, the number on file is
   * untouched; filled, it becomes the new one.
   */
  ssn?: string;
  country?: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
};

export type ManageBorrowerModalProps = {
  open: boolean;
  /** The SSN as the record carries it — masked. Shown as the field's own hint
   *  and placeholder, because it is the only form of it the back office has. */
  maskedSsn?: string;
  initialValues?: ManageBorrowerValues;
  onSubmit?: (values: ManageBorrowerValues) => void;
  onCancel?: () => void;
};

export function ManageBorrowerModal({
  open,
  maskedSsn = "",
  initialValues,
  onSubmit,
  onCancel,
}: ManageBorrowerModalProps) {
  const t = useT();
  const rules = useAuthRules();
  const { token } = theme.useToken();
  const s = getStyles(token);
  const [form] = Form.useForm<ManageBorrowerValues>();
  const countries = useCountryOptions();
  const masked = maskedSsn;

  useEffect(() => {
    if (!open) return;
    form.resetFields();
    if (initialValues) form.setFieldsValue(initialValues);
  }, [open, initialValues, form]);

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnHidden
      width={680}
    >
      <Typography.Title level={4} style={styles.title}>
        {t("manageBorrower.title")}
      </Typography.Title>

      <Form
        form={form}
        layout="vertical"
        validateTrigger={["onBlur", "onChange"]}
        onFinish={(values) => onSubmit?.(values)}
      >
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item
              label={t("field.firstName")}
              name="firstName"
              rules={[rules.required()]}
              required
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label={t("field.middleName")} name="middleName">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label={t("field.lastName")}
              name="lastName"
              rules={[rules.required()]}
              required
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        {/* Rules instead of headings: the blocks need marking, not naming. */}
        <Divider style={s.groupRule} />

        {/*
          THE IDENTITY BLOCK, AND IT IS THIS FORM'S WHOLE REASON FOR EXISTING.

          WBS: "Personal information used for identity verification, underwriting
          or regulatory compliance (e.g., NAME, DATE OF BIRTH, SSN) cannot be
          updated through SELF-SERVICE. Any changes to borrower identity
          information require OPA STAFF INTERVENTION and are handled outside the
          self-service portal."

          The self-service portal is the borrower's app. This is the back
          office, and staff intervention is what happens here — which is why
          the name has always been editable in this modal. Date of birth and
          SSN are named in the same breath as the name and were the only two
          of the three with nowhere to be corrected; country of origin is
          collected at registration and had the same gap.
        */}
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item
              label={t("field.dateOfBirth")}
              name="dateOfBirth"
              rules={[rules.requiredValue()]}
              required
            >
              {/* The product's own date-of-birth control, the one registration
                  uses — a second drawing of the same field is how two of them
                  start disagreeing about what a date looks like. */}
              <DateOfBirthPicker />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label={t("field.ssn")}
              name="ssn"
              rules={rules.ssnOptional}
              extra={t("manageBorrower.ssnHint", { masked })}
            >
              <Input placeholder={masked} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label={t("field.country")}
              name="country"
              rules={[rules.required()]}
              required
            >
              <Select
                showSearch
                optionFilterProp="label"
                options={countries}
                placeholder={t("field.countryPlaceholder")}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider style={s.groupRule} />

        <Row gutter={16}>
          <Col xs={24} md={12}>
            {/* Email carries the format check, not just "required": this data
                drives borrower communication and servicing, so a mistyped
                address here is the same mistake it would be at registration. */}
            <Form.Item label={t("field.email")} name="email" rules={rules.email} required>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label={t("field.phone")} name="phone" rules={rules.phone} required>
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label={t("field.street")}
              name="street"
              rules={[rules.required()]}
              required
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Divider style={s.groupRule} />

        <Row gutter={16}>
          <Col xs={24} md={10}>
            <Form.Item label={t("field.city")} name="city" rules={[rules.required()]} required>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label={t("field.state")} name="state" rules={[rules.required()]} required>
              <Select options={stateOptions} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item label={t("field.zip")} name="zip" rules={rules.zip} required>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Flex gap={12} style={styles.actions}>
          <Button onClick={onCancel}>{t("common.cancel")}</Button>
          <Button type="primary" htmlType="submit">
            {t("users.save")}
          </Button>
        </Flex>
      </Form>
    </Modal>
  );
}

export default ManageBorrowerModal;
