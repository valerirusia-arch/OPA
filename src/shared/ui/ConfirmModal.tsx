// src/shared/ui/ConfirmModal.tsx
//
// One question, one sentence of consequence, two buttons.
//
// Deleting a user, withdrawing their access and putting a borrower on the
// DO NOT LOAN list all need the same pause, so they share one component rather
// than three near-identical modals.
//
// Dumb: it decides nothing. The caller says what it asks and what happens.

import type { ReactNode } from "react";
import { Button, Flex, Modal, Typography } from "antd";
import { useT } from "./i18n/useT";
import { styles } from "./ConfirmModal.styles";

export type ConfirmModalProps = {
  open: boolean;
  title: string;
  /** Rich, so the name in the sentence can be set in a stronger weight. */
  body: ReactNode;
  confirmLabel: string;
  /** Irreversible or access-removing actions confirm in red. */
  danger?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export function ConfirmModal({
  open,
  title,
  body,
  confirmLabel,
  danger,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const t = useT();

  return (
    <Modal open={open} onCancel={onCancel} footer={null} destroyOnHidden width={440}>
      <Typography.Title level={4} style={styles.title}>
        {title}
      </Typography.Title>
      <Typography.Text type="secondary" style={styles.body}>
        {body}
      </Typography.Text>

      <Flex gap={12} style={styles.actions}>
        <Button onClick={onCancel}>{t("common.cancel")}</Button>
        <Button type="primary" danger={danger} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </Flex>
    </Modal>
  );
}

export default ConfirmModal;
