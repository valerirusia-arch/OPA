// src/features/Notifications/ui/types.ts
//
// What OPA tells somebody, and how.
//
// THE WBS'S NOTIFICATIONS EPIC IS ABOUT SENDING, NOT ABOUT A SCREEN. Every one
// of its fifteen stories is "Receive X notification", and the comment under
// the first sets the channel for all of them: "Notification is sent within the
// notification channel selected in user's profile (SMS/Email)." There is no
// story asking for a list of them inside the app.
//
// The wireframe draws one anyway — a bell in the header opening an Inbox, with
// the channel switches at its foot — and it is not a new capability, which is
// why it is built. It is the same set of notifications, seen from the app
// instead of from a mail client, and the header has had a bell since Epic 1
// with nothing behind it. What is NOT invented here is anything to be notified
// about: every kind below is one of the epic's own stories, and the two it
// leaves out are the two the WBS sends to staff by email
// ("Notification through email"), which is not this bell.

import type { TranslationKey } from "../../../shared/ui/i18n/dictionary";

/**
 * One notification kind per WBS story, named after the story.
 *
 * The order is the epic's own. `severity` is not a WBS field — it is how the
 * row is drawn, and it follows from what the story says rather than from a
 * judgement: a decline and a failed payment are not the same news as a
 * funding.
 */
export type NotificationKind =
  /* "Receive Application approved notification" */
  | "applicationApproved"
  /* "Receive Application declined notification" */
  | "applicationDeclined"
  /* "Receive request for additional information" — "Includes a link to
     continue the application." */
  | "moreInformation"
  /* "Receive document signing request" — "triggered by the DocuSign signing
     workflow." */
  | "signingRequest"
  /* "Receive notification that the co-borrower invitation has expired" */
  | "coBorrowerExpired"
  /* "Receive notification that the co-borrower did not pass underwriting" —
     and it "does not disclose confidential underwriting details". */
  | "coBorrowerDeclined"
  /* "Receive loan funding notification" — "confirmation when the loan has been
     funded and the Virtual Payment Card is available." */
  | "loanFunded"
  /* "Receive payment reminders" — "before upcoming payment due dates." */
  | "paymentReminder"
  /* "Receive payment confirmation" */
  | "paymentConfirmed"
  /* "Receive payment failed notification" */
  | "paymentFailed"
  /* "Receive delinquency notifications" — "overdue payments, late fees,
     default status and loan acceleration." One story, four moments. */
  | "overdue"
  | "inDefault"
  | "accelerated"
  /* "Receive unable-to-proceed notification" — identity verification or
     sanctions screening, and it "shall not disclose sensitive verification or
     screening details." */
  | "unableToProceed";

/** How the row is drawn. Not a WBS field; see the note above. */
export type NotificationTone = "info" | "success" | "warning" | "error";

export type NotificationItem = {
  id: string;
  kind: NotificationKind;
  /** The headline, as the wireframe's rows have one. */
  title: TranslationKey;
  /** One line under it. */
  body: TranslationKey;
  /** Values the copy needs — an amount, a date, a name. */
  values?: Record<string, string>;
  tone: NotificationTone;
  /** When it was sent, already formatted: the prototype does no date maths. */
  on: string;
  /**
   * Where it leads.
   *
   * The WBS asks for this on three stories by name — the request for more
   * information "includes a link to continue the application", the funding
   * notification "contains link to open OPA app to access the loan and card
   * details", and the unable-to-proceed one instructs the user to contact
   * Customer Service. The rest lead where their news lives.
   */
  to?: string;
};

/**
 * WHICH CHANNELS THIS PERSON WANTS.
 *
 * WBS: "Manage notification preferences — Users shall be able to manage their
 * preferred communication channels… Users may select if they want SMS or email
 * notifications to be sent." Two independent switches, which is what the
 * wireframe draws, rather than one either/or.
 *
 * One of them always stays on: "notification is sent within the notification
 * channel selected in user's profile", so with neither selected there is no
 * channel to send an Adverse Action letter or a default notice down, and
 * several of this epic's stories are not optional.
 */
export type ChannelPreferences = { email: boolean; sms: boolean };
