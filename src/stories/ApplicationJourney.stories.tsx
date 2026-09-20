// src/stories/ApplicationJourney.stories.tsx
//
// ONE APPLICATION, END TO END — who acts, what they may do, and where it goes.
//
// The Flow Map beside this one answers "what screens exist". This answers a
// different question and the one a reviewer actually asks: what HAPPENS to an
// application, from the borrower starting it to the underwriter settling it,
// and what can be done to it on the way.
//
// EVERY LINE IS THE WBS'S. Each step carries the sentence it comes from, so a
// disagreement between this map and the requirements is visible rather than
// argued about, and nothing here is a flow somebody invented.
//
// Dumb: a constant, rendered. No state, no fetching, no routing.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, Flex, Tag, Typography, theme } from "antd";
import { ExportOutlined } from "@ant-design/icons";
import { StatusPill } from "../shared/ui/StatusPill";
import { pill } from "../shared/ui/tag.styles";
import { getStyles, styles } from "./ApplicationJourney.styles";

/** Where `npm run dev` serves the app — the same port the Flow Map opens. */
const APP_URL = "http://localhost:5183";

type Actor = "borrower" | "coBorrower" | "system" | "underwriter";

const ACTOR_LABEL: Record<Actor, string> = {
  borrower: "Borrower",
  coBorrower: "Co-borrower",
  system: "System",
  underwriter: "Underwriter",
};

type Step = {
  actor: Actor;
  title: string;
  /** The WBS sentence this step exists because of. */
  wbs: string;
  /** Where it happens in the running app, if it has a screen at all. */
  path?: string;
  /** A detour off the main line rather than the next step along it. */
  branch?: boolean;
};

type Phase = { title: string; note: string; steps: Step[] };

const PHASES: Phase[] = [
  {
    title: "The borrower applies",
    note: "Six steps, and the last one submits. Nothing reaches an underwriter until it does.",
    steps: [
      {
        actor: "borrower",
        title: "Start an application",
        wbs: "One active application per borrower is assumed. Or if the user is on the DO NOT lend list, the applicant is not allowed to create a new application.",
        path: "/application",
      },
      {
        actor: "borrower",
        title: "Sign credit authorization and disclosures",
        wbs: "The system shall dynamically generate the required credit authorization, electronic disclosures, consent forms and other application documents based on the borrower's state of residence and applicant role. Electronic signature is performed using DocuSign.",
        path: "/application/new",
      },
      {
        actor: "borrower",
        title: "Provide income and upload proof",
        wbs: "Provide the annual income; upload documents that prove the income (select document type and upload a document).",
        path: "/application/new",
      },
      {
        actor: "borrower",
        title: "Choose the USCIS application and its type",
        wbs: "Their USCIS application (single select) and the application type, WHICH DEFINES THE SIZE OF THE LOAN (single select). The amount is never typed.",
        path: "/application/new",
      },
      {
        actor: "borrower",
        title: "Provide debit card details",
        wbs: "DEBIT only card details are collected using secure embedded form from Repay that works as a 'black box' for OPA. No card information is stored, only card token. Only U.S. debit cards.",
        path: "/application/new",
      },
      {
        actor: "borrower",
        title: "Household info, veteran status, how they heard about OPA",
        wbs: "See the confirmation of application submission; provide their household info (income, size), if they are veterans and select how they heard about OPA.",
        path: "/application/new",
      },
      {
        actor: "borrower",
        title: "Submit",
        wbs: "Submission initiates the Loan Decisioning process.",
        path: "/application/new",
      },
    ],
  },
  {
    title: "A co-borrower, when one is needed or wanted",
    note: "Either the borrower invites one, or Loan Decisioning decides one is required. Until they finish, the application does not move.",
    steps: [
      {
        actor: "borrower",
        title: "Invite a co-borrower",
        wbs: "The borrower shall be able to invite a co-borrower when required or desired: first and last name, email.",
        path: "/application/co-borrower",
      },
      {
        actor: "coBorrower",
        title: "Accept the invitation and create an account",
        wbs: "The system shall allow a co-borrower to create a personal account to securely access the assigned loan application. The invitation shall securely associate the co-borrower with the corresponding loan application.",
        path: "/invitation",
      },
      {
        actor: "coBorrower",
        title: "Complete their part — the same information, signed and carded",
        wbs: "Assuming that they should provide the same info as borrower. Same as borrower, co-borrower should sign all the required documents via DocuSign. The co-borrower shall upload all required supporting documents to prove their income and provide their debit card details.",
        path: "/co-application",
      },
      {
        actor: "borrower",
        title: "Replace them — if the invitation expires or they do not qualify",
        wbs: "A co-borrower invitation expires 5 calendar days after it is sent (Pending, Accepted, Expired). The Borrower may replace the co-borrower multiple times until a qualified one completes the process. Co-borrowers can sponsor up to 3 borrowers.",
        path: "/application/co-borrower",
        branch: true,
      },
      {
        actor: "system",
        title: "Hold the application until they are done",
        wbs: "Applications requiring a co-borrower cannot proceed to underwriting until a qualified co-borrower has accepted the invitation and completed all required application steps.",
      },
    ],
  },
  {
    title: "The system decides what it can",
    note: "No screens of its own — every result of this phase is what the underwriter reads on the application. Identity runs before credit, to keep the bureau's bill down.",
    steps: [
      {
        actor: "system",
        title: "Verify identity, then screen against OFAC",
        wbs: "Verify the borrower's identity using the configured identity verification service (Instant ID). OFAC screening is performed as part of the identity verification process through the LexisNexis InstantID integration.",
      },
      {
        actor: "system",
        title: "NO LEND look-up",
        wbs: "Verify that the applicant does not have an open application or loan, and check name and email against a legacy no lend list and internal system list of recent (6 months) denied application or default status.",
      },
      {
        actor: "system",
        title: "Credit check",
        wbs: "Retrieve the borrower's credit report and credit score. Credit report is requested only after successful identity verification. Equifax. Hard credit inquiry is performed.",
      },
      {
        actor: "system",
        title: "Income verification",
        wbs: "Verify if the borrower / co-borrower provided their income documents. The objective is to verify the EXISTENCE of an income source rather than calculate or validate income amount.",
      },
      {
        actor: "system",
        title: "Determine eligibility — approve, require a co-borrower, or reject",
        wbs: "Automatically approve applications meeting all configured approval criteria; push the application to require a co-borrower; reject the application if the borrower does not match the conditions.",
      },
      {
        actor: "system",
        title: "Route to manual review",
        wbs: "Applications may be routed to manual review from any automated verification step: Identity Verification, Income Verification, Credit Check or Business Rule Evaluation.",
        path: "/staff/applications",
      },
    ],
  },
  {
    title: "The underwriter picks it up",
    note: "The queue holds only what needs a person. Everything an underwriter may do to an application is on its own page — and nothing else is.",
    steps: [
      {
        actor: "underwriter",
        title: "Read the whole application",
        wbs: "View the complete loan application, including borrower and co-borrower information, application status, selected USCIS service, submitted documents, verification results, decision status. Any underwriter can review any application.",
        path: "/staff/applications/A-2476",
      },
      {
        actor: "underwriter",
        title: "Request additional information",
        wbs: "Request additional documents or information from the borrower. Assuming the underwriter should provide a text note with the required details.",
        path: "/staff/applications/A-2481",
      },
      {
        actor: "underwriter",
        title: "Change the approved amount",
        wbs: "Update the requested loan amount to reflect the amount approved based on creditworthiness, income verification and internal lending policies. All changes shall be logged with the previous value, updated value, user, date, and reason. May trigger recalculation of loan terms.",
        path: "/staff/applications/A-2476",
      },
      {
        actor: "underwriter",
        title: "Approve",
        wbs: "Manually approve an application. Approval reason and timestamp are recorded. The borrower should be notified via SMS/Email.",
        path: "/staff/applications/A-2481",
      },
      {
        actor: "underwriter",
        title: "Decline",
        wbs: "Manually decline an application. Decline reason is mandatory. The borrower should be notified via SMS/Email.",
        path: "/staff/applications/A-2481",
      },
      {
        actor: "underwriter",
        title: "Override an automated decision",
        wbs: "Authorized Underwriters shall be able to override an automated approval or decline decision. Override reason is mandatory and recorded for audit purposes.",
        path: "/staff/dashboard",
        branch: true,
      },
    ],
  },
  {
    title: "The borrower answers",
    note: "Only when something was asked for. The application is waiting on them until it comes back.",
    steps: [
      {
        actor: "borrower",
        title: "Send the documents and a note back",
        wbs: "Provide the requested documents or information and resubmit the application for review. Assumed that borrower should have an option to upload documents via the customer portal and add a text note.",
        path: "/application/information",
      },
      {
        actor: "system",
        title: "Back into the queue",
        wbs: "The application returns to the underwriting workflow.",
        path: "/staff/applications",
      },
    ],
  },
  {
    title: "It settles, one way or the other",
    note: "Approval is not the end: the package is generated, both applicants sign, and only then does money move.",
    steps: [
      {
        actor: "system",
        title: "Approved — generate the loan agreement package",
        wbs: "Generate the complete loan document package after loan approval and send it for the electronic signature process.",
        path: "/loan",
      },
      {
        actor: "borrower",
        title: "Review and sign — with the approved amount on it",
        wbs: "Review and electronically sign all loan documents required after loan approval, including the Loan Agreement, before loan funding. The revised amount is used in subsequent loan approval and agreement generation.",
        path: "/loan/sign",
      },
      {
        actor: "system",
        title: "Issue the virtual card",
        wbs: "Request issuance of a prepaid virtual card for the approved borrower. USIO. Card details are NOT stored in OPA, only the card token.",
        path: "/loan",
      },
      {
        actor: "borrower",
        title: "Cancel before the card is used",
        wbs: "Cancel an approved loan before the virtual payment card has been used.",
        path: "/loan",
        branch: true,
      },
      {
        actor: "system",
        title: "Declined — notify, and stop",
        wbs: "The borrower should be notified about the decision via SMS/Email. Only customer-facing decision details are displayed; internal scoring, business rules and decision logic are not exposed to the borrower.",
        path: "/loan",
        branch: true,
      },
    ],
  },
];

/** What the underwriter may NOT do here, and where it lives instead. */
const NOT_HERE: { title: string; wbs: string; path: string }[] = [
  {
    title: "Correct the applicant's own details",
    wbs: "Manage borrower accounts — Admin/Underwriter shall be able to manually update borrower/co-borrower personal data. It lives on the person's record, not on the application.",
    path: "/staff/borrowers/1003",
  },
  {
    title: "Add a borrower to DO NOT LOAN",
    wbs: "Admin / Underwriter / OPA Staff. Also on the person's record — it is a fact about them, not about one application.",
    path: "/staff/borrowers/1003",
  },
  {
    title: "Add documents or comments to the loan",
    wbs: "Update loan details (add documents, comments) — Admin / Underwriter, and only once there is a loan.",
    path: "/staff/loans/app_5ts3wcit",
  },
];

function ActorTag({ actor }: { actor: Actor }) {
  const colour =
    actor === "underwriter" ? "processing" : actor === "system" ? undefined : "success";
  return <StatusPill color={colour}>{ACTOR_LABEL[actor]}</StatusPill>;
}

function StepRow({ step }: { step: Step }) {
  const { token } = theme.useToken();
  const s = getStyles(token);

  return (
    <Flex vertical gap={8} style={step.branch ? s.branch : s.step}>
      <Flex align="center" justify="space-between" gap={12} wrap>
        <Flex align="center" gap={10} wrap style={styles.stepBody}>
          <ActorTag actor={step.actor} />
          <Typography.Text style={styles.stepTitle}>{step.title}</Typography.Text>
          {step.branch ? (
            <Tag variant="filled" style={pill}>
              branch
            </Tag>
          ) : null}
        </Flex>
        {step.path ? (
          <Typography.Link
            href={`${APP_URL}${step.path}`}
            target="_blank"
            rel="noreferrer"
            style={styles.openLink}
          >
            <Flex align="center" gap={6}>
              {step.path}
              <ExportOutlined />
            </Flex>
          </Typography.Link>
        ) : (
          <Typography.Text style={{ ...styles.where, ...s.where }}>
            no screen — the system does it
          </Typography.Text>
        )}
      </Flex>
      <Typography.Text style={{ ...styles.quote, ...s.quote }}>
        {step.wbs}
      </Typography.Text>
    </Flex>
  );
}

function ApplicationJourney() {
  const { token } = theme.useToken();
  const s = getStyles(token);

  return (
    <Flex vertical gap={24} style={styles.page}>
      <Flex vertical gap={8} style={styles.intro}>
        <Typography.Title level={2}>One application, end to end</Typography.Title>
        <Typography.Paragraph type="secondary">
          Who acts, what they may do, and where it goes. Every step carries the
          WBS sentence it exists because of, and links to the screen it happens
          on in the running app. A marked step is a branch off the main line,
          not the next step along it.
        </Typography.Paragraph>
      </Flex>

      <Flex vertical gap={24} style={styles.phases}>
        {PHASES.map((phase, index) => (
          <Card
            key={phase.title}
            title={
              <Flex align="center" gap={12}>
                <Flex align="center" justify="center" style={s.phaseNo}>
                  {index + 1}
                </Flex>
                {phase.title}
              </Flex>
            }
          >
            <Flex vertical gap={12}>
              <Typography.Text type="secondary">{phase.note}</Typography.Text>
              {phase.steps.map((step) => (
                <StepRow key={step.title} step={step} />
              ))}
            </Flex>
          </Card>
        ))}

        <Card title="What the underwriter may NOT do on an application">
          <Flex vertical gap={12}>
            <Typography.Text type="secondary">
              Each of these is a real WBS story with its own screen. None of
              them belongs to the application, so none of them is offered here.
            </Typography.Text>
            {NOT_HERE.map((item) => (
              <Flex key={item.title} vertical gap={8} style={s.step}>
                <Flex align="center" justify="space-between" gap={12} wrap>
                  <Typography.Text style={styles.toolTitle}>
                    {item.title}
                  </Typography.Text>
                  <Typography.Link
                    href={`${APP_URL}${item.path}`}
                    target="_blank"
                    rel="noreferrer"
                    style={styles.openLink}
                  >
                    <Flex align="center" gap={6}>
                      {item.path}
                      <ExportOutlined />
                    </Flex>
                  </Typography.Link>
                </Flex>
                <Typography.Text style={{ ...styles.quote, ...s.quote }}>
                  {item.wbs}
                </Typography.Text>
              </Flex>
            ))}
          </Flex>
        </Card>
      </Flex>
    </Flex>
  );
}

const meta: Meta<typeof ApplicationJourney> = {
  title: "System/Application journey",
  component: ApplicationJourney,
  parameters: { layout: "fullscreen" },
};

export default meta;

export const EndToEnd: StoryObj<typeof ApplicationJourney> = {};
