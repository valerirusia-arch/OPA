// src/stories/EmailDesigns.stories.tsx
//
// Every email OPA sends, in one place, in both languages.
//
// The templates are standalone HTML files in `public/emails/` — they have to
// be, because an email is not rendered by a browser engine we control, so it
// is built out of tables and inline styles rather than as a component. That
// makes them the one part of the design with nowhere to be reviewed: not a
// screen, not a story, just files somebody has to remember the path to.
//
// This is that place. It lists them, renders the chosen one in an iframe at
// the width a mail client gives it, and shows the merge fields Dev has to
// fill. The catalogue below is the only thing to keep in step when a template
// is added.
//
// Pure presentation: a list, an iframe and a language toggle. No fetching, no
// state beyond which one is on screen.

import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Alert, Button, Card, Flex, Segmented, Space, Table, Tag, Typography, theme,
} from "antd";
import { ExportOutlined, MailOutlined } from "@ant-design/icons";

/**
 * Where the app serves `public/`. Storybook has no static directory of its
 * own, so the templates are read from the running dev server — the same one
 * the DevBar's buttons point at.
 */
const APP_URL = "http://localhost:5183";

type EmailTemplate = {
  slug: string;
  name: string;
  /** Who it lands on, in the WBS's own words. */
  audience: string;
  /** The story that asks for it, so a reviewer can check it against the WBS. */
  wbs: string;
  /** What Dev has to fill in. */
  fields: string[];
  /** Anything OPA still has to decide before this can be sent. */
  open?: string;
};

const TEMPLATES: EmailTemplate[] = [
  {
    slug: "co-borrower-invitation",
    name: "Co-borrower invitation",
    audience: "Co-borrower",
    wbs: "Loan application · Add a co-borrower / Determine co-borrower requirement",
    fields: ["firstName", "borrowerName", "invitationUrl", "expiresOn"],
  },
  {
    slug: "set-password",
    name: "Set your password",
    audience: "Any user an admin creates",
    wbs: "Users management · Set password",
    fields: ["firstName", "email", "setPasswordUrl", "expiresIn"],
    open: "How long the link lasts. The WBS states no expiry.",
  },
  {
    slug: "verify-email",
    name: "Verify email code",
    audience: "Borrower / Co-borrower",
    wbs: "User authentication · Verify email",
    fields: ["firstName", "code", "expiresIn"],
    open: "How long the code lasts. The WBS states no expiry.",
  },
  {
    slug: "document-signing-request",
    name: "Documents ready to sign",
    audience: "Borrower / Co-borrower",
    wbs: "Notifications · Receive document signing request",
    fields: ["firstName", "documentList", "signingUrl"],
  },
  {
    slug: "additional-information-requested",
    name: "More information needed",
    audience: "Borrower / Co-borrower",
    wbs: "Notifications · Receive request for additional information",
    fields: ["firstName", "requestDetail", "applicationUrl"],
  },
  {
    slug: "application-approved",
    name: "Application approved",
    audience: "Borrower / Co-borrower",
    wbs: "Notifications · Receive Application approved notification",
    fields: ["firstName", "applicationUrl"],
  },
  {
    slug: "application-declined",
    name: "Application declined",
    audience: "Borrower / Co-borrower",
    wbs: "Notifications · Receive Application declined notification",
    fields: ["firstName", "declineReason", "contactUrl"],
    open: "The legally required adverse-action wording is OPA's counsel to supply.",
  },

  /*
    NOTIFICATIONS & COMMUNICATIONS — the rest of the epic.

    Everything below is one of its own stories, in the epic's order. Two of
    them go to internal users: the WBS gives those a single channel
    ("Notification through email"), which is why they are here and not behind
    a bell.
  */
  {
    slug: "document-signing-request",
    name: "Document signing request",
    audience: "Borrower / Co-borrower",
    wbs: "Notifications · Receive document signing request",
    fields: ["firstName", "signUrl"],
  },
  {
    slug: "co-borrower-expired",
    name: "Co-borrower invitation expired",
    audience: "Borrower",
    wbs: "Notifications · Receive notification that the co-borrower invitation has expired",
    fields: ["firstName", "coBorrowerName", "expiredOn", "inviteUrl"],
  },
  {
    slug: "co-borrower-declined",
    name: "Co-borrower did not qualify",
    audience: "Borrower",
    wbs: "Notifications · Receive notification that the co-borrower did not pass underwriting",
    fields: ["firstName", "coBorrowerName", "inviteUrl"],
    open: "Nothing about WHY, by instruction: the notification \"does not disclose confidential underwriting details\".",
  },
  {
    slug: "loan-funded",
    name: "Loan funded",
    audience: "Borrower",
    wbs: "Notifications · Receive loan funding notification",
    fields: ["firstName", "amount", "firstPayment", "loanUrl"],
  },
  {
    slug: "payment-reminder",
    name: "Payment reminder",
    audience: "Borrower",
    wbs: "Notifications · Receive payment reminders",
    fields: ["firstName", "amount", "dueDate", "cardLast4", "paymentsUrl"],
    open: "How many days before the due date it goes out. The WBS says the schedule is predefined but not what it is.",
  },
  {
    slug: "payment-confirmed",
    name: "Payment confirmation",
    audience: "Borrower",
    wbs: "Notifications · Receive payment confirmation",
    fields: ["firstName", "amount", "paidOn", "cardLast4", "reference", "outstanding", "paymentsUrl"],
  },
  {
    slug: "payment-failed",
    name: "Payment failed",
    audience: "Borrower",
    wbs: "Notifications · Receive payment failed notification",
    fields: ["firstName", "amount", "attemptedOn", "cardLast4", "paymentsUrl"],
  },
  {
    slug: "delinquency-overdue",
    name: "Delinquency · overdue",
    audience: "Borrower",
    wbs: "Notifications · Receive delinquency notifications (day 16)",
    fields: ["firstName", "pastDue", "lateFee", "daysLate", "paymentsUrl"],
  },
  {
    slug: "delinquency-default",
    name: "Delinquency · default",
    audience: "Borrower",
    wbs: "Notifications · Receive delinquency notifications (day 90)",
    fields: ["firstName", "pastDue", "payByDate", "paymentsUrl"],
  },
  {
    slug: "delinquency-accelerated",
    name: "Delinquency · accelerated",
    audience: "Borrower",
    wbs: "Notifications · Receive delinquency notifications (day 120)",
    fields: ["firstName", "outstanding", "payByDate", "paymentsUrl"],
  },
  {
    slug: "unable-to-proceed",
    name: "Unable to proceed",
    audience: "Borrower / Co-borrower",
    wbs: "Notifications · Receive unable-to-proceed notification",
    fields: ["firstName", "reference"],
    open: "No reason and no link, by instruction: it \"shall not disclose sensitive verification or screening details\".",
  },
  {
    slug: "internal-review-task",
    name: "Application waiting for review",
    audience: "Admin / Underwriter",
    wbs: "Notifications · Receive system task notifications",
    fields: ["reference", "reason", "routedOn", "queueUrl"],
  },
  {
    slug: "staff-processing-failure",
    name: "Application stuck after a failure",
    audience: "OPA Staff",
    wbs: "Notifications · Notify OPA Staff about application processing failures",
    fields: ["reference", "borrowerName", "phone", "step", "failedOn", "recordUrl"],
  },
];

function EmailDesigns() {
  const { token } = theme.useToken();
  const [slug, setSlug] = useState(TEMPLATES[0].slug);
  const [lang, setLang] = useState<"en" | "es">("en");

  const current = TEMPLATES.find((t) => t.slug === slug) ?? TEMPLATES[0];
  const file = lang === "en" ? `${current.slug}.html` : `${current.slug}.es.html`;
  const url = `${APP_URL}/emails/${file}`;

  return (
    <Flex vertical gap={24} style={{ padding: 24 }}>
      <Flex vertical gap={4}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Email designs
        </Typography.Title>
        <Typography.Text type="secondary">
          Every email OPA sends, in English and Spanish. Built as standalone HTML
          (tables, inline styles, no images) because mail clients are not browsers.
        </Typography.Text>
      </Flex>

      <Alert
        type="info"
        showIcon
        title="These render from the running app"
        description={`The templates live in public/emails/ and are served by the dev server at ${APP_URL}. If the frame is blank, the app is not running.`}
      />

      <Flex gap={24} align="flex-start" wrap>
        <Flex vertical gap={8} style={{ width: 300, flex: "none" }}>
          {TEMPLATES.map((template) => (
            <Button
              key={template.slug}
              size="large"
              icon={<MailOutlined />}
              style={{
                width: "100%",
                justifyContent: "flex-start",
                textAlign: "start",
                height: "auto",
                paddingBlock: 10,
                ...(template.slug === slug
                  ? {
                      background: token.colorPrimaryBg,
                      color: token.colorPrimary,
                      fontWeight: 500,
                    }
                  : null),
              }}
              type="text"
              onClick={() => setSlug(template.slug)}
            >
              <Flex vertical align="flex-start">
                <span>{template.name}</span>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  {template.audience}
                </Typography.Text>
              </Flex>
            </Button>
          ))}
        </Flex>

        <Flex vertical gap={12} style={{ flex: 1, minWidth: 360 }}>
          <Flex align="center" justify="space-between" gap={12} wrap>
            <Space size="small">
              <Segmented<"en" | "es">
                size="small"
                value={lang}
                onChange={setLang}
                options={[
                  { value: "en", label: "English" },
                  { value: "es", label: "Español" },
                ]}
              />
              <Tag variant="filled">{file}</Tag>
            </Space>
            <Button size="small" icon={<ExportOutlined />} href={url} target="_blank">
              Open on its own
            </Button>
          </Flex>

          <Card styles={{ body: { padding: 0 } }}>
            {/* 680 is 600 for the email plus the ground it sits on, which is
                what a mail client gives it. */}
            <iframe
              key={url}
              src={url}
              title={`${current.name} (${lang})`}
              style={{ width: "100%", height: 760, border: "none", display: "block" }}
            />
          </Card>

          <Card size="small" title="For Dev">
            <Table
              size="small"
              pagination={false}
              rowKey="key"
              columns={[
                { title: "", dataIndex: "key", width: 150 },
                { title: "", dataIndex: "value" },
              ]}
              showHeader={false}
              dataSource={[
                { key: "WBS story", value: current.wbs },
                {
                  key: "Merge fields",
                  value: (
                    <Space size={[4, 4]} wrap>
                      {current.fields.map((f) => (
                        <Tag key={f} variant="filled">{`{{${f}}}`}</Tag>
                      ))}
                    </Space>
                  ),
                },
                { key: "Files", value: `public/emails/${current.slug}.html · .es.html` },
                ...(current.open
                  ? [{ key: "OPA must decide", value: current.open }]
                  : []),
              ]}
            />
          </Card>
        </Flex>
      </Flex>
    </Flex>
  );
}

const meta = {
  title: "System/Email designs",
  component: EmailDesigns,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof EmailDesigns>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllEmails: Story = {};
