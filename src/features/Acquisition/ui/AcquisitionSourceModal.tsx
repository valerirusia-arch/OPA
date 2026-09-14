// src/features/Acquisition/ui/AcquisitionSourceModal.tsx
//
// Create or edit an acquisition source. WBS: the Admin "shall be able to
// create, view, update, and maintain acquisition sources". The fields are the
// WBS's simple attribute set — name, partner and code; the lifecycle status is
// toggled from the row, not set here, the same as every other back-office list.
//
// Dumb: it collects values and hands them back.

import { useEffect } from "react";
import { Button, Flex, Form, Input, Modal, Select, Typography } from "antd";
import { useT } from "../../../shared/ui/i18n/useT";
import { useAuthRules } from "../../Auth/ui/validation";
import { styles } from "./AcquisitionSourceModal.styles";

export type AcquisitionSourceValues = {
  name: string;
  partner: string;
  code: string;
};

export type AcquisitionSourceModalProps = {
  open: boolean;
  mode: "create" | "edit";
  initialValues?: AcquisitionSourceValues;
  /** The referral partners a source can be attached to. */
  partnerOptions: { label: string; value: string }[];
  onSubmit?: (values: AcquisitionSourceValues) => void;
  onCancel?: () => void;
};

export function AcquisitionSourceModal({
  open,
  mode,
  initialValues,
  partnerOptions,
  onSubmit,
  onCancel,
}: AcquisitionSourceModalProps) {
  const t = useT();
  const rules = useAuthRules();
  const [form] = Form.useForm<AcquisitionSourceValues>();

  useEffect(() => {
    if (!open) return;
    form.resetFields();
    if (initialValues) form.setFieldsValue(initialValues);
  }, [open, initialValues, form]);

  return (
    <Modal open={open} onCancel={onCancel} footer={null} destroyOnHidden width={480}>
      <Typography.Title level={4} style={styles.title}>
        {t(mode === "create" ? "acq.source.newTitle" : "acq.source.editTitle")}
      </Typography.Title>

      <Form
        form={form}
        layout="vertical"
        validateTrigger={["onBlur", "onChange"]}
        onFinish={(values) => onSubmit?.(values)}
      >
        <Form.Item label={t("acq.source.name")} name="name" rules={[rules.required()]} required>
          <Input size="large" autoComplete="off" />
        </Form.Item>

        <Form.Item label={t("acq.source.partner")} name="partner" rules={[rules.required()]} required>
          <Select size="large" options={partnerOptions} placeholder={t("acq.source.partner")} />
        </Form.Item>

        <Form.Item label={t("acq.source.code")} name="code" rules={[rules.required()]} required>
          <Input size="large" autoComplete="off" placeholder={t("acq.source.codePlaceholder")} />
        </Form.Item>

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

export default AcquisitionSourceModal;
