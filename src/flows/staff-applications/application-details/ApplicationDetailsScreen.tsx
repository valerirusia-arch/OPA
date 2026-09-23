// src/flows/staff-applications/application-details/ApplicationDetailsScreen.tsx
//
// Epic 4, WBS "View application details" — the story with the most UI/UX hours
// in the epic, and the screen everything else in it hangs off.
//
// WBS: "The Underwriter and OPA Staff shall be able to view the complete loan
// application, including borrower and co-borrower information, application
// status, selected USCIS service, submitted documents, verification results,
// decision status and other application-related information."
//
// So every one of those is on this page, and the order runs decision → the
// application → the people who are being checked → what they sent → what has
// been asked of them → what happened. A reviewer opens this to answer one
// question, "can I decide this yet", and the page is arranged to answer it
// from the top down.
//
// WHO MAY DO WHAT, from the WBS's own role column:
//   Approve / Decline / Override / Request info / Change amount — Underwriter
//   Everything else, read-only                                  — OPA Staff
// "OPA Staff has read-only access to application information and cannot modify
// application data or perform business actions." An OPA Staff member sees the
// same page with no action bar and a line saying why, rather than a row of
// buttons that refuse — a disabled control is a promise the product will not
// keep.
//
// Admin is not named on any of these stories. They get the read-only view too.
//
// WHAT IS NOT HERE: an assignee, a queue position, an SLA clock. "Any
// underwriter can review any application" and "there is no process of
// assigning underwriter to the application in this phase".
//
// Dumb: the record comes from mock data keyed by the :id in the route, and
// every action is local state plus a console.log for Dev to wire.

import { useState } from "react";
import dayjs from "dayjs";
import { App, Alert, Button, Card, Col, Flex, Result, Row, Tabs, Tag, Typography, theme } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "@tanstack/react-router";
import { AdminShell } from "../../../shared/ui/AdminShell";
import { AdminPage } from "../../../shared/ui/AdminPage";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { staffNavFor } from "../../../shared/ui/navigation";
import { useStaffViewer } from "../../../shared/ui/viewerRole";
import { pill } from "../../../shared/ui/tag.styles";
import { useT } from "../../../shared/ui/i18n/useT";
import { SessionTimeoutModal } from "../../../features/Auth/ui/SessionTimeoutModal";
import { useIdleTimer, DEFAULT_IDLE_MS } from "../../../features/Auth/ui/useIdleTimer";
import { DetailGrid } from "../../../features/Borrowers/ui/DetailGrid";
import { PageNotice } from "../../../shared/ui/PageNotice";
import { PersonPanel } from "../../../shared/ui/PersonPanel";
import { ApplicationStatusTag } from "../../../features/Borrowers/ui/StatusTags";
import { VerificationList } from "../../../features/Applications/ui/VerificationList";
import { DocumentList } from "../../../features/Loan/ui/DocumentList";
import {
  ApproveModal,
  DeclineModal,
  OverrideModal,
} from "../../../features/Applications/ui/DecisionModals";
import { UnderwritingActions } from "../../../features/Applications/ui/UnderwritingActions";
import type {
  ApplicationPerson,
  ApplicationRecord,
  AuditEntry,
  Decision,
  InformationRequest,
  DecisionSource,
} from "../../../features/Applications/ui/types";
import type { TranslationKey } from "../../../shared/ui/i18n/dictionary";
import { mockApplications } from "../mockApplications";
import { getStyles, styles } from "./ApplicationDetailsScreen.styles";

const money = (amount: number) =>
  `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

export type ApplicationDetailsScreenProps = {
  applications?: ApplicationRecord[];
  viewerName?: string;
  idleMs?: number;
};

export default function ApplicationDetailsScreen({
  applications = mockApplications,
  viewerName,
  idleMs = DEFAULT_IDLE_MS,
}: ApplicationDetailsScreenProps) {
  const viewer = useStaffViewer();
  const name = viewerName ?? viewer.name;
  const navigate = useNavigate();
  const t = useT();
  const { token } = theme.useToken();
  const s = getStyles(token);
  const { message } = App.useApp();
  const { idle, reset: staySignedIn } = useIdleTimer(idleMs);
  const params = useParams({ strict: false }) as { id?: string };

  const record = applications.find((row) => row.id === params.id);

  /**
   * Which dialog is open, if any. Three, not five: requesting information and
   * changing the amount are inline in the actions column now, because the
   * wireframe puts them on the page and both are things an underwriter writes
   * while reading the application a modal would cover.
   */
  const [action, setAction] = useState<"approve" | "decline" | "override">();
  const close = () => setAction(undefined);

  /**
   * The audit trail and the approved amount are held in local state so the
   * prototype reflects a change the moment it is made: saving a new amount
   * appends to the trail below (and to the amount panel's change history) and
   * moves the "Currently" figure, instead of logging to the console and
   * leaving the page saying nothing changed. Seeded from the record; a real
   * build persists these through the mutation Dev wires in.
   */
  const [audit, setAudit] = useState<AuditEntry[]>(record?.audit ?? []);
  const [approvedAmount, setApprovedAmount] = useState<number | undefined>(
    record?.approvedAmount,
  );
  /*
   * THE DECISION, ALSO LOCAL — and it was not.
   *
   * Approving logged to the console and raised a toast, and then the page said
   * exactly what it had said before: the status still read "Pending action",
   * the Approve button was still there offering to do it again, and the
   * History card had no entry. The one action the whole screen exists for was
   * the only one that left no trace, while changing the amount beside it
   * updated live. *"აქ აფრუვს რომ ვაწვები, არ აეფრუვებს."*
   *
   * WBS on all three: "Approval reason and timestamp are recorded", "Decline
   * reason is mandatory", "Override reason is mandatory and recorded for audit
   * purposes" — so each one writes to the trail as well.
   */
  const [decision, setDecision] = useState<Decision | undefined>(record?.decision);
  /*
   * THE REQUESTS AND THE STATUS, for the same reason.
   *
   * Sending a request for more information logged to the console and raised a
   * toast, and the Information requests card below went on saying "Nothing has
   * been asked for" — with the thing that had just been asked for nowhere on
   * the page. The status did not move either, though the whole point of the
   * WBS's story is that the application is now waiting on the borrower.
   */
  const [requests, setRequests] = useState<InformationRequest[]>(
    record?.requests ?? [],
  );
  const [status, setStatus] = useState(record?.status);

  /**
   * ONE WAY TO SETTLE AN APPLICATION, for all three actions.
   *
   * WBS records a reason and a timestamp on every one of them — "Approval
   * reason and timestamp are recorded", "Decline reason is mandatory",
   * "Override reason is mandatory and recorded for audit purposes" — so each
   * writes the decision AND an entry in the trail, by the person who made it.
   */
  /** One stamp format for everything this page records. */
  const stampNow = () => dayjs().format("MMM DD, YYYY HH:mm");

  const settle = (
    outcome: "approved" | "declined",
    source: DecisionSource,
    reason: string | undefined,
    action: TranslationKey,
  ) => {
    const on = stampNow();
    setDecision({ outcome, source, reason, by: viewer.name, on });
    setAudit((entries) => [
      ...entries,
      { id: `d${entries.length + 1}`, on, by: viewer.name, action, reason },
    ]);
    close();
  };

  /** WBS: only an Underwriter performs business actions on an application. */
  const canDecide = viewer.role === "underwriter";

  /**
   * WBS names "Underwriter / OPA Staff" on "View application details" and
   * nobody else. An Admin is not named on any story in this epic, so they are
   * not shown one — the same reading that keeps an Underwriter off the Users
   * page, and the same 403 card.
   */
  const canView = viewer.role !== "admin";

  const shell = (children: React.ReactNode) => (
    <AdminShell
      sections={staffNavFor(viewer.role)}
      activeKey="review-queue"
      userName={name}
      profileTo="/staff/profile"
      onLogout={() => {
        console.log("log out");
        navigate({ to: "/" });
      }}
    >
      {children}
      <SessionTimeoutModal
        open={idle}
        onStaySignedIn={staySignedIn}
        onSignOut={() => {
          console.log("session ended after inactivity");
          navigate({ to: "/" });
        }}
      />
    </AdminShell>
  );

  if (!canView) {
    return shell(
      <AdminPage title={t("queue.title")}>
        <Card>
          <Result
            status="403"
            title={t("access.deniedTitle")}
            subTitle={t("access.deniedDescription")}
            extra={
              <Button
                type="primary"
                onClick={() => navigate({ to: "/staff/borrowers" })}
              >
                {t("access.goToBorrowers")}
              </Button>
            }
          />
        </Card>
      </AdminPage>
    );
  }

  if (!record) {
    return shell(
      <AdminPage title={t("queue.title")}>
        <Card>
          <Result
            status="404"
            title={t("appDetail.notFound")}
            extra={
              <Button type="primary" onClick={() => navigate({ to: "/staff/applications" })}>
                {t("appDetail.back")}
              </Button>
            }
          />
        </Card>
      </AdminPage>
    );
  }

  /**
   * THE APPLICANT, and the person attached to them, drawn differently on
   * purpose.
   *
   * The BORROWER is what this page is about, so their details get the record
   * grid every other detail page uses — a labelled cell per fact, which is how
   * you read a record.
   *
   * The CO-BORROWER is not a second record: they are somebody attached to this
   * application, and the wizard already draws them that way — a name with
   * their details on one line, in a panel. Two identical four-cell grids made
   * them look like two subjects of one page, and the co-borrower's own facts
   * are three short ones. *"კაი იქნებოდა როგორც აპლიკაციაშია, მაგ სტილის რომ
   * იყოს."*
   */
  const person = (heading: string, who: ApplicationPerson) => (
    <Card key={heading} title={heading} style={styles.card}>
      <DetailGrid
        /* This card lives in the evidence column, not across the page. */
        columns={2}
        items={[
          { key: "name", label: t("users.col.name"), value: who.name },
          { key: "email", label: t("field.email"), value: who.email },
          { key: "phone", label: t("field.phone"), value: who.phone },
          { key: "state", label: t("borrowers.col.state"), value: who.state },
        ]}
      />
    </Card>
  );

  const attachedPerson = (heading: string, who: ApplicationPerson) => (
    <Card key={heading} title={heading} style={styles.card}>
      <PersonPanel
        name={who.name}
        meta={`${who.email} · ${who.phone} · ${who.state}`}
        /* THE DOOR TO THEIR RECORD. This page is evidence — an underwriter
           reads it and decides on it. A correction to somebody's details is
           "Manage borrower accounts", which lives on their own record, and a
           co-borrower has one. Without this the page states a fact and gives
           no way to act on it being wrong. */
        trailing={
          who.recordId ? (
            <Button
              type="link"
              style={styles.recordLink}
              onClick={() => navigate({ to: `/staff/borrowers/${who.recordId}` })}
            >
              {t("coBorrower.openRecord")}
            </Button>
          ) : undefined
        }
      />
    </Card>
  );

  /**
   * The checks, at the top of the column, and TABBED WHERE THERE ARE TWO.
   *
   * The wireframe leads with them and tags the card `System`, and both are
   * right: this is the only card on the page nobody at OPA wrote, and it is
   * what an underwriter opens the application to read.
   *
   * Each applicant is checked separately — WBS "Evaluate co-borrower
   * eligibility" runs "the same checks for a co-borrower as for a borrower" —
   * so both results exist and both have to be reachable. They were two
   * identical cards stacked, six rows and a gauge each, which put the second
   * applicant a screen and a half below the first and made the page read as
   * two applications. One card with two tabs holds the same evidence at half
   * the height, and it puts the two side by side where the comparison is: the
   * whole reason a co-borrower is on this application is that the borrower's
   * score did not carry it alone.
   *
   * WITH ONE APPLICANT THERE ARE NO TABS. A single tab labelled "Borrower" is
   * a control that does nothing.
   */
  const checksCard = (
    <Card
      /*
        THE CARD KEEPS ITS TITLE, TABS OR NOT.
        
        It briefly lost it when there were tabs, on the reasoning that the tab
        bar had replaced the head. That made the tabs the top-left object of a
        page-width column, which is where PAGE tabs live — and the page read as
        if switching to "Co-borrower" changed what the whole screen was about,
        the underwriting actions beside it included. It does not: there is one
        application, one amount and one decision, and the tabs switch nothing
        but which applicant's checks you are reading. The title says which card
        they belong to, which is the whole job it was doing.
      */
      title={t("appDetail.checks")}
      style={styles.card}
      extra={
        <Tag variant="filled" style={pill}>
          {t("appDetail.bySystem")}
        </Tag>
      }
    >
      {record.coBorrower ? (
        <Tabs
          style={styles.checksTabs}
          items={[
            {
              key: "borrower",
              label: t("appDetail.borrower"),
              children: <VerificationList results={record.borrower.checks} />,
            },
            {
              key: "coBorrower",
              label: t("appDetail.coBorrower"),
              children: <VerificationList results={record.coBorrower.checks} />,
            },
          ]}
        />
      ) : (
        <VerificationList results={record.borrower.checks} />
      )}
    </Card>
  );

  return shell(
    <AdminPage
      /* The borrower's name, per the wireframe. The application's own id is
         beside it: the name is who this is about, the id is what support gets
         asked for, and a page titled "A-2481" tells an underwriter nothing. */
      title={record.borrower.name}
      back={{
        label: t("appDetail.back"),
        onClick: () => navigate({ to: "/staff/applications" }),
      }}
      titleAfter={
        <Flex align="center" gap={12} wrap>
          <Typography.Text type="secondary" style={{ whiteSpace: "nowrap" }}>
            {record.id}
          </Typography.Text>
          {/* THE STATUS FOLLOWS THE DECISION. It read `record.status`, so an
              application approved on this screen went on saying "Pending
              action" beside the name while the History card underneath said
              it had been approved a second ago — the page disagreeing with
              itself. The record's own status is what it arrived with; once a
              decision is made here, that is the status. */}
          <ApplicationStatusTag
            status={
              decision
                ? decision.outcome === "approved"
                  ? "approved"
                  : "declined"
                : (status ?? record.status)
            }
          />
          {/* The decision's attribution sits right on the status — "Approved
              by System · <date>" — instead of in a banner below. The full story
              (why, automated vs override) lives in the History card; the banner
              only repeated it. *"სტატუსთან by System და თარიღი; ბანერი წავშალე."* */}
          {decision ? (
            <Typography.Text type="secondary" style={{ whiteSpace: "nowrap" }}>
              {t("appDetail.decidedByShort", {
                name: decision.by,
                date: decision.on,
              })}
            </Typography.Text>
          ) : null}
        </Flex>
      }
      /* THE DECISION, AT THE FAR RIGHT OF THE PAGE HEADER — level with the
         applicant's name, where the primary actions belong. Decline / Approve,
         or Override once the rules have settled it. Shown only to the role that
         may decide; the reasons each action captures are asked in their dialogs
         (setAction opens them). *"სულ მარჯვნივ, თაითლის რიგში."* */
      extra={
        canDecide
          ? decision
            ? // Override overturns an AUTOMATED decision only (WBS: "override
              // an automated decision"). Once a human has decided themselves,
              // the decision is final — there is no "change your own decision"
              // action, so this shows nothing beside the status banner.
              decision.source === "automated" ? (
                <Button onClick={() => setAction("override")}>
                  {t("appAction.override")}
                </Button>
              ) : null
            : (
              <Flex gap={8} align="center">
                {/* Hierarchy: Approve is the filled primary, Decline steps back
                    to a SECONDARY button — a light neutral frame, not the heavy
                    red-outlined danger it was. Framed, so it reads as a real
                    button, but clearly the lesser of the two. The gravity of the
                    action is in its confirmation dialog. *"ჩარჩო
                    მეორეხარისხოვანი."*

                    AND THE LABEL IS THE PRODUCT'S QUIET GREY, not red. Red on a
                    button is a promise that pressing it does the damage; this
                    one opens a dialog that asks for a mandatory reason, and
                    nothing is declined until that is answered. A red word beside
                    the filled Approve also made the pair read as two loud
                    buttons competing, which is the opposite of the hierarchy the
                    frame was chosen for. *"მეორადი ფერის იყოს, ოდნავ
                    მონაცრისფრო."* */}
                <Button
                  style={{ color: token.colorTextTertiary }}
                  onClick={() => setAction("decline")}
                >
                  {t("appAction.decline")}
                </Button>
                <Button type="primary" onClick={() => setAction("approve")}>
                  {t("appAction.approve")}
                </Button>
              </Flex>
            )
          : undefined
      }
    >
      {/* Said once, plainly, instead of a row of buttons that refuse.

          Only OPA Staff ever reaches this line now — the WBS puts them here
          read-only and names nobody else but the Underwriter. It still says
          "you" rather than naming the role, because a person reading a page
          does not need to be told what they are called. */}
      {canDecide ? null : (
        <Alert
          style={styles.banner}
          type="info"
          showIcon
          title={t("appDetail.readOnly")}
          description={t("appDetail.readOnlyBody")}
        />
      )}

      {/* The wireframe's two columns: the evidence on the left, what you may
          do about it on the right, so an underwriter writes a note while
          reading the thing the note is about. */}
      <Row gutter={[24, 24]}>
        <Col xs={24} xl={canDecide ? 15 : 24}>

      {checksCard}

      <Card title={t("appDetail.application")} style={styles.card}>
        <DetailGrid
          columns={2}
          items={[
            { key: "uscis", label: t("appDetail.uscis"), value: record.uscisType },
            {
              key: "requested",
              label: t("appDetail.requested"),
              value: (
                <Typography.Text
                  style={record.approvedAmount ? styles.amountWas : styles.amount}
                  type={record.approvedAmount ? "secondary" : undefined}
                >
                  {money(record.requestedAmount)}
                </Typography.Text>
              ),
            },
            // Only once an underwriter has changed it. Shown beside the
            // request rather than replacing it: the pair is the point.
            ...(record.approvedAmount
              ? [
                  {
                    key: "approved",
                    label: t("appDetail.approved"),
                    value: (
                      <Typography.Text style={styles.amount}>
                        {money(record.approvedAmount)}
                      </Typography.Text>
                    ),
                  },
                ]
              : []),
            { key: "submitted", label: t("appDetail.submitted"), value: record.submittedOn },
          ]}
        />
        {/* THE PRODUCT'S OWN NOTICE, not a bare antd Alert. This one was
            drawing itself: antd's default stacks the icon above the sentence,
            so the glyph sat on its own line with the words underneath —
            *"მრგვალი რაცაა, ტექსტს გვერდზე მიუსვი და არა ესე."* PageNotice
            already puts it inline and on the copy's first line, and carries
            the panel every other notice in the product wears. */}
        {record.coBorrowerRequired ? (
          <PageNotice tone="warning" style={styles.note}>
            {t("appDetail.coBorrowerRequired")}
          </PageNotice>
        ) : null}
      </Card>

      {person(t("appDetail.borrower"), record.borrower)}

      {record.coBorrower ? (
        attachedPerson(t("appDetail.coBorrower"), record.coBorrower)
      ) : (
        <Card title={t("appDetail.coBorrower")} style={styles.card}>
          <Typography.Text type="secondary">{t("appDetail.noCoBorrower")}</Typography.Text>
        </Card>
      )}

      {/*
        THE EVIDENCE, OPENABLE.

        This card listed filenames and nothing else: an underwriter looking at
        "payslip.jpg" could read its name and not the pay stub. WBS "View
        application details" puts "submitted documents" among the things this
        role must be able to view, and the borrower's own equivalent story is
        explicit about what viewing means here — "download only, no in-app
        preview is assumed".

        So it is the borrower's own DocumentList: the same documents drawn the
        same way — name, type, date, download — for the person whose job is to
        read them. The staff LOAN record already did this; only the screen the
        decision is made on did not.
      */}
      <Card title={t("appDetail.documents")} style={styles.card}>
        <DocumentList
          documents={record.documents}
          /* Reported the way every other download in the product is — the
             loan record's and the borrower's own are both a console line. */
          onDownload={(doc) => console.log("download application document", record.id, doc.name)}
        />
      </Card>

      <Card title={t("appDetail.requests")} style={styles.card}>
        {requests.length === 0 ? (
          <Typography.Text type="secondary">{t("appDetail.noRequests")}</Typography.Text>
        ) : (
          <Flex vertical>
            {requests.map((request, index) => (
              <Flex vertical key={request.id}>
                <Flex
                  vertical
                  gap={4}
                  style={index > 0 ? s.recordRow : styles.recordRowFirst}
                >
                  <Flex align="center" justify="space-between" gap={12}>
                    <Typography.Text type="secondary" style={styles.meta}>
                      {t("appDetail.askedBy", {
                        name: request.askedBy,
                        date: request.askedOn,
                      })}
                    </Typography.Text>
                    <Tag
                      color={request.answeredOn ? "success" : "warning"}
                      variant="filled"
                      style={pill}
                    >
                      {request.answeredOn
                        ? t("appDetail.answeredOn", { date: request.answeredOn })
                        : t("appDetail.awaitingAnswer")}
                    </Tag>
                  </Flex>
                  <Typography.Text style={styles.note}>{request.note}</Typography.Text>

                  {request.answerNote || request.answerFiles?.length ? (
                    <Flex vertical gap={6} style={s.answer}>
                      {request.answerNote ? (
                        <Typography.Text>{request.answerNote}</Typography.Text>
                      ) : null}
                      {request.answerFiles?.map((file) => (
                        <Flex key={file} align="center" gap={8}>
                          <FileTextOutlined />
                          <Typography.Text>{file}</Typography.Text>
                        </Flex>
                      ))}
                    </Flex>
                  ) : null}
                </Flex>
              </Flex>
            ))}
          </Flex>
        )}
      </Card>

      {/* WBS attaches "recorded", "logged" and "for audit purposes" to four
          separate stories, so the record of what happened is part of the
          screen and not a developer's afterthought. */}
      <Card title={t("appDetail.audit")} style={styles.card}>
        {audit.length === 0 ? (
          <EmptyState title={t("appDetail.noRequests")} />
        ) : (
          <Flex vertical>
            {audit.map((entry, index) => (
              <Flex vertical key={entry.id}>
                <Flex
                  vertical
                  gap={4}
                  style={index > 0 ? s.recordRow : styles.recordRowFirst}
                >
                  <Flex align="center" justify="space-between" gap={12}>
                    <Typography.Text>{t(entry.action)}</Typography.Text>
                    <Typography.Text type="secondary" style={styles.meta}>
                      {entry.on} · {entry.by}
                    </Typography.Text>
                  </Flex>
                  {entry.from || entry.to ? (
                    <Typography.Text type="secondary" style={styles.meta}>
                      {t("audit.from")}: {entry.from} → {t("audit.to")}: {entry.to}
                    </Typography.Text>
                  ) : null}
                  {entry.reason ? (
                    <Typography.Text type="secondary" style={styles.meta}>
                      {t("audit.reason")}: {entry.reason}
                    </Typography.Text>
                  ) : null}
                </Flex>
              </Flex>
            ))}
          </Flex>
        )}
      </Card>

        </Col>

        {/* WBS: "OPA Staff has read-only access to application information and
            cannot modify application data or perform business actions." So the
            column is absent for them, not disabled. */}
        {canDecide ? (
          <Col xs={24} xl={9}>
            {/* The decision (Decline / Approve, or Override) sits in the PAGE
                header, far right of the applicant's name — see the AdminPage
                `extra` above. What stays in this card is the composing work:
                requesting information and changing the amount. */}
            <Card title={t("appDetail.actions")} style={styles.card}>
              <UnderwritingActions
                requestedAmount={record.requestedAmount}
                approvedAmount={approvedAmount}
                decision={decision}
                audit={audit}
                /* WBS: the amount may be adjusted "before the final approval
                   decision", so the panel closes once there is one. */
                canChangeAmount={decision === undefined}
                onRequestInfo={(note) => {
                  console.log("request information", record.id, note);
                  /*
                    WBS: "Underwriter shall be able to request additional
                    documents or information from the borrower", and the
                    borrower's own story answers it — so the application is now
                    WAITING ON THEM. Three things follow from one action: the
                    request joins the list below, the trail records it, and the
                    status becomes "Pending action", which is the word the WBS
                    uses for exactly this state.
                  */
                  const on = stampNow();
                  setRequests((prev) => [
                    ...prev,
                    { id: `r${prev.length + 1}`, askedOn: on, askedBy: name, note },
                  ]);
                  setAudit((prev) => [
                    ...prev,
                    {
                      id: `ri${prev.length + 1}`,
                      on,
                      by: name,
                      action: "audit.infoRequested",
                      reason: note,
                    },
                  ]);
                  setStatus("pendingAction");
                  message.success(t("requestModal.send"));
                }}
                onChangeAmount={({ amount, reason }) => {
                  console.log("update approved amount", record.id, amount, reason);
                  const previous = approvedAmount ?? record.requestedAmount;
                  const now = new Date();
                  const on = `${now.toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })} ${now.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}`;
                  const entry: AuditEntry = {
                    id: `amount-${now.getTime()}`,
                    on,
                    by: name,
                    action: "audit.amountChanged",
                    from: money(previous),
                    to: money(amount),
                    reason,
                  };
                  setAudit((prev) => [...prev, entry]);
                  setApprovedAmount(amount);
                  message.success(t("amountModal.save"));
                }}
              />
            </Card>
          </Col>
        ) : null}
      </Row>

      <ApproveModal
        open={action === "approve"}
        onCancel={close}
        onApprove={(note) => {
          console.log("approve application", record.id, note);
          settle("approved", "manual", note, "audit.approved");
          message.success(t("appAction.approve"));
        }}
      />
      <DeclineModal
        open={action === "decline"}
        onCancel={close}
        onDecline={(reason) => {
          console.log("decline application", record.id, reason);
          settle("declined", "manual", reason, "audit.declined");
          message.success(t("appAction.decline"));
        }}
      />
      <OverrideModal
        open={action === "override"}
        current={decision?.outcome}
        onCancel={close}
        onOverride={(outcome, reason) => {
          console.log("override decision", record.id, outcome, reason);
          settle(outcome, "override", reason, "audit.overridden");
          message.success(t("appAction.override"));
        }}
      />
    </AdminPage>
  );
}
