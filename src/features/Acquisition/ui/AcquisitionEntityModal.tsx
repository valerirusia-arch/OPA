// src/features/Acquisition/ui/AcquisitionEntityModal.tsx
//
// One create/edit dialog for the simple acquisition objects — partners, partner
// groups, campaigns. The WBS asks for "simple available attributes" everywhere
// in this epic, so a form is just a list of labelled fields; the caller says
// which. The lifecycle status is toggled from the row, not set here, the same
// as every other back-office list.
//
// Dumb: it renders the fields it is handed and hands the values back.

import { useEffect, type ReactNode } from "react";
import { Button, Flex, Form, Input, Modal, Select, Typography } from "antd";
import { useT } from "../../../shared/ui/i18n/useT";
import { useAuthRules } from "../../Auth/ui/validation";
import type { TranslationKey } from "../../../shared/ui/i18n/dictionary";
import { styles } from "./AcquisitionSourceModal.styles";
import { PeriodField } from "./PeriodField";

/** One field in the form. `select` needs options; `dateRange` collects a
 *  validity period (a pair of dates). */
export type EntityField = {
  name: string;
  labelKey: TranslationKey;
  kind: "text" | "select" | "dateRange";
  options?: { label: string; value: string }[];
  placeholderKey?: TranslationKey;
  /** A field the WBS does not require — only this one may be left blank. */
  optional?: boolean;
};

export type AcquisitionEntityModalProps = {
  open: boolean;
  titleKey: TranslationKey;
  fields: EntityField[];
  /** Text/select values plus, for a dateRange field, a `[from, to]` string pair
   *  under that field's name with a `Range` suffix — see the screens. */
  initialValues?: Record<string, unknown>;
  onSubmit?: (values: Record<string, unknown>) => void;
  onCancel?: () => void;
};

export function AcquisitionEntityModal({
  open,
  titleKey,
  fields,
  initialValues,
  onSubmit,
  onCancel,
}: AcquisitionEntityModalProps) {
  const t = useT();
  const rules = useAuthRules();
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) return;
    form.resetFields();
    if (initialValues) form.setFieldsValue(initialValues);
  }, [open, initialValues, form]);

  /*
   * WHY THE DATE FIELD CANNOT USE `rules.required()`.
   *
   * That rule is `{ required: true, message }` with no `type`, and
   * async-validator defaults an untyped rule to `string`. So after the
   * required check passes it runs the STRING check, which a `[Dayjs, Dayjs]`
   * pair fails — and because the rule carries its own `message`, that type
   * failure is reported in the required rule's words. The period read
   * "Required field" with both dates filled in and the form would not submit.
   *
   * It predates the two-picker field; the RangePicker that was here had it
   * too, which is why it was never caught: nobody had submitted the dialog.
   *
   * So the period gets a validator of its own, and it asks the question that
   * actually matters — are BOTH ends set. `requiredValue` would not do either:
   * it only rejects an empty array, and a period with a start and no end is a
   * two-element array.
   */
  const ruleFor = (field: EntityField) => {
    if (field.optional) return undefined;
    if (field.kind !== "dateRange") return [rules.required()];
    return [
      {
        validator: (_rule: unknown, value: unknown) => {
          const [from, to] = Array.isArray(value) ? value : [null, null];
          return from && to
            ? Promise.resolve()
            : Promise.reject(new Error(t("acq.campaign.periodBoth")));
        },
      },
    ];
  };

  const control = (field: EntityField): ReactNode => {
    if (field.kind === "select") {
      return (
        <Select size="large" options={field.options} placeholder={t(field.labelKey)} />
      );
    }
    if (field.kind === "dateRange") {
      return <PeriodField />;
    }
    return (
      <Input
        size="large"
        autoComplete="off"
        placeholder={field.placeholderKey ? t(field.placeholderKey) : undefined}
      />
    );
  };

  return (
    <Modal open={open} onCancel={onCancel} footer={null} destroyOnHidden width={480}>
      <Typography.Title level={4} style={styles.title}>
        {t(titleKey)}
      </Typography.Title>

      <Form
        form={form}
        layout="vertical"
        validateTrigger={["onBlur", "onChange"]}
        onFinish={(values) => onSubmit?.(values)}
      >
        {fields.map((field) => (
          <Form.Item
            key={field.name}
            label={t(field.labelKey)}
            name={field.name}
            rules={ruleFor(field)}
            required={!field.optional}
          >
            {control(field)}
          </Form.Item>
        ))}

        <Flex gap={12} style={styles.actions}>
          <Button onClick={onCancel}>{t("common.cancel")}</Button>
          <Button type="primary" htmlType="submit">
            {t("acq.save")}
          </Button>
        </Flex>
      </Form>
    </Modal>
  );
}

export default AcquisitionEntityModal;
