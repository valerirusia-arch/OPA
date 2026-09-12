// src/features/Loan/ui/LoanAdminModals.tsx
//
// WBS story 11 — "Authorized users shall be able to manually update loan
// details (add documents, comments)."
//
// ONE dialog, not two. It was two — Add document and Add comment — and the
// wireframe is right to make it one "Add document / comment": the thing an
// underwriter actually does is explain something, sometimes with a file
// attached, and splitting that in half makes them choose a menu item before
// they have decided what they are saying.
//
// So the comment is the field that leads and the file is optional beside it.
// At least one of the two is required, because a dialog that saves nothing is
// not an addition.
//
// Append-only: the story says ADD, and a comment somebody can quietly rewrite
// is not a record of anything. There is no pencil next to one.
//
// Dumb: nothing is uploaded and nothing is saved.

import { Form, Input, Modal, Typography, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useT } from "../../../shared/ui/i18n/useT";
import { styles } from "./LoanAdminModals.styles";

export type LoanNoteValues = {
  comment?: string;
  files?: { name: string }[];
};

export type AddDocumentCommentModalProps = {
  open: boolean;
  onCancel?: () => void;
  onAdd?: (values: LoanNoteValues) => void;
};

export function AddDocumentCommentModal({
  open,
  onCancel,
  onAdd,
}: AddDocumentCommentModalProps) {
  const t = useT();
  const [form] = Form.useForm<LoanNoteValues>();

  /**
   * Either a note or a file will do, and neither on its own is optional.
   *
   * A rule on the pair rather than on both fields: marking each of them
   * required would refuse a file with no note and a note with no file, which
   * are the two normal cases.
   */
  const pairRule = {
    validator: () => {
      const values = form.getFieldsValue();
      return values.comment?.trim() || values.files?.length
        ? Promise.resolve()
        : Promise.reject(new Error(t("loanAdmin.noteRequired")));
    },
  };

  return (
    <Modal
      open={open}
      title={t("loanAdmin.addTitle")}
      onCancel={onCancel}
      okText={t("loanAdmin.save")}
      cancelText={t("common.cancel")}
      onOk={() => form.submit()}
      destroyOnHidden
      width={560}
      afterClose={() => form.resetFields()}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => onAdd?.(values)}
        style={styles.form}
      >
        <Form.Item
          label={t("loanAdmin.commentLabel")}
          name="comment"
          rules={[pairRule]}
          /* The file may satisfy it instead, so no asterisk on this one. */
          dependencies={["files"]}
        >
          <Input.TextArea
            rows={4}
            autoFocus
            placeholder={t("loanAdmin.commentPlaceholder")}
          />
        </Form.Item>

        <Form.Item
          label={t("loanAdmin.attach")}
          name="files"
          valuePropName="fileList"
          getValueFromEvent={(event) => event?.fileList}
          dependencies={["comment"]}
        >
          {/* beforeUpload returns false: the file stays in the list and is
              never sent anywhere. */}
          <Upload.Dragger
            multiple
            beforeUpload={() => false}
            accept=".pdf,.jpg,.jpeg,.png"
            styles={{ item: styles.uploadItem }}
          >
            <Typography.Text type="secondary">
              <InboxOutlined /> {t("moreInfo.choose")}
            </Typography.Text>
          </Upload.Dragger>
        </Form.Item>
      </Form>
    </Modal>
  );
}
