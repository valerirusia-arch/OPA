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
import { Button, DatePicker, Flex, Form, Input, Modal, Select, Typography } from "antd";
import { useT } from "../../../shared/ui/i18n/useT";
import { useAuthRules } from "../../Auth/ui/validation";
import type { TranslationKey } from "../../../shared/ui/i18n/dictionary";
import { styles } from "./AcquisitionSourceModal.styles";

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

  const control = (field: EntityField): ReactNode => {
    if (field.kind === "select") {
      return (
        <Select size="large" options={field.options} placeholder={t(field.labelKey)} />
      );
    }
    if (field.kind === "dateRange") {
      return <DatePicker.RangePicker size="large" style={styles.fullWidth} />;
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
            rules={field.optional ? undefined : [rules.required()]}
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
