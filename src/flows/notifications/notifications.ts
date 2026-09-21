// src/flows/notifications/notifications.ts
//
// What OPA has told this person, derived from where they are.
//
// THE FEED IS NOT A LIST SOMEBODY TYPED. Every notification in the WBS is
// triggered by something that happens to an application or a loan — approved,
// declined, funded, a payment taken, a payment missed, an invitation that
// lapsed — and the prototype already knows which of those have happened: it is
// the stage. So the inbox is read off `loanRecord` rather than held beside it,
// and walking the demo dock through the journey fills the bell the way living
// through the journey would.
//
// That also keeps the epic honest. A hand-written feed can show a "payment
// confirmed" on a loan that was never funded; a derived one cannot.
//
// PREVIEW PLUMBING, same category as `loanRecord` itself: a module-level value
// plus `useSyncExternalStore`, no store library, no fetching. Dev replaces it
// with the real notification service and the screens do not change.

import { useSyncExternalStore } from "react";
import type {
  ChannelPreferences,
  NotificationItem,
} from "../../features/Notifications/ui/types";
import type { BorrowerRole } from "../../shared/ui/viewerRole";
import { useBorrowerStage, useLoanRecord, usePaymentsRecord } from "../loan/loanRecord";
import type { BorrowerStage } from "../loan/loanRecord";

/**
 * WHICH NOTIFICATIONS EACH STAGE HAS PRODUCED, newest first.
 *
 * A stage implies its history: somebody whose loan is funded was approved and
 * asked to sign before that, and both of those were notifications. So each
 * entry lists what has been sent BY that point, not only what the stage is.
 *
 * Dates are the mock's own, formatted — the prototype does no date maths, and
 * a relative "2 days ago" would need a clock the design does not have.
 */
const SENT: Record<BorrowerStage, NotificationItem[]> = {
  none: [],

  review: [],

  coBorrower: [
    {
      id: "n-cb-invited",
      kind: "coBorrowerExpired",
      title: "notify.coBorrowerNeededTitle",
      body: "notify.coBorrowerNeededBody",
      tone: "warning",
      on: "Sep 11, 2026",
      to: "/application",
    },
  ],

  /* WBS story 14 says the notification in as many words: "The system should
     notify the borrower that there are issues with co-borrowers (covered in
     Notifications epic)", and the epic's own story is "Receive notification
     that the co-borrower did not pass underwriting". The kind and its copy
     already existed here; no stage reached them, so nothing ever sent it.

     AND ONLY THIS ONE. The `coBorrower` stage's notice is not history, it is a
     live status — "{coBorrower} was invited and has not finished yet. The
     invitation expires {expiresOn}." Carried into this stage it read "was
     invited and has not finished yet. The invitation expires ." with both
     values blank, because the invitation it quotes is spent and gone from the
     record. A stage lists what is still true, not every row it ever had. */
  coBorrowerFailed: [
    {
      id: "n-cb-declined",
      kind: "coBorrowerDeclined",
      title: "notify.coBorrowerDeclinedTitle",
      body: "notify.coBorrowerDeclinedBody",
      tone: "warning",
      on: "Sep 18, 2026",
      to: "/application",
    },
  ],

  needsInfo: [
    {
      id: "n-more-info",
      kind: "moreInformation",
      title: "notify.moreInformationTitle",
      body: "notify.moreInformationBody",
      tone: "warning",
      on: "Sep 04, 2026",
      /* WBS: "Includes a link to continue the application." */
      to: "/application/information",
    },
  ],

  declined: [
    {
      id: "n-declined",
      kind: "applicationDeclined",
      title: "notify.declinedTitle",
      body: "notify.declinedBody",
      tone: "error",
      on: "Sep 12, 2026",
      to: "/loan",
    },
  ],

  approved: [
    {
      id: "n-signing",
      kind: "signingRequest",
      title: "notify.signingTitle",
      body: "notify.signingBody",
      tone: "info",
      on: "Sep 12, 2026",
      to: "/loan/sign",
    },
    {
      id: "n-approved",
      kind: "applicationApproved",
      title: "notify.approvedTitle",
      body: "notify.approvedBody",
      tone: "success",
      on: "Sep 12, 2026",
      to: "/loan",
    },
  ],

  funding: [
    {
      id: "n-signed",
      kind: "signingRequest",
      title: "notify.signedTitle",
      body: "notify.signedBody",
      tone: "success",
      on: "Sep 12, 2026",
      to: "/loan",
    },
    {
      id: "n-approved",
      kind: "applicationApproved",
      title: "notify.approvedTitle",
      body: "notify.approvedBody",
      tone: "success",
      on: "Sep 12, 2026",
      to: "/loan",
    },
  ],

  funded: [
    /* WBS: "confirmation when the loan has been funded and the Virtual Payment
       Card is available… Notification contains link to open OPA app to access
       the loan and card details." */
    {
      id: "n-funded",
      kind: "loanFunded",
      title: "notify.fundedTitle",
      body: "notify.fundedBody",
      tone: "success",
      on: "Sep 14, 2026",
      to: "/loan",
    },
    {
      id: "n-approved",
      kind: "applicationApproved",
      title: "notify.approvedTitle",
      body: "notify.approvedBody",
      tone: "success",
      on: "Sep 12, 2026",
      to: "/loan",
    },
  ],

  cardUsed: [
    {
      id: "n-reminder",
      kind: "paymentReminder",
      title: "notify.reminderTitle",
      body: "notify.reminderBody",
      tone: "info",
      on: "Dec 25, 2026",
      to: "/payments",
    },
    {
      id: "n-paid",
      kind: "paymentConfirmed",
      title: "notify.paidTitle",
      body: "notify.paidBody",
      tone: "success",
      on: "Dec 01, 2026",
      to: "/payments",
    },
    {
      id: "n-funded",
      kind: "loanFunded",
      title: "notify.fundedTitle",
      body: "notify.fundedBody",
      tone: "success",
      on: "Sep 14, 2026",
      to: "/loan",
    },
  ],

  /* WBS story 9's own sequence: a fee on the 16th day, default past 90,
     acceleration past 120 — "notifications about overdue payments, late fees,
     default status and loan acceleration." */
  overdue: [
    {
      id: "n-overdue",
      kind: "overdue",
      title: "notify.overdueTitle",
      body: "notify.overdueBody",
      tone: "warning",
      on: "Jan 17, 2027",
      to: "/payments",
    },
    {
      id: "n-paid",
      kind: "paymentConfirmed",
      title: "notify.paidTitle",
      body: "notify.paidBody",
      tone: "success",
      on: "Dec 01, 2026",
      to: "/payments",
    },
  ],

  default: [
    {
      id: "n-default",
      kind: "inDefault",
      title: "notify.defaultTitle",
      body: "notify.defaultBody",
      tone: "error",
      on: "Apr 02, 2027",
      to: "/payments",
    },
    {
      id: "n-failed",
      kind: "paymentFailed",
      title: "notify.failedTitle",
      body: "notify.failedBody",
      tone: "error",
      on: "Feb 03, 2027",
      to: "/payments",
    },
    {
      id: "n-overdue",
      kind: "overdue",
      title: "notify.overdueTitle",
      body: "notify.overdueBody",
      tone: "warning",
      on: "Jan 17, 2027",
      to: "/payments",
    },
  ],

  accelerated: [
    {
      id: "n-accelerated",
      kind: "accelerated",
      title: "notify.acceleratedTitle",
      body: "notify.acceleratedBody",
      tone: "error",
      on: "May 02, 2027",
      to: "/payments",
    },
    {
      id: "n-default",
      kind: "inDefault",
      title: "notify.defaultTitle",
      body: "notify.defaultBody",
      tone: "error",
      on: "Apr 02, 2027",
      to: "/payments",
    },
  ],

  paidOff: [
    {
      id: "n-paidoff",
      kind: "paymentConfirmed",
      title: "notify.paidOffTitle",
      body: "notify.paidOffBody",
      tone: "success",
      on: "Feb 01, 2027",
      to: "/payments",
    },
    {
      id: "n-funded",
      kind: "loanFunded",
      title: "notify.fundedTitle",
      body: "notify.fundedBody",
      tone: "success",
      on: "Sep 14, 2026",
      to: "/loan",
    },
  ],

  cancelled: [],
};

/**
 * THE TWO THE CO-BORROWER IS NOT SENT.
 *
 * Both are written against `Borrower` alone in the WBS's role column, and
 * both are about the co-borrower themselves — an invitation that lapsed and
 * an applicant who did not pass underwriting. The second one is explicit that
 * it "does not disclose confidential underwriting details"; sending either to
 * the person they are about would be the product doing exactly that.
 *
 * The funding notification is the borrower's too ("the Virtual Payment Card is
 * available", and the co-borrower has no access to the card), but what it
 * announces — the loan is paid out — is theirs to know, so it is reworded
 * rather than withheld. See `notify.fundedBodyCoBorrower`.
 */
const BORROWER_ONLY = new Set(["coBorrowerExpired", "coBorrowerDeclined"]);

/** Read notifications, for this session. Cleared by nothing: read is read. */
const read = new Set<string>();
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const notify = () => listeners.forEach((listener) => listener());

export const markAllRead = (ids: string[]) => {
  ids.forEach((id) => read.add(id));
  notify();
};

export const markRead = (id: string) => {
  read.add(id);
  notify();
};

/**
 * Channel preferences. WBS: "Users may select if they want SMS or email
 * notifications to be sent", and the channel chosen here is the one every
 * story above is delivered on.
 */
let channels: ChannelPreferences = { email: true, sms: false };

export const setChannels = (next: ChannelPreferences) => {
  /* One always stays on — with neither there is no channel for the notices
     this epic does not make optional. See the note on `ChannelPreferences`. */
  if (!next.email && !next.sms) return;
  channels = next;
  notify();
};

export const useChannels = (): ChannelPreferences =>
  useSyncExternalStore(subscribe, () => channels, () => channels);

/** A stable empty list, so an empty feed is not a new array on every read. */
const NONE: NotificationItem[] = [];

/**
 * The feed for this reader, with the unread ones marked.
 *
 * Memoised on the stage and the read count, because `useSyncExternalStore`
 * compares snapshots by identity and a list rebuilt per read is a loop.
 */
let feedMemo: {
  stage?: BorrowerStage;
  role?: BorrowerRole;
  reads: number;
  out: (NotificationItem & { unread: boolean })[];
} = { reads: -1, out: [] };

const buildFeed = (stage: BorrowerStage, role: BorrowerRole) => {
  if (feedMemo.stage === stage && feedMemo.role === role && feedMemo.reads === read.size) {
    return feedMemo.out;
  }
  const out = (SENT[stage] ?? NONE)
    .filter((item) => role === "borrower" || !BORROWER_ONLY.has(item.kind))
    .map((item) => ({ ...item, unread: !read.has(item.id) }));
  feedMemo = { stage, role, reads: read.size, out };
  return out;
};

export const useNotifications = (role: BorrowerRole) => {
  const stage = useBorrowerStage();
  /* Subscribe to reads as well as to the stage: marking one changes the feed
     without changing the journey. */
  useSyncExternalStore(subscribe, () => read.size, () => read.size);
  return buildFeed(stage, role);
};

/**
 * The values the copy needs, read off the same records the pages show.
 *
 * The next instalment, what was paid, what is past due — quoting them from
 * the loan rather than writing them into the feed is what stops a
 * notification saying $120.65 on a page that says $127.35.
 */
/**
 * How many are unread, for the bell's badge.
 *
 * Its own hook rather than `useNotifications(role).filter(...)` in eleven
 * screens: the badge is a number and the panel is a list, and a screen that
 * only draws the number should not have to build the list to get it.
 */
export const useUnreadCount = (role: BorrowerRole) =>
  useNotifications(role).filter((item) => item.unread).length;

export const useNotificationValues = (): Record<string, string> => {
  const record = useLoanRecord();
  const payments = usePaymentsRecord();
  const next = payments?.schedule.find((row) => row.status !== "paid");
  const lastPaid = [...(payments?.schedule ?? [])].reverse().find((row) => row.status === "paid");
  return {
    amount: record?.amount ?? "",
    /* …and once underwriting has turned somebody down, THEY are the
       co-borrower the copy means: the invitation is spent and there is no
       accepted co-borrower, so without this the name goes blank. */
    coBorrower:
      record?.invitation?.invitee ?? record?.coBorrower ?? record?.coBorrowerFailed ?? "",
    expiresOn: record?.invitation?.expiresOn ?? "",
    nextAmount: next?.amount ?? "",
    nextDue: next?.due ?? "",
    paidAmount: lastPaid?.amount ?? next?.amount ?? "",
    pastDue: payments?.balance.pastDue ?? "",
    outstanding: payments?.balance.outstanding ?? "",
    fees: payments?.balance.fees ?? "",
  };
};
