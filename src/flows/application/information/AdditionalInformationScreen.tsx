// src/flows/application/information/AdditionalInformationScreen.tsx
//
// Epic 4, WBS "Submit additional information" (Borrower):
//   "Borrower shall be able to provide the requested documents or information
//    and resubmit the application for review. Assumed that borrower should
//    have an option to upload documents via the customer portal and add a text
//    note."
//   Comments: "The application returns to the underwriting workflow."
//
// So: what was asked, somewhere to put documents, somewhere to write, and one
// button that sends it and puts the application back in the queue.
//
// THE REQUEST IS QUOTED, not paraphrased. It is the underwriter's own sentence
// from story 11 ("the underwriter should provide a text note with the required
// details"), and the borrower is answering that sentence — rewriting it into
// the page's own voice would lose the one thing that makes the ask specific.
//
// NEITHER FIELD IS INDIVIDUALLY REQUIRED, but sending nothing is not
// answering: a reviewer asking for a clearer pay stub may get a file, and a
// reviewer asking "which of these is your current address" may get a sentence.
// So the rule is on the pair, and it is on the submit rather than on a field —
// there is no single field to put a red asterisk against.
//
// Dumb: nothing is uploaded and nothing is sent. The file list is names in
// local state and submitting is a console.log, the same as the wizard's.

import { App, Button, Card, Flex, Form, Input, Typography, Upload, theme } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useNavigate } from "@tanstack/react-router";
import { AppHeader } from "../../../shared/ui/AppHeader";
import { borrowerNav } from "../../../shared/ui/navigation";
import { BorrowerInbox } from "../../notifications/BorrowerInbox";
import { useUnreadCount } from "../../notifications/notifications";
import { useT } from "../../../shared/ui/i18n/useT";
import { useCustomerViewer } from "../../../shared/ui/viewerRole";
import { SessionTimeoutModal } from "../../../features/Auth/ui/SessionTimeoutModal";
import { useIdleTimer, DEFAULT_IDLE_MS } from "../../../features/Auth/ui/useIdleTimer";
import { setStage, useLoanRecord } from "../../loan/loanRecord";
import { getStyles, styles } from "./AdditionalInformationScreen.styles";

type FormValues = { documents?: { name: string }[]; note?: string };

export type AdditionalInformationScreenProps = {
  /** The underwriter's note, in their words. */
  request?: string;
  askedBy?: string;
  askedOn?: string;
  userName?: string;
  idleMs?: number;
};

export default function AdditionalInformationScreen({
  request = "The pay stub you uploaded is too dark to read. Please send a clearer photo or a PDF of the same document.",
  askedBy = "Priya Raman",
  askedOn = "Sep 04, 2026",
  userName,
  idleMs = DEFAULT_IDLE_MS,
}: AdditionalInformationScreenProps) {
  const navigate = useNavigate();
  const viewer = useCustomerViewer();
  /** WBS Notifications: what the bell's badge counts. */
  const unreadCount = useUnreadCount(viewer.role);
  const person = userName ?? viewer.name;
  const t = useT();
  const { token } = theme.useToken();
  const s = getStyles(token);
  const { message } = App.useApp();
  const { idle, reset: staySignedIn } = useIdleTimer(idleMs);
  const [form] = Form.useForm<FormValues>();

  /*
    THE ONE REQUEST THIS FORM CANNOT ANSWER.

    WBS gives the underwriter a single lever here — "request additional
    documents or information from the borrower… a text note with the required
    details" — and it is also the one they reach for when what is wrong is the
    CO-BORROWER, because the epic gives them no way to turn one down. The
    application screen now has a button that sends exactly that request.

    So a request can read "please invite a different co-borrower", and the
    borrower answering it had a file picker and a text box. Neither invites
    anybody, and they were left to work out on their own that the way to do it
    was another page.

    Shown only when there IS a co-borrower to change, and worded as a door
    rather than an instruction: this page cannot read the note, so it offers
    the route and lets the borrower decide whether it is the one they were
    asked for.
  */
  const record = useLoanRecord();
  const hasCoBorrower = Boolean(record?.coBorrower ?? record?.invitation);

  // Watched rather than validated per field: the requirement is "send
  // something", which no single field can express.
  const documents = Form.useWatch("documents", form);
  const note = Form.useWatch("note", form);
  const hasSomething = Boolean(documents?.length) || Boolean(note?.trim());

  return (
    <>
      <AppHeader
        navItems={borrowerNav}
        notifications={<BorrowerInbox />}
        notificationCount={unreadCount}
        activeKey="application"
        userName={person}
        profileTo="/profile"
        onLogout={() => {
          console.log("log out");
          navigate({ to: "/" });
        }}
      />

      <div style={styles.page}>
        <div style={styles.column}>
          <Card>
            <Typography.Title level={4} style={styles.title}>
              {t("moreInfo.title")}
            </Typography.Title>
            <Typography.Text type="secondary" style={styles.subtitle}>
              {t("moreInfo.subtitle")}
            </Typography.Text>

            <Flex vertical style={s.request}>
              <Typography.Text style={s.label}>{t("moreInfo.requested")}</Typography.Text>
              <Typography.Text>{request}</Typography.Text>
              <Typography.Text type="secondary" style={{ ...styles.asked, ...styles.meta }}>
                {t("moreInfo.askedBy", { name: askedBy, date: askedOn })}
              </Typography.Text>
            </Flex>

            <Form
              form={form}
              layout="vertical"
              onFinish={(values) => {
                console.log("submit additional information", values);
                message.success(t("moreInfo.sent"));
                /* WBS, on this story: "The application RETURNS TO THE
                   UNDERWRITING WORKFLOW." It used to return the reader to a
                   page still saying "We need one more thing — see what is
                   needed", about a thing they had just sent. Sending is the
                   whole point of the screen, so it moves the application. */
                setStage("review");
                navigate({ to: "/application" });
              }}
            >
              <Form.Item
                label={t("moreInfo.upload")}
                name="documents"
                valuePropName="fileList"
                getValueFromEvent={(event) => event?.fileList}
                extra={t("moreInfo.uploadHelp")}
              >
                {/* beforeUpload returns false: the file stays in the list and
                    is never sent anywhere, which is all a prototype should do
                    with somebody's pay stub. */}
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

              <Form.Item label={t("moreInfo.note")} name="note">
                <Input.TextArea rows={4} placeholder={t("moreInfo.notePlaceholder")} />
              </Form.Item>

              <Form.Item style={styles.actions}>
                <Flex gap={12} justify="flex-end">
                  <Button size="large" onClick={() => navigate({ to: "/application" })}>
                    {t("common.back")}
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    disabled={!hasSomething}
                    // The reason it is off, on the button itself: a disabled
                    // control with no explanation is a dead end.
                    title={hasSomething ? undefined : t("moreInfo.needSomething")}
                  >
                    {t("moreInfo.submit")}
                  </Button>
                </Flex>
              </Form.Item>
            </Form>

            {hasCoBorrower ? (
              <Flex vertical align="flex-start" gap={8} style={s.aside}>
                <Typography.Text strong>{t("moreInfo.coBorrowerTitle")}</Typography.Text>
                <Typography.Text type="secondary">{t("moreInfo.coBorrowerBody")}</Typography.Text>
                <Button onClick={() => navigate({ to: "/application/co-borrower" })}>
                  {t("application.coBorrowerFailedAction")}
                </Button>
              </Flex>
            ) : null}
          </Card>
        </div>
      </div>

      <SessionTimeoutModal
        open={idle}
        onStaySignedIn={staySignedIn}
        onSignOut={() => {
          console.log("session ended after inactivity");
          navigate({ to: "/" });
        }}
      />
    </>
  );
}
