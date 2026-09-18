// src/shared/ui/i18n/dictionary.ts
//
// Every user-facing string in the app, in both interface languages.
//
// English is the source of truth: `TranslationKey` is derived from it, so a
// key added here without a Spanish counterpart is a type error rather than a
// half-translated screen. Placeholders are written as {name}.

export const en = {
  // Shared labels
  "common.back": "Back",
  "common.continue": "Continue",
  "common.cancel": "Cancel",
  "common.done": "Done",
  "common.backToSignIn": "Back to sign in",

  // Field labels, shared between registration and profile
  "field.country": "Country of origin",
  "field.countryPlaceholder": "Select country",
  "field.firstName": "First name",
  "field.middleName": "Middle name",
  "field.lastName": "Last name",
  "field.dateOfBirth": "Date of birth",
  "dob.placeholder": "DD MMM YYYY",
  "dob.clear": "Clear date",
  "dob.earlierYears": "Earlier years",
  "dob.laterYears": "Later years",
  "field.ssn": "SSN",
  "field.email": "Email",
  "field.emailPlaceholder": "email@example.com",
  "field.phone": "Phone",
  "field.phoneUs": "Phone (US)",
  "field.street": "Street address",
  "field.city": "City",
  "field.state": "State",
  "field.zip": "ZIP",
  "field.password": "Password",
  "field.passwordPlaceholder": "Enter your password",
  "field.communication": "Communication preference",
  "hint.password": "Min. 8 characters, 1 number, 1 uppercase letter",
  "field.role": "Role",

  // Sign in
  // Not "Welcome back" — this is also the first screen a brand-new applicant
  // sees, and they have never been here before.
  "login.title": "Welcome to OPA",
  "login.subtitle": "Enter your details to access your account.",
  "login.tabBorrower": "Borrower & Co-borrower",
  "login.tabBorrowerShort": "Borrower",
  "login.tabStaff": "OPA staff",
  "login.rememberMe": "Remember me",
  "login.forgotPassword": "Forgot Password?",
  "login.submit": "Sign in",
  "login.noAccount": "Don't have an account?",
  "login.createAccount": "Create an account",
  "login.lockedTitle": "Account locked",
  "login.lockedDescription":
    "Too many failed sign-in attempts. Reset your password to unlock the account, or contact OPA support.",

  // OPA staff hand-off
  "staff.signIn": "Sign in with Microsoft",
  "staff.note":
    "OPA staff accounts are managed by your administrator. You will be redirected to your organisation's Microsoft sign-in page.",

  // Registration
  "register.title": "Create your account",
  "register.haveAccount": "Already have an account?",
  // One screen, one job. Each step says what it is for, and the ones asking
  // for something personal say why.
  "register.stepCount": "Step {current} of {total}",
  "wizard.stepCount": "Step {current} of {total}",
  /** Header wording once the bar is full — the task is no longer ahead of you. */
  "register.personalTitle": "Personal information",
  "register.accountTitle": "Sign-in details",
  "register.accountSubtitle": "Last step. The email and password you will sign in with.",
  "register.personalSubtitle":
    "Start with your legal name and date of birth, exactly as they appear on your documents.",
  "register.contactTitle": "Contact details",
  "register.contactSubtitle":
    "Your phone number and US address. OPA lends in selected states, so your address decides what we can offer you.",
  "register.ssnHint": "Used to confirm your identity. We never show it to anyone else.",

  // Identity check
  "identity.checkingTitle": "Verifying your identity",
  "identity.checkingDescription":
    "This usually takes a few seconds. Please don't close this window.",
  "identity.verifiedTitle": "Identity verified",
  "identity.verifiedDescription": "We confirmed your details.",
  "identity.verifiedNext": "Next, we'll verify your email address.",
  "identity.mismatchTitle": "We couldn't verify your identity",
  "identity.mismatchDescription":
    "Some of the details you entered don't match our records. Review your personal information and try again, or contact OPA support for help.",
  "identity.reviewDetails": "Review my details",
  "identity.contactSupport": "Contact support",
  "identity.errorTitle": "A technical error occurred",
  "identity.errorDescription":
    "We couldn't reach the identity check. Your account is saved and nothing you entered is lost. Try again now, or come back and pick up from here.",
  "identity.tryAgain": "Try again",
  "identity.contactStaff": "Contact OPA staff",
  "identity.finishLater": "Finish later",

  // One-time code
  "verify.emailTitle": "Verify your email",
  "verify.phoneTitle": "Verify your phone",
  "verify.sentTo": "We sent a one-time {length}-digit code to",
  "verify.submit": "Verify",
  "verify.changeEmail": "Change email",
  "verify.changeNumber": "Change number",
  "verify.resend": "Resend code",
  "verify.resendIn": "Resend code ({seconds}s)",
  // Two one-time-code screens in a row look almost identical. Without this,
  // landing on the second one reads as "the code failed, try again".
  "verify.emailVerified": "Email address verified",
  "verify.phoneVerified": "Phone number verified",
  "verify.fallbackEmail": "your email",
  "verify.fallbackPhone": "your phone",

  // Terms and privacy
  "terms.title": "Terms and privacy",
  "terms.description": "Review and accept both documents to create your OPA account.",
  "terms.acceptPrefix": "I have read and accept the",
  "terms.termsOfUse": "Terms of Use",
  "terms.privacyPolicy": "Privacy Policy",
  // Headings, so they read on their own; the two above sit inside a sentence.
  "terms.docTerms": "Terms of Use",
  "terms.docPrivacy": "Privacy Policy",
  "terms.submit": "Create account",
  // Plain-language summary of what the applicant is agreeing to. It is a
  // summary on purpose — the linked documents are the agreement itself.
  "terms.summaryNote":
    "In short, this is what you are agreeing to. The linked documents are the full agreement.",
  "terms.termsPoint1":
    "OPA lends money to cover USCIS filing fees. Whether we approve you, and on what terms, depends on the information you give us and the checks below.",
  "terms.termsPoint2":
    "You confirm the details you entered are accurate and agree to tell us when they change.",
  "terms.termsPoint3":
    "You agree to receive your loan documents electronically and to sign them electronically.",
  "terms.termsPoint4":
    "Your repayment amount, schedule and any fees are set out in the loan agreement you sign before money is disbursed, not here.",
  "terms.privacyPoint1":
    "We collect what you entered on this form, including your date of birth and SSN, to confirm who you are and to decide on your application.",
  "terms.privacyPoint2":
    "We share it with the identity-verification and screening providers we use, and with the servicer that manages your payments.",
  "terms.privacyPoint3":
    "We keep it for as long as lending records must be kept by law, even if your application is declined.",
  "terms.privacyPoint4":
    "You can ask us what we hold about you, and ask us to correct it.",

  // Registration complete
  "done.title": "Your account is ready",
  "done.description": "Your account for {email} is ready.",
  "done.next": "You can start your loan application.",
  "done.primary": "Go to my account",

  // Forgot password
  "forgot.title": "Reset your password",
  "forgot.subtitle": "We'll email you a secure link to set a new password.",
  "forgot.submit": "Send reset link",
  "forgot.sentTitle": "Check your email",
  // Split so the address itself can be set in a stronger weight — it is the
  // one part of the sentence the reader needs to check.
  "forgot.sentBefore": "If an account exists for",
  "forgot.sentAfter": ", we've sent a link to reset the password.",
  "forgot.sendAgain": "Send link again",
  "forgot.openLinkDemo": "Open the emailed link (demo)",
  "forgot.sendAgainIn": "Send link again ({seconds}s)",

  // Set a new password
  "reset.title": "Set a new password",
  "reset.subtitle": "Choose a password you don't use anywhere else.",
  "reset.newPassword": "New password",
  "reset.newPasswordPlaceholder": "Enter new password",
  "reset.confirmPassword": "Confirm password",
  "reset.confirmPasswordPlaceholder": "Confirm new password",
  "reset.submit": "Update password",
  "reset.doneTitle": "Password updated",
  "reset.doneDescription": "Your password has been changed. Sign in with your new password.",
  "reset.goToSignIn": "Go to sign in",

  // Profile. Three subjects, three sections — see ProfileLayout for why.
  "profile.pageTitle": "Profile settings",
  "profile.pageSubtitle": "Your details, how OPA reaches you, and your password.",
  "profile.navPersonal": "Personal information",
  "profile.navContact": "Contact details",
  "profile.navCard": "Payment card",
  "profile.cardSubtitle":
    "Add or update the debit card OPA takes your repayments from. OPA never sees the number — Repay holds it.",
  "profile.navPassword": "Password",
  "profile.passwordSubtitle":
    "Choose a password you don't use anywhere else. You'll stay signed in on this device.",
  "profile.identityTitle": "Personal information (locked)",
  "profile.contactTitle": "Contact details",
  "profile.readOnlyTitle": "Your contact details are read-only for now",
  "profile.readOnlyDescription":
    "You'll be able to update your email, phone and mailing address once your application is approved.",
  "profile.verified": "Verified",
  "profile.unverified": "Not verified",
  "profile.save": "Save changes",
  "profile.passwordTitle": "Password",
  "profile.change": "Change",
  "profile.updated": "Profile updated",
  "profile.passwordUpdated": "Password updated",
  "profile.lockReason": "Contact OPA support to change this. It is used for identity checks.",
  "profile.preferenceHint": "How OPA sends you application updates, payment reminders and receipts.",
  "profile.preferenceSaved": "Notification preference saved",

  // Change password
  "changePassword.title": "Change your password",
  "changePassword.subtitle":
    "You'll stay signed in on this device. Other devices will be signed out.",
  "changePassword.current": "Current password",

  // Staff profile
  "staffProfile.title": "Account details",
  "staffProfile.description":
    "Name and email are managed by Microsoft, contact an OPA admin to change.",
  "staffProfile.lockReason": "Managed by your Microsoft work account.",

  // Session timeout
  "session.title": "Still there?",
  "session.description":
    "For your security we sign you out after a period of inactivity. You'll be signed out in {seconds} seconds.",
  "session.descriptionOne":
    "For your security we sign you out after a period of inactivity. You'll be signed out in 1 second.",
  "session.signOutNow": "Sign out now",
  "session.staySignedIn": "Stay signed in",

  // Top bar
  "header.home": "OPA home",
  "header.notifications": "Notifications",
  /*
    NOTIFICATIONS & COMMUNICATIONS.

    One entry per story in the epic, worded for the two places they appear: the
    bell's inbox and the email template of the same name. What the WBS forbids
    is forbidden here too — the co-borrower notice "does not disclose
    confidential underwriting details", and the unable-to-proceed one "shall
    not disclose sensitive verification or screening details" — so neither
    says why.
  */
  "profile.navNotifications": "Notifications",
  /*
    DASHBOARD. Not a WBS epic — the designer's wireframe — so every string
    here names a fact that already exists on another screen, and the deadlines
    in the "what happens next" list are the WBS's own rules quoted back.
  */
  "dashboard.title": "Dashboard",
  /*
    THE PAGE NAMES WHAT IT IS ABOUT, and the reference is the naming.

    It was "Welcome back, {name}" — the page's largest type spent on a
    greeting, which tells a reader nothing they did not know before they
    opened it. *"ეს თაითლი არ გვინდა, რამე უფრო ინფორმაციული."*

    The reference is the one fact the dashboard LOST when the statement card
    came off it, and it is the fact a borrower is asked for the moment they
    call OPA or write in about their case. It also says, in two words, which
    half of the product they are looking at: an application is a thing under
    review, a loan is a thing being repaid, and they are not the same object.
  */
  "dashboard.titleApplication": "Application {ref}",
  "dashboard.titleLoan": "Loan {ref}",
  /* Nothing open. Not the flat, generic "No application yet" — the designer
     asked for something specific to this page and this product, and with the
     subtitle gone the title carries the whole greeting on its own. *"არ მინდა
     ესეთი თაითლი... რამე უნიკალური და ზუსტი."* It frames the empty page as the
     beginning of the one thing it is for, rather than reporting an absence. */
  "dashboard.titleNone": "Your loan starts here",
  "dashboard.leadNone": "Nothing is open yet. Start an application and it all appears here.",
  "dashboard.leadApplication": "Your application is with OPA. Here is where it stands.",
  "dashboard.leadApplicationCoBorrower":
    "{name}'s application is with OPA. Here is where it stands.",
  "dashboard.urgent": "Running out",
  "dashboard.leadLoan": "Here is your loan, what it costs and what is coming.",
  "dashboard.emptyBody":
    "Once you apply, this page shows what OPA is doing, what you owe and what happens next.",

  "dashboard.tileLoan": "Loan amount",
  "dashboard.tileLoanHint": "{apr} APR",
  "dashboard.tileCard": "Virtual card",
  "dashboard.tileCardUsed": "In use",
  "dashboard.tileCardUnused": "Not used yet",
  "dashboard.tileRepaymentCard": "Your card",
  "dashboard.tileNoCard": "None added",
  "dashboard.tilePayments": "Payments",
  "dashboard.tilePaymentsValue": "{paid} of {total} paid",
  "dashboard.tileDocuments": "Documents",
  "dashboard.tileDocumentsValue": "{count} files",
  "dashboard.tileNothing": "No info yet",

  // The repayment ring and the list beside it.
  "dashboard.ringTitle": "Repayment",
  "dashboard.ringCentre": "repaid",
  "dashboard.ringPaid": "Paid",
  "dashboard.ringOverdue": "Overdue",
  "dashboard.ringLeft": "Left to pay",
  "dashboard.ringCount": "{count} of {total}",
  "dashboard.ringNone": "The ring fills once OPA has funded the loan and the schedule starts.",
  /* The table at the foot of the dashboard. "Recent payments" rather than
     "Recent transactions": a transaction is what the system calls it, a
     payment is what the borrower made. */
  "dashboard.recentTitle": "Recent payments",
  "dashboard.recentAll": "All payments",
  "dashboard.recentNone": "Your payments appear here once the first one is taken.",

  // THE ONE STAGE THE LOAN IS IN. Four titles, and for each of them the line
  // that says what it is waiting on. Every one is a WBS rule.
  "dashboard.stageStep": "Step {index} of {total}",
  "dashboard.stageYou": "Your move",
  "dashboard.stageOpa": "With OPA",
  "dashboard.stageReview": "Under review",
  "dashboard.stageNeedsInfo": "More information needed",
  "dashboard.stageCoBorrower": "Waiting on your co-borrower",
  "dashboard.stageReviewBody":
    "OPA is checking your application. You do not need to do anything while it is with underwriting.",
  "dashboard.stageReviewInfo":
    "An underwriter has asked for something more. Nothing moves until it arrives.",
  "dashboard.stageReviewCoBorrower":
    "Underwriting cannot start until your co-borrower accepts the invitation and finishes their part.",
  "dashboard.stageDeclined": "Not approved",
  "dashboard.stageDeclinedBody": "OPA could not approve this application.",
  "dashboard.stageOpenApplication": "Open the application",
  "dashboard.stageSign": "Sign the loan documents",
  "dashboard.stageOpenDocuments": "Open the documents",
  "dashboard.stageFunding": "OPA is paying out",
  "dashboard.stageCancelledBody":
    "This loan was cancelled before the card was used. Nothing is owed.",
  "dashboard.stageRepaying": "Repaying",
  "dashboard.stageRepayingBody": "{amount} is taken on {due}, and on the 1st of each month after.",
  "dashboard.stageSettled": "Repaid in full",
  "dashboard.stageSettledBody": "Every instalment on the schedule is paid. The loan is closed.",
  "dashboard.stageOpenPayments": "Open payments",
  /* To /loan, where an application under review has its status, its
     documents and its decision. It used to read "Open the application" and
     send the reader back to the form they had already finished. */
  "dashboard.stageSeeStatus": "See the status",
  "dashboard.stageFundedBody":
    "OPA has paid the filing fee and your card is issued. Repayment starts on the 1st, within 45 days of approval.",

  /* THE FIVE STEPS ON THE RAIL. One or two words each: five of them share a
     line across the band, and a step whose name wraps is a step that reads
     as two. "Reviewed" rather than "Approved" because the step is the review
     ENDING, and it ends two ways. */
  "dashboard.trackSubmitted": "Submitted",
  "dashboard.trackReviewed": "Review",
  "dashboard.trackSigned": "Signing",
  "dashboard.trackFunded": "Funding",
  "dashboard.trackRepaid": "Repayment",
  /* The drawer along the band's foot, and the one thing it says when it is
     shut. "Steps so far" rather than "Recent steps": nothing here is recent
     or not, it is simply everything already behind the reader. */
  "dashboard.stepsBehind": "Steps so far",
  /* THE TENSE PROGRESSION, across three moments of one phrase:
       · before funding — the goal marker names the destination ahead:
         "Repayment begins" (trackGoal, future).
       · funded and repaying — the heading here: "Repayment started" (it is
         under way, the schedule is live).
       · paid off — loanPaidOff: "Repayment completed" (done).

     Earlier tries were cut. "Application complete" read as false finality with
     twelve payments still ahead, and the WBS has no "complete" status anyway.
     "Loan funded" echoed the "Funding" step in the drawer below it. Naming the
     repayment phase and moving its tense with the loan's state is what reads
     honestly at every stage. No owner pill: the rail has nothing left to
     report. */
  "dashboard.applicationDone": "Repayment started",
  /* PAID OFF — the one moment "complete" is literally true: every instalment
     paid, outstanding balance $0.00. This is the whole application-and-loan
     journey finished, so it is named for the journey, not the last phase:
     "Application completed", the frame this whole component reads in
     (ApplicationProgress / applicationTrack). It carried false finality on the
     funded state, where payments remained; here nothing remains, so it is
     simply true. Reached only in the four-step model, where Repayment now joins
     the drawer as a finished step with the final payment's date on it. */
  "dashboard.loanPaidOff": "Application completed",
  /* THE DESTINATION, NOT A STEP. It is a verb phrase and not the bare noun
     "Repayment" on purpose: the four words above it are stages, and a fifth
     noun in the same row would read as a fifth stage however it is drawn. */
  "dashboard.trackGoal": "Repayment begins",
  /* WHAT EACH FINISHED STEP WAS, in the past tense, one line each. A row of
     a name and a date says that a step happened and not what it was. Only
     steps BEHIND the reader are given one — see applicationTrack.ts. */
  "dashboard.pastSubmitted": "Your application reached OPA and went into the queue.",
  "dashboard.pastReviewed": "Underwriting finished and OPA reached a decision.",
  "dashboard.pastSigned": "The loan agreement came back signed through DocuSign.",
  "dashboard.pastFunded": "OPA paid the USCIS filing fee and issued your card.",
  "dashboard.pastRepaid": "Every scheduled payment was made and the loan is paid off.",

  "dashboard.appliedFor": "Applied for",
  "dashboard.submittedOn": "Submitted {date}",
  "dashboard.viewApplication": "View application",
  "dashboard.reference": "Reference",
  "dashboard.uscis": "USCIS service",
  "dashboard.loanBand": "Your loan",
  /* Plainly what it is. "Where it has got to" was a sentence doing a label's
     job — the panel beside it is "What happens next", and two conversational
     headings in a row read as a voice rather than as a structure. */
  "dashboard.journeyTitle": "Application progress",

  "dashboard.nextTitle": "What happens next",
  "dashboard.nextNone": "Nothing is scheduled.",
  "dashboard.nextNoneYet": "Once you apply, your dates appear here.",
  "dashboard.journeyNone": "Your application's progress appears here.",
  "dashboard.whenUnset": "—",
  "dashboard.ownerYou": "You",
  "dashboard.ownerOpa": "OPA",

  "dashboard.stepDecision": "OPA reaches a decision",
  "dashboard.stepDecisionBody":
    "Underwriting reviews what you sent. We email and text you the moment there is an answer.",
  "dashboard.stepInvitation": "Your co-borrower finishes their part",
  "dashboard.stepInvitationBody":
    "Underwriting cannot start until they do. If the invitation runs out you can invite somebody else.",
  "dashboard.stepYourPart": "Finish your part of the application",
  "dashboard.stepYourPartBody":
    "The invitation stops working after this date and the application waits until then.",
  "dashboard.stepMoreInfo": "Send what was asked for",
  "dashboard.stepMoreInfoBody":
    "Your application goes back into the review queue as soon as it arrives.",
  "dashboard.stepSign": "Sign the loan documents",
  /*
    WHAT SIGNING COMMITS YOU TO, said before you sign it.

    Both lines used to end at the disbursement — "nothing is paid out until it
    is done" — which describes the good half of the bargain and stops there.
    The rail carried the other half in a fifth grey capsule marked
    "Repayment", and the four-step models take that capsule away. Rather than
    keep a shape whose whole job was to hint, the sentence says it: the date
    the schedule starts and the day of the month it falls on, which is more
    than a capsule ever told anybody.

    It is not a disclosure — the agreement is — but the last screen before a
    signature should not draw a road that ends with money arriving.
  */
  "dashboard.stepSignBody":
    "Signing happens in DocuSign. Nothing is paid out until it is done, and repayment begins within 45 days of approval, on the 1st of the month.",
  "dashboard.stepSignBodyBoth":
    "Signing happens in DocuSign, and both of you sign before OPA pays anything out. Repayment begins within 45 days of approval, on the 1st of the month.",
  "dashboard.stepFunding": "OPA pays out the loan",
  "dashboard.stepFundingBody":
    "Your virtual payment card is issued at the same time. Repayment begins within 45 days of approval, on the 1st of the month.",
  "dashboard.stepPayment": "Pay {amount}",
  "dashboard.stepPaymentBody": "Taken from the card ending {card}.",
  "dashboard.stepLateFee": "A late fee is charged",
  "dashboard.stepLateFeeBody":
    "On the 16th day after a due date: $5.00 or 5% of the missed instalment, whichever is less. One fee per missed payment.",
  "dashboard.stepAcceleration": "The loan is accelerated",
  "dashboard.stepAccelerationBody":
    "Unless the past due balance of {amount} is paid within 30 days, the whole remaining balance falls due.",
  "dashboard.stepAccelerated": "Pay the full balance",
  "dashboard.stepAcceleratedBody":
    "{amount}, interest and fees included, within 30 days of the notice of default.",
  "dashboard.stepFinal": "Final payment",
  "dashboard.stepFinalBody": "The last instalment on the schedule. The loan closes with it.",

  "notify.inbox": "Inbox",
  "notify.markAllRead": "Mark all as read",
  "notify.none": "Nothing to read. We will tell you when something happens.",
  "notify.email": "Email notifications",
  "notify.sms": "SMS notifications",
  "notify.channelHint":
    "Where OPA sends the things it has to tell you. At least one has to stay on.",
  "notify.channelSaved": "Notification settings saved",

  "notify.approvedTitle": "Your application was approved",
  "notify.approvedBody": "OPA can cover your filing fee. The loan documents are next.",
  "notify.declinedTitle": "Your application was declined",
  "notify.declinedBody": "Call OPA and somebody will go through it with you.",
  "notify.moreInformationTitle": "OPA needs one more thing",
  "notify.moreInformationBody": "Send what was asked for and your application carries on.",
  "notify.signingTitle": "Your loan documents are ready to sign",
  "notify.signingBody": "Signing happens in DocuSign. Nothing is paid out until they are signed.",
  "notify.signedTitle": "Your documents are signed",
  "notify.signedBody": "OPA is paying out your loan. We will tell you when the money has moved.",
  /* Borrower only. */
  "notify.coBorrowerNeededTitle": "Your application needs a co-borrower",
  "notify.coBorrowerNeededBody":
    "{coBorrower} was invited and has not finished yet. The invitation expires {expiresOn}.",
  "notify.coBorrowerExpiredTitle": "The co-borrower invitation expired",
  "notify.coBorrowerExpiredBody":
    "{coBorrower} did not use it in time. You can invite somebody else and carry on.",
  "notify.coBorrowerDeclinedTitle": "Your co-borrower did not qualify",
  "notify.coBorrowerDeclinedBody":
    "You can invite somebody else and your application carries on from there.",
  "notify.fundedTitle": "Your loan is funded",
  "notify.fundedBody": "The money has moved and your virtual payment card is ready to use.",
  "notify.fundedBodyCoBorrower": "The money has moved. Repayment starts on the first of the month.",
  "notify.reminderTitle": "A payment is due soon",
  "notify.reminderBody": "{nextAmount} is due on {nextDue}.",
  "notify.paidTitle": "Payment received",
  "notify.paidBody": "{paidAmount} was taken from your card. Thank you.",
  "notify.paidOffTitle": "Your loan is paid off",
  "notify.paidOffBody": "Nothing is left to pay. Thank you.",
  "notify.failedTitle": "A payment did not go through",
  "notify.failedBody": "Nothing was taken. You can try again from the payments page.",
  "notify.overdueTitle": "A payment is overdue",
  "notify.overdueBody": "{pastDue} is past due, and a late fee has been added.",
  "notify.defaultTitle": "Your account is in default",
  "notify.defaultBody":
    "{pastDue} must be paid within 30 days to avoid the loan being accelerated.",
  "notify.acceleratedTitle": "Your loan has been accelerated",
  "notify.acceleratedBody":
    "The full balance of {outstanding} is due within 30 days of the notice of default.",
  "notify.unableTitle": "We cannot continue with your application",
  "notify.unableBody": "Call OPA customer service and somebody will help you.",

  "header.myProfile": "My profile",
  "header.logOut": "Log out",
  "header.language": "Interface language",

  // Navigation
  "nav.openMenu": "Open menu",
  "nav.groupOperations": "Operations",
  "nav.groupAdmin": "Administration",
  "nav.dashboard": "Dashboard",
  "nav.application": "Application",
  "nav.loan": "Loan",
  "nav.payments": "Payments",
  "nav.contact": "Contact",
  "nav.borrowers": "Borrowers",
  "nav.applications": "Applications",
  "nav.reviewQueue": "Review queue",
  "nav.loans": "Loans",
  "nav.payment": "Payment",
  "nav.acquisition": "Acquisition",
  "nav.source": "Source",
  "nav.partners": "Partners & Groups",
  "nav.campaigns": "Campaigns",
  "nav.performance": "Performance report",
  "nav.users": "Users",
  "nav.reporting": "Reporting",

  // Validation — the wording drawn on the "All error statements" wireframe
  "validation.required": "Required field",
  "validation.amount": "Enter an amount greater than zero",
  "validation.cardNumber": "Enter a valid debit card number",
  "validation.cardExpiry": "Enter a valid expiry date as MM/YY",
  "validation.cardExpired": "This card has expired",
  "validation.cardLuhn": "Check the card number. One of the digits is wrong",
  "validation.cardCvv": "CVV must be {count} digits",
  "validation.email": "Enter a valid email address",
  "validation.phone": "Invalid phone number format",
  "validation.ssn": "SSN must be 9 digits",
  "validation.zip": "ZIP code must be 5 digits",
  "validation.dobFuture": "Date of birth cannot be in the future",
  "validation.minAge": "You must be {age} or older",
  "validation.currentPassword": "Enter your current password",
  "validation.confirmPassword": "Confirm your new password",
  "validation.passwordsMismatch": "Passwords do not match",

  // ── Epic 2 — Users management ──────────────────────────────────────────
  // Internal accounts. The WBS gives the Admin create/change/delete, the
  // set-password link and activate/inactivate; OPA Staff only view.
  "users.title": "Users",
  // WBS story 3 gives this page to the Admin and OPA Staff. An Underwriter
  // who reaches it anyway is told so, rather than shown an empty screen.
  "access.deniedTitle": "You don't have access to this page",
  // Generic on purpose: this line is shown on every role-gated back-office
  // screen (the queue, users, acquisition…), so it must not name one screen's
  // subject or roles. It named "the list of internal users" and "Admin or OPA
  // staff", which was wrong everywhere except the Users page.
  "access.deniedDescription":
    "Your role doesn't have access to this page. Head back to the borrowers list.",
  "access.goToBorrowers": "Go to borrowers",
  "users.searchPlaceholder": "Search by name or email",
  "users.new": "New user",
  "users.col.name": "Name",
  "users.col.email": "Email",
  "users.col.role": "Role",
  "users.col.status": "Status",
  "users.col.password": "Password",
  "users.status.active": "Active",
  "users.status.inactive": "Inactive",
  "users.password.set": "Set",
  "users.password.pending": "Pending",
  "users.rowActions": "Actions for {name}",
  "users.action.sendLink": "Send set-password link",
  "users.action.resendLink": "Resend set-password link",
  "users.action.edit": "Edit",
  "users.action.deactivate": "Deactivate",
  "users.action.activate": "Activate",
  "users.action.delete": "Delete",
  "users.empty": "No users match your search",
  "users.emptyHint": "Try a different name or email address.",
  "users.newTitle": "New user",
  "users.newSubtitle":
    "We'll email them a link to set their own password. You never choose it for them.",
  "users.editTitle": "Edit user",
  "users.save": "Save",
  "users.created": "User created. Set-password email sent",
  "users.updated": "User updated",
  "users.linkSent": "Set-password link sent",
  "users.deleted": "User deleted",
  "users.deactivated": "{name} can no longer sign in",
  "users.activated": "{name} can sign in again",
  "users.deleteTitle": "Delete user?",
  "users.deleteBody": "Delete {name}? This cannot be undone.",
  "users.deactivateTitle": "Withdraw access for this account?",
  "users.deactivateBody":
    "{name} will be signed out and won't be able to sign in until you reactivate the account.",
  "users.activateTitle": "Reinstate access for this account?",
  "users.activateBody": "{name} will be able to sign in again.",
  "role.admin": "Admin",
  "role.underwriter": "Underwriter",
  "role.staff": "OPA staff",
  "role.staffHint": "read-only",

  // Filtering a list. The search box stays in the page's own toolbar; the
  // facets collapse into one button so the toolbar reads the same on every
  // screen no matter how many facets a list happens to have.
  "filters.title": "Filters",
  "filters.clearAll": "Clear all",
  "filters.remove": "Remove filter: {name}",
  "borrowers.filterState": "State",
  "borrowers.filterStatus": "Application status",
  "borrowers.filterFlag": "DO NOT LOAN list",

  // Borrowers and co-borrowers, seen from the back office
  "borrowers.title": "Borrowers",
  // WBS: search by name, email or phone number.
  "borrowers.searchPlaceholder": "Search by name, email or phone",
  "borrowers.allStates": "All states",
  "borrowers.allStatuses": "All statuses",
  "borrowers.allFlags": "All borrowers",
  "borrowers.flagOnly": "On DO NOT LOAN",
  "borrowers.flagNone": "Not on DO NOT LOAN",
  "borrowers.col.phone": "Phone",
  "borrowers.col.state": "State",
  "borrowers.col.application": "Application",
  "borrowers.col.address": "Address",
  "borrowers.col.flag": "Flag",
  "borrowers.empty": "No borrowers match these filters",
  "borrowers.emptyHint": "Try a different search, or clear the filters.",
  "borrowers.coBorrowerOf": "Co-borrower of {name}",

  "application.none": "No application",
  "application.submitted": "Submitted",
  "application.review": "Under review",
  "application.coBorrower": "Co-borrower required",
  "application.approved": "Approved",
  "application.declined": "Declined",

  "doNotLoan.tag": "DO NOT LOAN",
  "doNotLoan.add": "Add to DO NOT LOAN",
  "doNotLoan.remove": "Remove from DO NOT LOAN",
  "doNotLoan.addTitle": "Add to the DO NOT LOAN list?",
  "doNotLoan.addBody":
    "{name} will be blocked from starting a new loan application. You can undo this at any time.",
  "doNotLoan.removeTitle": "Remove from the DO NOT LOAN list?",
  "doNotLoan.removeBody": "{name} will be able to apply again.",
  "doNotLoan.added": "Added to the DO NOT LOAN list",
  "doNotLoan.removed": "Removed from the DO NOT LOAN list",

  // Borrower details
  "borrower.back": "Back to borrowers",
  "borrower.manage": "Manage account",
  "borrower.sendLink": "Send set-password link",
  "borrower.moreActions": "More actions for this account",
  "borrower.tab.profile": "Profile",
  "borrower.tab.application": "Application",
  "borrower.tab.coBorrower": "Co-borrower",
  "borrower.tab.loan": "Loan",
  "detail.emailVerified": "Email verified",
  "detail.phoneVerified": "Phone verified",
  "detail.identityVerified": "Identity verified",
  "detail.address": "Address",
  "detail.yes": "Yes",
  "detail.no": "No",
  "detail.status": "Status",
  "detail.uscisType": "USCIS filing type",
  "detail.loanAmount": "Loan amount",
  "detail.annualIncome": "Annual income",
  "detail.incomeDoc": "Income document",
  "detail.coBorrowerRequired": "Co-borrower required",
  "detail.docsSigned": "Underwriting docs signed",
  "detail.householdSize": "Household size",
  "detail.submitted": "Submitted",
  "detail.referral": "Referral",
  "detail.uploaded": "Uploaded",
  "detail.notUploaded": "Not uploaded",
  "detail.amount": "Amount",
  "detail.rate": "Rate",
  "detail.agreementSigned": "Agreement signed",
  "detail.virtualCard": "Virtual card",
  "detail.debitCard": "Debit card",
  "detail.relationship": "Relationship",
  "loan.funded": "Funded",
  "loan.repaying": "Repaying",
  "loan.closed": "Closed",
  "application.emptyTitle": "No application yet",
  "application.emptyDescription": "This borrower hasn't started a loan application.",
  /* The way to the co-borrower's own file, where their details are read and
     changed. Manage account lives on a borrower's record and a co-borrower has
     one — see Borrower.coBorrowerId. */
  "coBorrower.openRecord": "Open their borrower record",
  /* On a co-borrower's OWN file: the applications they co-sign. The only thing
     there that says they are one. WBS caps it at three. */
  "coBorrower.sponsoring": "Co-signs for",
  "coBorrower.sponsoringCap": "A co-borrower may co-sign for up to 3 borrowers.",
  "coBorrower.emptyTitle": "No co-borrower",
  "coBorrower.emptyDescription": "This application has no co-borrower.",
  "loan.emptyTitle": "No loan yet",
  "loan.emptyDescription": "A loan appears here once the application is approved and funded.",

  // Manage borrower account
  "manageBorrower.title": "Manage borrower account",
  "manageBorrower.saved": "Borrower details updated",

  // Set password, from the emailed invitation link
  "setPassword.title": "Set your password",
  "setPassword.subtitle": "Choose a password you don't use anywhere else.",
  "setPassword.forAccount": "You'll sign in as {email}.",
  "setPassword.submit": "Save",
  "setPassword.doneTitle": "Password set",
  "setPassword.doneDescription":
    "Your OPA account is ready. Sign in with your email and new password.",

  // ── Epic 3 — Loan application ──────────────────────────────────────────
  // Entry. WBS story 2: one active application per borrower, and a borrower on
  // the DO NOT LOAN list may not start one.
  "application.title": "Application",
  "application.startTitle": "Start your loan application",
  "application.startSubtitle":
    "We'll walk you through it step by step and show you what OPA can cover.",
  "application.start": "Start application",
  /* Invited and not started. The date is the WBS's five-day expiry. */
  "application.invitedTitle": "{name} asked you to join their application",
  "application.invitedBody":
    "You are the co-borrower on it. Your part takes a few minutes, and the invitation expires on {date}.",
  "application.invitedAction": "Start my part",
  "application.assignedDoneTitle": "Your part is done",
  "application.assignedDoneBody":
    "OPA is reviewing the application now. You can follow where it has got to on your loan page.",
  "application.assignedDoneAction": "See the application",
  /* Two reasons, one state: the WBS blocks a new application when there is
     "an open application or loan". */
  /* The news, not the refusal — see the note on `hasActive` in
     ApplicationGate. The one-at-a-time rule is still stated, in the sentence
     under it, because the WBS does not allow a second application. */
  "application.blockedActiveTitle": "Your application is with OPA",
  /* NOT "pick up where you left off". By the time this page says no, the
     application has been sent: there is nothing to continue, and the only
     thing to do with it is look at where it has got to. */
  "application.blockedActiveBody":
    "OPA is reviewing your application now. You can follow where it has got to on your loan page.",
  "application.resume": "Review my application",
  "application.blockedFlagTitle": "You can't start a new application",
  "application.blockedFlagBody":
    "This account is not eligible to apply at the moment. Contact OPA support if you think that is a mistake.",

  "appStep.account": "Account",
  "appStep.income": "Income",
  "appStep.loan": "Loan details",
  "appStep.coBorrower": "Co-borrower",
  "appStep.sign": "Sign docs",
  "appStep.card": "Debit card",
  "appStep.household": "Household",
  "appStep.review": "Review",

  // Income verification
  "income.title": "Income verification",
  "income.subtitle":
    "What you earn in a year, and something that shows it. This is what underwriting reads first.",
  "income.annual": "Annual income",
  "income.annualPlaceholder": "e.g. 40,000",
  "income.docType": "Document type",
  "income.docTypePlaceholder": "Select a document type",
  "income.uploadRequired": "Upload income documents",
  "income.choose": "Choose a file",
  // One line, not two: the formats and the reason they must be legible are
  // the same instruction, and the step has to fit on a screen.
  "income.uploadHelp": "PDF, JPG or PNG. Underwriting reads these, so they have to be legible.",
  "income.remove": "Remove {name}",

  // Loan details. WBS: two choices — which USCIS application, and the type
  // that decides the amount.
  "loanDetails.title": "Loan details",
  "loanDetails.subtitle": "OPA lends exactly the USCIS filing fee, no more and no less.",
  "loanDetails.uscis": "Your USCIS application",
  "loanDetails.uscisPlaceholder": "Select your application",
  "loanDetails.type": "Application type",
  "loanDetails.typePlaceholder": "Select the type you are filing",
  "loanDetails.amountLabel": "Calculated loan amount",
  "loanDetails.terms": "1% APR · 12-month term",
  "loanDetails.pending": "Choose an application type to see the amount.",

  // Co-borrower. WBS stories 5, 9 and 14.
  /* The invite on its own page, for an application that is already in. */
  /* The borrower's side of the invitation, once it is out. */
  "application.coBorrowerWaitingTitle": "Waiting on your co-borrower",
  "application.coBorrowerWaitingBody":
    "{name} has been invited and their part is not finished yet. The invitation expires on {date}; you can invite somebody else instead.",
  "inviteCoBorrower.title": "Invite a co-borrower",
  "inviteCoBorrower.subtitle":
    "Your application waits here until they accept and finish their part. We email them the invitation; they have five days to use it.",
  "inviteCoBorrower.done": "Back to my application",
  "coBorrowerStep.title": "Co-borrower",
  "coBorrowerStep.subtitle":
    "Someone who applies alongside you and shares responsibility for the loan.",
  "coBorrowerStep.requiredNote":
    "Your application needs a co-borrower, because your income was not verified.",
  "coBorrowerStep.optIn": "I'd like to add a co-borrower",
  "coBorrowerStep.send": "Send invitation",
  "coBorrowerStep.resend": "Send a new invitation",
  "coBorrowerStep.replace": "Replace co-borrower",
  "coBorrowerStep.sent": "Invitation sent",
  "coBorrowerStep.expiresOn": "Expires {date}",
  "coBorrowerStep.acceptedOn": "Accepted {date}",
  "coBorrowerStep.expiredOn": "Expired {date}",
  "coBorrowerStep.sponsorLimit": "One person can co-sign for up to three borrowers.",
  // WBS assumption: "Co-borrowers can sponsor up to 3 borrowers." Stating the
  // rule was not enough — the invitation has to be refusable when it is hit.
  "coBorrowerStep.limitReached":
    "{name} is already a co-borrower on three applications, which is the limit. Invite somebody else.",
  "coBorrowerStep.replaceTitle": "Replace this co-borrower?",
  "coBorrowerStep.replaceBody":
    "{name}'s invitation stops working and they lose access to this application. You can then invite someone else.",
  "coBorrowerStep.replaced": "Invitation cancelled. You can invite someone else",
  "invitation.pending": "Pending",
  "invitation.accepted": "Accepted",
  "invitation.expired": "Expired",

  // Signing. WBS story 1 — the package depends on the state and the role.
  "sign.title": "Sign underwriting documents",
  "sign.subtitle":
    "Prepared for {state} and for your role. Only what underwriting needs is signed now. The loan documents come after approval.",
  "sign.package": "Your document package",
  "sign.open": "Review and sign",
  "sign.external": "DocuSign",
  "sign.externalNote":
    "Signing happens in DocuSign. You add your signature and nothing else. The documents cannot be edited, and today's date is applied for you.",
  "sign.signedTitle": "Signed via DocuSign",
  "sign.signedOn": "Signed on {date}",

  // Debit card. WBS story 6 — Repay's form, and only a token comes back.
  "card.title": "Debit card",
  "card.subtitle":
    "OPA pays your loan out to this card and collects the repayments from it. US debit cards only. Credit cards are not accepted.",
  "card.external": "Repay",
  "card.externalNote":
    "This form belongs to Repay, OPA's payment processor. Your card details go straight to them; OPA keeps only a token that stands in for the card.",
  "card.open": "Enter card details",
  "card.savedCard": "{brand} \u2022\u2022\u2022\u2022 {last4}",
  "card.replace": "Update card",
  "card.update": "Update",
  "card.brandLine": "{brand} debit",
  /* The ownership eyebrow on the borrower's own saved card — see CardFace. */
  "card.owner": "Your card",
  "card.expiresLabel": "Expires",
  // The mock of Repay's embedded form. Labelled as a mock on purpose: the WBS
  // is explicit that these fields are Repay's, not OPA's.
  "card.number": "Card number",
  "card.expiry": "Expiry",
  "card.cvv": "CVV",
  "card.save": "Save card",
  "card.mockNote": "Test data only. Nothing is sent and nothing is stored.",
  "card.fillTest": "Fill a test card",
  "card.active": "Active",
  "card.debitLine": "{brand} Debit · exp {exp}",
  // WBS: "Only U.S. debit cards are supported." OPA cannot tell debit from
  // credit — Repay does, and refuses. This is that refusal, coming back.
  "card.declined": "Repay could not accept this card. Use a US debit card. Credit cards are not supported.",

  // Last details before submitting. WBS story 7.
  "submitStep.title": "A few last details",
  "submitStep.subtitle": "These help OPA understand your situation and reach more people like you.",
  // What is about to be submitted, restated once before the button.
  "summary.title": "What you're submitting",
  "summary.loanAmount": "Loan amount",
  "summary.income": "Annual income",
  "summary.documents": "Documents signed",
  "summary.card": "Debit card",
  "summary.notProvided": "Not provided",

  // The review step. Its own screen because submitting is irreversible:
  // "submission initiates the Loan Decisioning process".
  "review.title": "Summary",
  "review.subtitle":
    "Everything you entered, in one place. Once you submit, nothing can be changed.",
  "review.edit": "Edit",
  "review.view": "Review",
  "review.confirmSaveTitle": "Replace what you entered?",
  "review.confirmSaveBody":
    "This saves your changes over the answers on the application now. Nothing is sent until you press Submit application.",
  // The dialog the review opens instead of walking you back through the wizard.
  "review.saveChanges": "Save changes",
  "review.submit": "Submit application",
  "review.sectionLoan": "The loan",
  "review.sectionIncome": "Income",
  "review.sectionCoBorrower": "Co-borrower",
  "review.sectionDocuments": "Documents",
  "review.sectionCard": "Debit card",
  "review.sectionHousehold": "Household",
  "review.uscis": "USCIS application",
  "review.none": "None",
  "review.notSigned": "Not signed",
  "review.name": "Name",
  "review.status": "Invitation",
  "review.proof": "Proof of income",
  "review.file": "{count} file",
  "review.files": "{count} files",
  "review.noCoBorrower": "Nobody invited",
  "review.signedVia": "Signed {date} via DocuSign",
  // The review has to say WHICH card, not just what kind — the last four are
  // how anybody recognises their own.
  "review.cardLine": "{brand} \u2022\u2022\u2022\u2022 {last4} · exp {exp}",
  "submitStep.householdIncome": "Total household income",
  "submitStep.householdSize": "People in your household",
  "submitStep.veteran": "Are you a veteran?",
  "submitStep.heardAbout": "How did you hear about OPA?",
  "submitStep.heardAboutPlaceholder": "Select one",
  "common.yes": "Yes",
  "common.no": "No",

  // After submitting. WBS story 7 and the note under story 8.
  "submitted.tag": "In review",
  /* Submitted, but underwriting has not started — it cannot until the
     co-borrower finishes. */
  "submitted.tagWaiting": "Waiting on your co-borrower",
  "submitted.title": "Your application is submitted",
  /* The co-borrower's: they finished their half of somebody else's. */
  "submitted.partTitle": "Your part is submitted",
  "submitted.partDescription":
    "OPA is reviewing the application now. You can follow where it has got to on your loan page.",
  /* THE DASHBOARD IS NOT BUILT — its epic has not started, and /dashboard is
     not a route. The one button on this screen pointed there, so the last step
     of the whole application ended on a dead link. What the WBS actually
     offers here is story 4, "view the current application status and details",
     and that is the loan page. */
  "submitted.description":
    "OPA is reviewing it now. You can follow where it has got to on your loan page.",
  // WBS story 14: if the co-borrower fails underwriting, the system resets the
  // borrower's application so a replacement can be invited.
  "submitted.coBorrowerFailedTitle": "Your co-borrower didn't qualify",
  "submitted.coBorrowerFailedBody":
    "OPA reviewed {name} and they did not meet the requirements. Your application is waiting for you. Invite a different co-borrower and it carries on from there.",
  "submitted.inviteAnother": "Invite a different co-borrower",
  "submitted.waitingCoBorrower":
    "Your co-borrower still has their part to finish. Underwriting starts once they have.",
  "submitted.dashboard": "See my application",
  "submitted.contactTitle": "If you need us",

  // Contact — WBS story 8: information only, no interactive elements.
  "contact.title": "Contact us",
  "contact.subtitle": "However you reach us, a person answers.",
  "contact.phone": "Phone",
  "contact.phoneValue": "(800) 555-0142",
  "contact.email": "Email",
  "contact.emailValue": "support@opa.example",
  "contact.hours": "Opening hours",
  "contact.hoursValue": "Monday to Friday, 9:00–18:00 ET",
  "contact.address": "Mailing address",
  "contact.addressValue": "1200 Wilshire Blvd, Suite 400, Los Angeles, CA 90017",
  /* Whether the line is staffed right now — the one thing the printed hours
     do not say, and the reason somebody is reading them. */
  "contact.openNow": "Open now",
  "contact.closedNow": "Closed",
  /* A note under the email address. It says what email IS, not how fast OPA
     answers: the WBS sets no response time and inventing one is a promise. */
  "contact.emailNote": "Best for anything that is not urgent.",
  "contact.callTitle": "Call us",
  "contact.callDesc": "Speak to a person at OPA.",
  "contact.emailTitle": "Email us",
  "contact.emailDesc": "Send OPA support a message.",
  "contact.hoursTitle": "Opening hours",
  "contact.hoursDesc": "When the support line is staffed.",
  "contact.addressTitle": "Mailing address",
  "contact.addressDesc": "Where to send documents by post.",
  "contact.mapLink": "View on Google Maps",

  // The co-borrower's invitation link. WBS story 9.
  "invite.title": "You've been invited as a co-borrower",
  "invite.body": "{name} has asked you to apply alongside them for an OPA loan.",
  "invite.accept": "Create my account",
  "invite.expires": "Expires {date}",
  "invite.expiredTitle": "This invitation has expired",
  "invite.expiredBody":
    "Invitations are good for five days. Ask {name} to send you a new one.",

  // Whose application this is. Shown on every step, because a co-borrower
  // arrives here straight from registering and needs to be told, plainly,
  // that this is somebody else's application and not more sign-up.
  "coApp.contextTitle": "{name}'s loan application",
  "coApp.contextBody": "You joined as a co-borrower. These steps are your part of it.",

  // The co-borrower's own contact step.
  "coApp.accountTitle": "Your contact details",
  "coApp.accountSubtitle":
    "The details {name} gave us. Check them and add what's missing. You'll be asked for the same information the borrower gave.",

  // Reference data — predefined in the database, not editable here.

  // ── Epic 5 — Manage loan ───────────────────────────────────────────────
  "loanPage.title": "Manage loan",
  /* The page holds BOTH — the application while it is being decided, and the
     loan after it is funded — so the empty state has to name both. It said
     "You haven't applied yet", which is only half of what is missing, and is
     also not true of somebody who applied and then cancelled. */
  "loanPage.none": "No application or loan yet",
  "loanPage.noneBody":
    "Start an application and it appears here, with its status, its terms and every document on it.",
  "loanPage.startApplication": "Start an application",

  "loanPage.application": "Application",
  "loanPage.reference": "Reference",
  "loanPage.uscis": "USCIS service",
  "loanPage.amount": "Amount",
  "loanPage.submitted": "Submitted",
  "loanPage.status": "Status",

  // WBS: "download only, no in-app preview is assumed".
  "sign.loanTitle": "Sign your loan agreement",
  "sign.signedOne": "{name} signed",
  "sign.signedAll": "All documents signed",
  /* ONE MESSAGE, NOT A HEADING OVER A PARAGRAPH. The notices lost their
     panel and their bold title with it — a heading for two sentences was
     furniture even when there was a box to hang it in. */
  "sign.loanApproved":
    "Your application was approved. Your loan documents are ready for review and electronic signature, and nothing is paid out until they are signed.",
  "sign.loanDone":
    "Everything is signed. OPA is paying the filing fee, and your virtual card appears on the loan page once the money has moved.",
  "sign.loanPackage": "Documents to review and sign",
  "sign.progress": "{signed} of {count} signed",
  "sign.reviewAndSign": "Review and sign",
  "sign.loanExternalNote": "Signing happens in DocuSign. The documents cannot be changed there: your signature is the only thing you provide, and the date is added automatically.",
  "sign.here": "Sign here",
  "sign.hereHint": "Press the button to add your signature.",
  "sign.signOne": "Sign {name}",
  "sign.signAll": "Sign all {count} remaining",
  /*
    The same action in the card's head. NOT "Sign all 3": the count is
    already under it, beside the bar that shows it, and a number repeated two
    lines apart is the reader checking whether they mean the same thing. What
    the link has to say is WHAT it signs — all of them, in one go — so it says
    that and leaves the counting to the counter.
  */
  "sign.signAllShort": "Sign all documents",
  "sign.backToLoan": "Back to my loan",
  /* THE WBS'S OWN WORD. Story 8 lists "loan amount, remaining unused balance,
     APR, repayment terms and schedule" — and in US consumer lending APR is not
     a synonym for the interest rate, it is the disclosed figure. Calling it
     "Interest rate" on a page whose neighbouring document is a Truth in
     Lending disclosure was the one label in this epic that did not match. */
  "loanPage.interestRate": "APR",
  "loanPage.repaymentStarts": "Repayment starts",
  "loanPage.repayment": "Repayment",
  "loanPage.nextPayment": "Next payment",
  "loanPage.paymentsMade": "Payments made",
  "loanPage.paymentsMadeValue": "{paid} of {count}",
  "loanPage.progressLine": "{paid} of {count} payments made · final payment {due}",
  "loanPage.dueOn": "Due {due}",
  "loanPage.terms": "{count} monthly payments · {apr}",
  "loanPage.viewSchedule": "View full schedule",
  "loanPage.cardEndingLabel": "Card ending",
  "loanPage.cardModalTitle": "Your OPA card",
  "loanPage.cardIssuer": "Virtual card",
  /* The ownership eyebrow on the virtual card's face — see CardFace. */
  "loanPage.cardOwner": "Issued by OPA",
  "loanPage.cardholder": "Cardholder",
  "loanPage.cardExpires": "Expires",
  "loanPage.cardShowDetails": "Show card details",
  "loanPage.cardHideDetails": "Hide details",
  /* The hand-off, named on its own border. */
  "loanPage.cardIssuerView": "USIO secure view",
  "loanPage.cardMock": "Mock",
  "loanPage.cardNumber": "Card number",
  "loanPage.cardCvv": "CVV",
  "loanPage.cardRevealedNote": "These details are shown by USIO, not by OPA. Close this window when you are done — anyone looking at your screen can read them.",
  "loanPage.cancelTitle": "Cancel this loan",
  "loanPage.cancelBody": "You can still cancel while the virtual card is unused. The card is closed and nothing is paid out.",
  "loanPage.cancelClosedTitle": "This loan can no longer be cancelled",
  /* After the fact, on a page that now has no loan on it. Neutral: the
     borrower chose this, so nothing went wrong. */
  "loanPage.documents": "Documents",
  "loanPage.docName": "Name",
  "loanPage.docType": "Type",
  "loanPage.docDate": "Date",
  "loanPage.download": "Download",
  "loanPage.executed": "Signed",
  "loanPage.noDocuments": "Nothing to download yet",

  // WBS story 2: available only after approval.
  "loanPage.signTitle": "Your loan documents are ready to sign",
  "loanPage.signBody": "Signing happens in DocuSign. Nothing is paid out until the loan agreement is signed.",
  /* WBS story 2: the Borrower AND Co-borrower sign before funding, so the
     first of them to finish is told who is left rather than that the loan is
     being paid out. */
  "loanPage.signWaiting": "Your signature is in. OPA pays out once {name} has signed too.",
  "loanPage.sign": "Review and sign",

  // WBS story 5: before the final decision only.
  "loanPage.withdraw": "Withdraw application",
  "withdraw.title": "Withdraw this application?",
  "withdraw.body": "It stops here and OPA will not carry on with it. You can apply again later, and applying again starts from the beginning.",
  "withdraw.confirm": "Withdraw it",
  "withdraw.done": "Application withdrawn",

  // WBS story 8. Read-only.
  "loanPage.loanAmount": "Loan amount",
  "loanPage.unused": "Unused balance",
  "loanPage.schedule": "Repayment schedule",
  "loanPage.payment": "Amount",
  "schedule.scheduled": "Scheduled",
  "schedule.paid": "Paid",
  "schedule.overdue": "Overdue",

  // WBS story 7: the borrower only, and USIO is a black box.
  /* "Virtual payment card" is the WBS's own name for the product and it is
     right in a requirements document; over a card on the borrower's own page
     it reads as a category rather than a possession — three words of
     terminology for the one object on the page that is theirs. The panel says
     whose it is and who issued it, which is what the card itself says.
     *"თაითლი იქნებოდა უკეთესი რამე სხვა — ოპას ქარდი ან რაიმე მსგავსი."* */
  "loanPage.card": "Your OPA card",
  "loanPage.cardBody": "USIO holds the card. OPA never sees or stores the number.",
  "loanPage.cardOpen": "View",
  "loanPage.cardUnused": "Not used yet",
  "loanPage.cardUsed": "In use",

  // WBS story 9: only while the card is unused.
  "loanPage.cancel": "Cancel this loan",
  "cancelLoan.title": "Cancel this loan?",
  "cancelLoan.body": "The card is closed and nothing is paid out. This can only be done while the card is unused, so it cannot be undone once you confirm.",
  "cancelLoan.confirm": "Cancel the loan",
  "cancelLoan.done": "Loan cancelled",
  "loanPage.cancelBlocked": "The card has been used, so the loan can no longer be cancelled. Call OPA support if something is wrong.",

  "loanPage.stageAwaitingSignature": "Waiting for your signature",
  /* Same stage, read by somebody who has already signed it. */
  "loanPage.stageAwaitingOther": "Waiting for {name}",
  "loanPage.stageFunding": "Being paid out",
  /* The one state where the borrower has nothing to do, so the page has to
     say what is happening and who is doing it. WBS: the system requests the
     card from USIO, and Notifications sends the confirmation "when the loan
     has been funded and the Virtual Payment Card is available". */
  "loanPage.fundingTitle": "OPA is paying out your loan.",
  /* SHORT. It ran to four clauses — "nothing for you to do", the card, the
     email, the date — over two lines of a notice that has no box round it any
     more. Two facts survive, and they are the two that are about to happen to
     the reader; "nothing for you to do" is what the title and the With-OPA
     pill already say. */
  "loanPage.fundingBody": "Your virtual card appears here once the money has moved. Repayment starts {date}.",
  /* The co-borrower's: no card is issued to them, so none is promised. */
  "loanPage.fundingBodyCoBorrower": "We email you once the money has moved. Repayment starts {date}.",
  "loanPage.stageFunded": "Funded",
  "loanPage.stageCancelled": "Cancelled",

  /* The journey rail's steps. Every one of them is a state the WBS already
     names; these three are the words for the phases the status enums leave
     unnamed — the signature between approval and funding, the end of the
     schedule, and the moment a decision lands. */
  "loanPage.journeySigned": "Signed",
  "loanPage.journeyRepaid": "Repaid",
  "loanPage.journeyDecision": "Decision",

  "loanPage.submittedOn": "Submitted {date}",
  "loanPage.withdrawTitle": "Withdraw this application",
  "loanPage.withdrawBody": "You can stop the application while no decision has been made. Applying again later starts from the beginning.",

  // WBS story 11 — internal, Admin and Underwriter only.
  "loanAdmin.addTitle": "Add document / comment",
  "loanAdmin.attach": "Attach document",
  "loanAdmin.noteRequired": "Write a comment or attach a document.",
  "loanAdmin.uploadedBy": "Uploaded by",
  "loanAdmin.uploadedBySystem": "System",
  "loanAdmin.docComment": "Comment",
  "loanAdmin.unsigned": "Not signed",
  "loanAdmin.noteAdded": "Added to the loan",
  "loanAdmin.openRecord": "Open the loan record",
  "loanAdmin.loanId": "Loan ID {id}",
  "loanAdmin.cardIssuance": "Virtual card issuance",
  "loanAdmin.cardIssued": "Issued · {last4} ({state})",
  "loanAdmin.cardNotIssued": "Not issued yet",
  "loanAdmin.cardStateUsed": "used",
  "loanAdmin.cardStateUnused": "unused",
  "loanAdmin.repaymentTerms": "Repayment terms",
  "acquisition.title": "Acquisition information",
  "acquisition.source": "Acquisition source",
  "acquisition.partner": "Referral partner",
  "acquisition.campaign": "Marketing campaign",
  "acquisition.notAvailable": "Not available",
  "acquisition.none": "No acquisition information is linked to this loan.",
  "acquisition.allSources": "All acquisition sources",
  "acquisition.allPartners": "All referral partners",
  "acquisition.allCampaigns": "All campaigns",
  "loans.title": "Loan",
  "loans.card": "Loan",
  "loans.searchPlaceholder": "Search by name or email",
  "loans.allStatuses": "All loan statuses",
  "loans.col.borrower": "Borrower",
  "loans.col.amount": "Amount",
  "loans.col.rate": "Rate",
  "loans.col.status": "Loan status",
  "loans.col.agreement": "Agreement",
  "loans.col.funded": "Funded",
  "loans.agreementSigned": "Signed",
  "loans.agreementUnsigned": "Not signed",
  "loans.empty": "No loans match this search",
  "loans.emptyHint": "Clear the search or try another name.",
  "loans.notFound": "That loan does not exist",
  "loans.back": "Back to loans",
  "loanAdmin.comments": "Comments",
  "loanAdmin.noComments": "No comments on this loan",
  "loanAdmin.commentLabel": "Comment",
  "loanAdmin.commentPlaceholder": "What should the next person reading this loan know?",
  "loanAdmin.save": "Save",
  "loanAdmin.funding": "Funding status",

  // Epic 4 — what the borrower sees while the decisioning runs. Each of these
  // is a WBS story with UI/UX hours against it, and each is a state of the
  // entry screen rather than a page of its own: the borrower's own status page
  // belongs to the Loan epic, not this one.
  "application.needsInfoTitle": "We need one more thing",
  "application.needsInfoBody": "Someone reviewing your application has asked for something. Your application waits here until it arrives.",
  "application.needsInfoAction": "See what is needed",
  // WBS: "Technical failures during credit check shall not cause the
  // application to be rejected. The application shall be resumed after the
  // issue is resolved." So this says exactly that, and offers nothing to do.
  "application.checkPausedTitle": "One of our checks is not responding",
  "application.checkPausedBody": "This is on our side, not yours. Nothing you sent is lost and your application has not been refused. It carries on by itself once the service is back.",
  "application.checkPausedAction": "Back to my profile",
  // WBS, credit check: "IF credit score is between XXX and XXX, then email is
  // sent about requiring a co-borrower and co-borrower invite is sent."
  "application.coBorrowerNeededTitle": "Your application needs a co-borrower",
  "application.coBorrowerNeededBody": "A co-borrower applies alongside you and shares responsibility for repaying the loan. Invite one and your application carries on from there.",
  "application.coBorrowerNeededAction": "Invite a co-borrower",
  // WBS, OFAC: "the user is unable to proceed, they receive a message to call
  // customer service". It does NOT say why, and neither does this: the reason
  // is a sanctions screening, which is not a borrower's to argue with on a
  // screen and not ours to publish.
  "application.stoppedTitle": "We can't continue with this application",
  "application.stoppedBody": "Please call OPA support so somebody can go through it with you.",
  "application.stoppedAction": "Call (800) 555-0142",

  // WBS: "Borrower shall be able to provide the requested documents or
  // information and resubmit the application for review."
  "moreInfo.title": "Send what was asked for",
  "moreInfo.subtitle": "Your application goes back for review as soon as you send this.",
  "moreInfo.requested": "What was asked for",
  "moreInfo.askedBy": "{name} asked on {date}",
  "moreInfo.upload": "Documents",
  "moreInfo.uploadHelp": "PDF, JPG or PNG. Underwriting reads these, so they have to be legible.",
  "moreInfo.choose": "Choose a file",
  "moreInfo.note": "Anything you want to add",
  "moreInfo.notePlaceholder": "Optional. A sentence about what you have sent, if it helps.",
  "moreInfo.submit": "Send and resubmit",
  "moreInfo.sent": "Sent. Your application is back with the reviewer.",
  // Neither a document nor a note: there is nothing to send.
  "moreInfo.needSomething": "Attach a document or write a note before sending",

  // ── Epic 4 — Loan decisioning ──────────────────────────────────────────
  // The automated checks, in the order the WBS runs them: identity before
  // credit, "to minimize external credit bureau costs".
  "check.viaInstantId": "LexisNexis InstantID",
  "check.viaSanctions": "OFAC sanctions list",
  "check.viaNoLendList": "DO NOT LOAN and recent-decline lists",
  "check.viaEquifax": "Equifax · score visible only in this portal",
  "check.viaOcr": "OCR result",
  "check.viaRules": "Automated business-rule result",
  "check.identity": "Identity verification",
  "check.ofac": "OFAC screening",
  "check.noLend": "NO LEND look-up",
  "check.credit": "Credit check",
  "check.income": "Income verification",
  "check.rules": "Eligibility outcome",
  /* WHAT EACH CHECK ACTUALLY DID — the second line on its row, straight out of
     the WBS's own description of the story. A label names the check; this says
     what the pipeline looked at, which is the part an underwriter cannot infer
     from "Passed". */
  "check.whatIdentity":
    "LexisNexis InstantID matched the name, date of birth, address and SSN against public records.",
  "check.whatOfac":
    "Screened against the OFAC sanctions list, as part of the identity check.",
  "check.whatNoLend":
    "Looked for an open application or loan, and checked the legacy no-lend list and denials from the last 6 months.",
  "check.whatIncome":
    "Read the uploaded documents to confirm an income source exists. The amount itself is not verified.",
  // The credit-score gauge (see CreditScoreGauge).
  "verify.creditScore": "Credit score",
  "verify.bandPoor": "Poor",
  "verify.bandFair": "Fair",
  "verify.bandGood": "Good",
  "check.pending": "Not run yet",
  "check.passed": "Passed",
  /* NOT "Needs review". This tag is read BY the underwriter, on the queue they
     are already working — telling them to review it names their own job and
     says nothing about the application. The state it actually reports is that
     the automated pipeline could not clear this and stopped: a problem, and the
     lender's own word for it. *"ვარნინგ ან რაიმე უკეთესი ვორდინგი, რომ პრობლემა
     გვაქვა."* It stays distinct from "Failed", which is an answer about the
     applicant, and from "Service unavailable", which is an answer about an
     integration. */
  "check.review": "Flagged",
  "check.failed": "Failed",
  // A technical failure is an answer about the integration, never about the
  // applicant. WBS: it "shall not cause the application to be rejected".
  "check.unavailable": "Service unavailable",
  "check.ranOn": "Ran {date}",
  "check.notRun": "Not run",
  /* Why the eligibility rules are still pending. They run LAST, so a check
     that stopped the pipeline is the reason — see VerificationList. */
  "check.rulesBlocked": "The rules run last. {check} has to be settled first.",

  "application.pendingAction": "Pending action",

  "queue.col.name": "Name",
  "queue.col.source": "Source",
  "queue.col.income": "Income",
  "queue.review": "Review",
  "queue.export": "Export",
  "queue.exportXlsx": "Export as XLSX",
  "queue.exportCsv": "Export as CSV",
  "queue.exported": "Exporting {count} applications",

  "reporting.title": "Reporting",
  "reporting.lead": "Export reports and application data for your records. Files download as XLSX or CSV.",
  "reporting.statApplications": "Applications",
  "reporting.statApproved": "Approved",
  "reporting.statDeclined": "Declined",
  "reporting.statInReview": "In review",
  "reporting.statBorrowers": "Borrowers",

  "acq.save": "Save",
  "acq.col.status": "Status",
  "acq.status.active": "Active",
  "acq.status.inactive": "Inactive",
  "acq.action.edit": "Edit",
  "acq.action.activate": "Activate",
  "acq.action.deactivate": "Deactivate",
  "acq.action.delete": "Delete",
  "acq.rowActions": "Actions for {name}",
  "acq.activateTitle": "Activate this source?",
  "acq.activateBody": "{name} will be available for new loans again.",
  "acq.deactivateTitle": "Deactivate this source?",
  "acq.deactivateBody": "{name} will stop being offered for new loans. Existing attributions are unaffected.",
  "acq.activated": "{name} activated",
  "acq.deactivated": "{name} deactivated",
  "acq.source.title": "Acquisition sources",
  "acq.source.new": "New source",
  "acq.source.newTitle": "New acquisition source",
  "acq.source.editTitle": "Edit acquisition source",
  "acq.source.name": "Name",
  "acq.source.partner": "Partner",
  "acq.source.code": "Code",
  "acq.source.codePlaceholder": "e.g. ORG-SEARCH",
  "acq.source.deleteTitle": "Delete this source?",
  "acq.source.deleteBody": "{name} will be removed. Loans already attributed to it keep their history.",
  "acq.source.created": "Source created",
  "acq.source.updated": "Source updated",
  "acq.source.deleted": "Source deleted",
  "acq.source.empty": "No acquisition sources yet",
  "acq.source.emptyHint": "Create one to start classifying how loans arrive.",
  "acq.saved": "Changes saved",
  "acq.deleteTitle": "Delete this {noun}?",
  "acq.deleteBody": "{name} will be removed. Loans already attributed to it keep their history.",
  "acq.activateTitleGeneric": "Activate this {noun}?",
  "acq.activateBodyGeneric": "{name} will be available again.",
  "acq.deactivateTitleGeneric": "Deactivate this {noun}?",
  "acq.deactivateBodyGeneric": "{name} will stop being offered for new loans. Existing attributions are unaffected.",
  "acq.partner.noun": "partner",
  "acq.group.noun": "partner group",
  "acq.partners.title": "Referral partners",
  "acq.partners.tabPartners": "Referral partners",
  "acq.partners.tabGroups": "Partner groups",
  "acq.partner.new": "New partner",
  "acq.partner.newTitle": "New referral partner",
  "acq.partner.editTitle": "Edit referral partner",
  "acq.partner.name": "Name",
  "acq.partner.group": "Partner group",
  "acq.group.new": "New group",
  "acq.group.newTitle": "New partner group",
  "acq.group.editTitle": "Edit partner group",
  "acq.group.name": "Name",
  "acq.group.code": "Code",
  "acq.campaign.noun": "campaign",
  "acq.campaign.title": "Marketing campaigns",
  "acq.campaign.new": "New campaign",
  "acq.campaign.newTitle": "New marketing campaign",
  "acq.campaign.editTitle": "Edit marketing campaign",
  "acq.campaign.name": "Name",
  "acq.campaign.source": "Source",
  "acq.campaign.period": "Validity period",
  "acq.campaign.empty": "No campaigns yet",
  "acq.campaign.emptyHint": "Create one to track a marketing push.",
  "acq.perf.title": "Lending performance",
  "acq.perf.lead": "Create a credit or consumer-credit report scoped to one acquisition channel.",
  "acq.perf.analyzeBy": "Analyze by",
  "acq.perf.dimCampaign": "Campaign",
  "acq.perf.dimGroup": "Partner group",
  "acq.perf.dimPartner": "Referral partner",
  "acq.perf.dimSource": "Acquisition source",
  "acq.perf.selectValue": "Select one",
  "acq.perf.reportType": "Report",
  "acq.perf.reportCredit": "Credit report",
  "acq.perf.reportConsumer": "Consumer credit report",
  "acq.perf.create": "Create report",
  "acq.perf.created": "Preparing the report for {name}",
  "acq.perf.statLoans": "Total loans",
  "acq.perf.statReports": "Credit reports",
  "acq.perf.statVolume": "Loan volume",
  "acq.perf.statApproval": "Approval rate",
  "acq.perf.byChannel": "By channel",
  "acq.perf.colChannel": "Channel",
  "acq.perf.colLoans": "Loans",
  "acq.perf.colReports": "Credit reports",
  "acq.perf.colApproval": "Approval rate",

  "staffDash.jumpTo": "Jump to",
  "staffDash.quickActions": "Quick actions",
  "staffDash.donutTitle": "Application status",
  "staffDash.donutCenter": "Total",
  "staffDash.statPending": "Pending",
  "staffDash.recentApps": "Recent applications",
  "staffDash.recentLoans": "Recent loans",
  "staffDash.colBorrower": "Borrower",
  "staffDash.colStatus": "Status",
  "staffDash.colAmount": "Amount",
  "reporting.creditTitle": "Credit report",
  "reporting.creditDesc": "Borrower credit reports and scores retrieved from Equifax.",
  "reporting.metroTitle": "Consumer credit reporting (Metro II)",
  "reporting.metroDesc": "The monthly Metro II reporting OPA submits to Equifax.",
  "reporting.appDataTitle": "Application data",
  "reporting.appDataDesc": "The full list of loan applications and their status.",
  "reporting.exported": "Preparing your {report} export",
  "queue.title": "Underwriting queue",
  "queue.col.uscis": "USCIS service",
  "queue.col.amount": "Amount",
  "queue.empty": "No applications match these filters",
  "queue.emptyBody": "Clear a filter, or check back when the next application is submitted.",
  "queue.coBorrowerTag": "Co-borrower",

  "appDetail.back": "Back to applications",
  "appDetail.notFound": "No application with that number",
  "appDetail.borrower": "Borrower",
  "appDetail.coBorrower": "Co-borrower",
  "appDetail.checks": "Verification results",
  "appDetail.application": "Application",
  "appDetail.documents": "Documents",
  "appDetail.requests": "Information requests",
  "appDetail.audit": "History",
  "appDetail.requested": "Requested amount",
  "appDetail.approved": "Approved amount",
  "appDetail.uscis": "USCIS service",
  "appDetail.submitted": "Submitted",
  "appDetail.coBorrowerRequired": "A co-borrower is required for this application",
  "appDetail.noCoBorrower": "No co-borrower on this application",
  "appDetail.noRequests": "Nothing has been asked for",
  "appDetail.askedBy": "Asked by {name} on {date}",
  "appDetail.answeredOn": "Answered {date}",
  "appDetail.awaitingAnswer": "Waiting for the borrower",
  "appDetail.decidedBy": "{outcome} by {name} on {date}",
  "appDetail.decidedByShort": "by {name} · {date}",
  "appDetail.sourceAutomated": "Automated",
  "appDetail.sourceManual": "Manual",
  "appDetail.sourceOverride": "Override",
  // WBS: "OPA Staff has read-only access to application information and cannot
  // modify application data or perform business actions."
  "appDetail.readOnly": "You have read-only access to applications",
  "appDetail.readOnlyBody": "You can see everything on this page. Deciding, requesting information and changing the amount belong to an Underwriter.",

  "appAction.approve": "Approve",
  "appAction.decline": "Decline",
  "appAction.override": "Override decision",
  "appDetail.actions": "Underwriting actions",
  "appDetail.bySystem": "System",
  "appDetail.coBorrowerChecks": "Verification results, co-borrower",
  "appAction.autoDecided": "The system decided this automatically: {outcome}.",
  "appAction.alreadyDecided": "This application has already been decided: {outcome}.",
  "appAction.outcome.approved": "approved",
  "appAction.outcome.declined": "declined",
  "amountPanel.currentIs": "Currently {amount}",
  "amountPanel.newAmount": "New amount (USD)",
  "amountPanel.history": "Change history",
  "amountPanel.noChanges": "The amount has not been changed.",
  "amountPanel.colWhen": "When",
  "amountPanel.colChange": "Change",
  "amountPanel.colBy": "By",
  "amountPanel.colReason": "Reason",
  "amountPanel.reasonPlaceholder": "e.g. USCIS fee change",
  "appAction.requestInfo": "Request information",
  "appAction.editAmount": "Change amount",

  "approveModal.title": "Approve this application?",
  "approveModal.body": "The borrower is notified as soon as you approve. The loan documents are generated after this.",
  "approveModal.reason": "Note (optional)",
  "approveModal.reasonHint": "Recorded with your name and the time.",
  "declineModal.title": "Decline this application?",
  "declineModal.body": "The borrower is notified as soon as you decline. This cannot be undone from here.",
  "declineModal.reason": "Reason",
  "declineModal.reasonHint": "Required. It is recorded and used in the notice the borrower receives.",
  "overrideModal.title": "Override this decision?",
  "overrideModal.body": "This replaces the decision the rules made. The previous decision stays in the history.",
  "overrideModal.outcome": "New decision",
  "overrideModal.reason": "Reason",
  "overrideModal.reasonHint": "Required and kept for audit.",
  "requestModal.title": "Request information",
  "requestModal.body": "The borrower is emailed and the application moves to Pending action until they answer.",
  "requestModal.note": "What do you need?",
  "requestModal.notePlaceholder": "Be specific: what is missing, and what would settle it.",
  "requestModal.send": "Send request",
  "amountModal.title": "Change the requested amount",
  "amountModal.body": "Use this when the amount you can approve is not the amount that was asked for. Changing it may recalculate the loan terms and regenerate the documents.",
  "amountModal.requested": "Requested",
  "amountModal.newAmount": "Approved amount",
  "amountModal.reason": "Reason",
  "amountModal.reasonHint": "Required. Logged with the previous and the new value.",
  "amountModal.save": "Save amount",

  "audit.submitted": "Application submitted",
  "audit.routed": "Sent for manual review",
  "audit.coBorrowerRequired": "Co-borrower required",
  "audit.coBorrowerCompleted": "Co-borrower completed their part",
  "audit.checkUnavailable": "A check could not run",
  "audit.approvedAuto": "Approved automatically",
  "audit.declinedAuto": "Declined automatically",
  "audit.approved": "Approved",
  "audit.declined": "Declined",
  "audit.overridden": "Decision overridden",
  "audit.infoRequested": "Information requested",
  "audit.infoSubmitted": "Borrower answered",
  "audit.amountChanged": "Approved amount changed",
  "audit.from": "From",
  "audit.to": "To",
  "audit.reason": "Reason",

  "uscis.n400": "N-400 · Application for Naturalization",
  "uscis.i485": "I-485 · Adjust Status / Register Permanent Residence",
  "uscis.i765": "I-765 · Application for Employment Authorization",
  "uscis.i130": "I-130 · Petition for Alien Relative",
  "uscis.n600": "N-600 · Application for Certificate of Citizenship",
  "applicationType.single": "One applicant, standard fee",
  "applicationType.singleReduced": "One applicant, reduced fee",
  "applicationType.family2": "Two applicants",
  "applicationType.family3": "Three applicants",
  "incomeDoc.paystub": "Recent pay stub",
  "incomeDoc.w2": "W-2",
  "incomeDoc.taxReturn": "Tax return",
  "incomeDoc.bankStatement": "Bank statement",
  "incomeDoc.employerLetter": "Letter from employer",
  "heardAbout.search": "Search engine",
  "heardAbout.friend": "Friend or family",
  "heardAbout.community": "Community organization",
  "heardAbout.attorney": "Immigration attorney",
  "heardAbout.social": "Social media",
  "heardAbout.other": "Somewhere else",
  "doc.creditAuthorization": "Credit authorization",
  "doc.eConsent": "Electronic communications consent",
  "doc.privacyNotice": "Privacy notice",
  "doc.creditScoreDisclosure": "Credit score disclosure",
  "doc.coBorrowerAcknowledgement": "Co-borrower acknowledgement",
  "doc.caPrivacy": "California consumer privacy notice",
  "doc.nyDisclosure": "New York borrower disclosure",
  "doc.txDisclosure": "Texas consumer disclosure",

  // Epic 6 — Manage payments. Sixteen WBS stories; four of them are "System"
  // and have no interface, which is why the rules they define are STATED here
  // instead: a borrower cannot check a calculation they were never shown.
  "payments.title": "Payment",
  "payments.tabScheduled": "Scheduled payment",
  "payments.tabAdditional": "Additional payment",
  "payments.installmentLabel": "Installment",
  "payments.installmentPlaceholder": "Choose an installment",
  "payments.installmentRequired": "Choose which installment you are paying.",
  "payments.installmentOption": "#{number} · Due {due} · {amount}",
  "payments.payingWith": "Paying {amount} with {brand} Debit •••• {last4}.",
  "payments.borrower": "Borrower",
  "payments.number": "#",
  "payments.dueDate": "Due date",
  "payments.payNow": "Pay now",
  /* SHORT, because it shares a baseline with the balance rather than a line
     of its own — and short here means DROPPING THE AMOUNT, not the words. A
     second sum beside the one figure the card exists to state is what made
     the pair read as crowded; the date is the part that is not already
     answered above it. */
  "payments.nextPaymentLine": "Next on {due}",
  "payments.savedCard": "Saved payment card",
  "payments.filterByBorrower": "Filter by borrower",

  "payments.noneTitle": "There is nothing to repay yet",
  "payments.noneBody": "Your repayment schedule is created when the loan is paid out. It will appear here with every payment due date.",
  "payments.viewLoan": "Go to my loan",
  /* Nothing at all — not even an application. This page is one of two a
     first-time visitor can land on, so it says what to do rather than
     pointing at a loan page that is just as empty. */
  "payments.noLoanTitle": "No payments yet",
  "payments.noLoanBody":
    "Payments start once OPA has funded a loan for you. Apply first and the schedule appears here.",
  "payments.startApplication": "Start an application",

  // WBS story 3, and story 10's fees alongside it.
  "payments.outstanding": "Outstanding balance",
  "payments.makePayment": "Make a payment",
  "payments.nothingDue": "Nothing left to pay",
  "payments.feesApplied": "Fees applied",
  "payments.payoffToday": "Pay off today",
  "payments.maturity": "Final payment due",

  // WBS story 9's three consequences, in the borrower's words. Nothing here is
  // softened: at 96 days past due somebody is a month from owing the lot.
  "payments.overdueTitle": "A payment is {days} days overdue",
  "payments.overdueBody": "{pastDue} is past due. A late fee is charged on the 16th day after a due date, and it is $5.00 or 5% of the missed payment, whichever is less. Only one fee is charged per missed payment.",
  "payments.defaultTitle": "This account is in default, {days} days past due",
  "payments.defaultBody": "An account more than 90 days past due is in default. The full past due balance of {pastDue} must be paid within 30 days to avoid the loan being accelerated.",
  "payments.acceleratedTitle": "This loan has been accelerated, {days} days past due",
  "payments.acceleratedBody": "An account more than 120 days past due is accelerated. The full remaining balance of {outstanding}, including interest and outstanding fees, must be paid within 30 days of the notice of default. The APR stays at {apr}.",

  // The same three states as a STATE, not a sentence: what a pill beside the
  // balance can carry. The titles above are still the notice's own wording;
  // these are the label on the money it is about.
  "payments.stateOverdue": "{days} days overdue",
  "payments.stateDefault": "In default · {days} days",
  "payments.stateAccelerated": "Accelerated · {days} days",
  /* The past-due amount as a named figure beside the other three, which is
     WBS story 10's "overdue payment information" where the borrower is
     already reading what they owe. */
  "payments.pastDueLabel": "Past due",
  /* THE PERCENTAGE, AND NOTHING ELSE. It read "{percent}% repaid · {paid} of
     {total} instalments", which put three facts under a bar that draws one —
     and the instalment count is the Payments tile's own sentence. A bar needs
     its number, not a caption. */
  "payments.progressLine": "{percent}%",
  /* Under the row of instalment capsules. Counts, not a percentage: nobody
     repays 25% of anything, they repay twelve payments.

     IT SAYS BOTH NUMBERS. "9 to go" was tried and the designer sent it back
     as harder to read, which it is: a remainder makes you do the subtraction
     backwards to find out where you are. "3 of 12 paid" states the position
     and the length of the road in one phrase, and it is how the payments tile
     and the loan page's statement already say it. */
  "payments.progressCount": "{paid} of {total} paid",

  // WBS story 2, shared with the internal view in story 14.

  // WBS story 10's reference material, stated rather than summarised.
  "payments.rulesTitle": "How late fees and overdue accounts work",
  "payments.ruleLateFee": "If a monthly payment is not received within 15 calendar days after the due date, a late fee is charged on the 16th day. The fee is $5.00 or 5% of the unpaid payment, whichever is less. Only one late fee is charged for each missed payment.",
  "payments.ruleDefault": "An account more than 90 days past due is considered in default. The full past due balance must then be paid within 30 days to avoid the loan being accelerated.",
  "payments.ruleAcceleration": "An account more than 120 days past due is accelerated: the full remaining balance, including interest and outstanding fees, must be paid within 30 days of the notice of default. The APR stays at 1%.",

  // WBS stories 4, 12 and 13.
  "payments.history": "Payment history",
  "payments.date": "Date",
  "payments.method": "Paid with",
  "payments.cardEnding": "•••• {last4}",
  "payments.reference": "Reference",
  "payments.paidByBorrower": "Borrower's card",
  "payments.paidByCoBorrower": "Co-borrower's card",
  "payments.retry": "Try again",
  "payments.noHistory": "No payments yet",
  "payments.noHistoryBody": "Every attempt appears here, whether it went through or not.",
  /* THE WBS'S OWN WORD, twice: "review all COMPLETED, pending, failed,
     refunded and reversed payment transactions" — the borrower's story and
     the underwriter's both. It read "Succeeded" here while the Spanish
     already said "Completado", so the two languages disagreed about the same
     state. */
  "payments.succeeded": "Completed",
  "payments.pending": "Pending",
  "payments.failed": "Failed",
  "payments.refunded": "Refunded",
  "payments.reversed": "Reversed",
  "payments.noteDeclined": "The bank declined the card.",
  "payments.noteExpired": "The card had expired.",
  "payments.noteInsufficient": "There were not enough funds in the account.",
  "payments.notePending": "Repay is still processing this payment.",
  "payments.noteRefunded": "This payment was refunded and the balance has been adjusted.",
  "payments.noteReversed": "The bank reversed this payment, so it no longer counts towards the balance.",

  // WBS stories 7 and 8.
  "payments.cardPrivacy": "Cards are private to whoever added them.",
  "payments.noCard": "No repayment card yet",
  "payments.noCardBody": "Add a US debit card and your scheduled payments can be taken from it.",
  "payments.noCardCo": "You have not added a card. The borrower's card is not shown to you, and yours is not shown to them.",
  "payments.addCard": "Add a card",
  /* WBS story 8 is replace mode: saving deletes the card every payment is
     taken from, so it asks first. */
  "payments.saveCardTitle": "Save this card?",
  "payments.saveCardBody": "Every payment on this loan is taken from this card from now on.",
  "payments.saveCardBodyReplace": "The card ending {last4} is removed, and every payment from now on is taken from the new one.",
  "payments.saveCardConfirm": "Save the card",
  "payments.replaceTitle": "This replaces your card",
  "payments.replaceBody": "The card ending {last4} is removed as soon as the new one is accepted, and the new card goes through the same Repay checks as the first. Only US debit cards are supported.",
  "payments.cardSaved": "Card saved",
  "payments.cardReplaced": "Card replaced",

  // WBS stories 5, 6, 12 and 13: the pay dialog.
  "payments.payTitle": "Make a payment",
  "payments.payAmount": "Pay {amount}",
  "payments.noCardToCharge": "There is no card to take this payment from.",
  "payments.choicePayoff": "Pay off remaining balance ({payoff})",
  "payments.choiceOther": "Custom amount",
  "payments.otherLabel": "Amount",
  "payments.otherRequired": "Enter how much you want to pay.",
  "payments.otherTooMuch": "That is more than the loan owes. The most you can pay is {payoff}.",
  "payments.resultSucceeded": "Payment sent",
  "payments.resultPending": "Payment is being processed",
  "payments.resultFailed": "Payment did not go through",
  "payments.resultRefunded": "Payment refunded",
  "payments.resultReversed": "Payment reversed",

  "card.inactive": "Not in use",

  // Reference data (curated server-side; the labels are still ours to word)
  "country.mx": "Mexico",
  "country.gt": "Guatemala",
  "country.hn": "Honduras",
  "country.sv": "El Salvador",
  "country.co": "Colombia",
  "country.ve": "Venezuela",
  "country.ph": "Philippines",
  "country.in": "India",
  "country.ng": "Nigeria",
  "country.ua": "Ukraine",
  "communication.email": "Email",
  "communication.sms": "SMS",
} as const;

export type TranslationKey = keyof typeof en;

const es: Record<TranslationKey, string> = {
  "common.back": "Atrás",
  "common.continue": "Continuar",
  "common.cancel": "Cancelar",
  "common.done": "Listo",
  "common.backToSignIn": "Volver al inicio de sesión",

  "field.country": "País de origen",
  "field.countryPlaceholder": "Selecciona un país",
  "field.firstName": "Nombre",
  "field.middleName": "Segundo nombre",
  "field.lastName": "Apellido",
  "field.dateOfBirth": "Fecha de nacimiento",
  "dob.placeholder": "DD MMM AAAA",
  "dob.clear": "Borrar la fecha",
  "dob.earlierYears": "Años anteriores",
  "dob.laterYears": "Años posteriores",
  "field.ssn": "SSN",
  "field.email": "Correo electrónico",
  "field.emailPlaceholder": "correo@ejemplo.com",
  "field.phone": "Teléfono",
  "field.phoneUs": "Teléfono (EE. UU.)",
  "field.street": "Dirección",
  "field.city": "Ciudad",
  "field.state": "Estado",
  "field.zip": "Código postal",
  "field.password": "Contraseña",
  "field.passwordPlaceholder": "Ingresa tu contraseña",
  "field.communication": "Preferencia de comunicación",
  "hint.password": "Mín. 8 caracteres, 1 número, 1 letra mayúscula",
  "field.role": "Rol",

  "login.title": "Te damos la bienvenida a OPA",
  "login.subtitle": "Ingresa tus datos para acceder a tu cuenta.",
  "login.tabBorrower": "Prestatario y coprestatario",
  "login.tabBorrowerShort": "Prestatario",
  "login.tabStaff": "Personal de OPA",
  "login.rememberMe": "Recordarme",
  "login.forgotPassword": "¿Olvidaste tu contraseña?",
  "login.submit": "Iniciar sesión",
  "login.noAccount": "¿No tienes una cuenta?",
  "login.createAccount": "Crear una cuenta",
  "login.lockedTitle": "Cuenta bloqueada",
  "login.lockedDescription":
    "Demasiados intentos fallidos de inicio de sesión. Restablece tu contraseña para desbloquear la cuenta o comunícate con el soporte de OPA.",

  "staff.signIn": "Iniciar sesión con Microsoft",
  "staff.note":
    "Las cuentas del personal de OPA las administra tu administrador. Te redirigiremos a la página de inicio de sesión de Microsoft de tu organización.",

  "register.title": "Crea tu cuenta",
  "register.haveAccount": "¿Ya tienes una cuenta?",
  "register.stepCount": "Paso {current} de {total}",
  "wizard.stepCount": "Paso {current} de {total}",
  "register.personalTitle": "Información personal",
  "register.accountTitle": "Datos de acceso",
  "register.accountSubtitle":
    "Último paso. El correo electrónico y la contraseña con los que iniciarás sesión.",
  "register.personalSubtitle":
    "Empieza con tu nombre legal y tu fecha de nacimiento, tal como aparecen en tus documentos.",
  "register.contactTitle": "Datos de contacto",
  "register.contactSubtitle":
    "Tu teléfono y tu dirección en EE. UU. OPA presta en determinados estados, así que tu dirección determina lo que podemos ofrecerte.",
  "register.ssnHint":
    "Se usa para confirmar tu identidad. Nunca se lo mostramos a nadie más.",

  "identity.checkingTitle": "Verificando tu identidad",
  "identity.checkingDescription":
    "Esto suele tardar unos segundos. No cierres esta ventana.",
  "identity.verifiedTitle": "Identidad verificada",
  "identity.verifiedDescription": "Confirmamos tus datos.",
  "identity.verifiedNext": "A continuación, verificaremos tu correo electrónico.",
  "identity.mismatchTitle": "No pudimos verificar tu identidad",
  "identity.mismatchDescription":
    "Algunos de los datos que ingresaste no coinciden con nuestros registros. Revisa tu información personal e inténtalo de nuevo, o comunícate con el soporte de OPA.",
  "identity.reviewDetails": "Revisar mis datos",
  "identity.contactSupport": "Contactar con soporte",
  "identity.errorTitle": "Ocurrió un error técnico",
  "identity.errorDescription":
    "No pudimos contactar con el servicio de verificación. Tu cuenta está guardada y no se pierde nada de lo que ingresaste: inténtalo de nuevo ahora o vuelve y continúa desde aquí.",
  "identity.tryAgain": "Intentar de nuevo",
  "identity.contactStaff": "Contactar al personal de OPA",
  "identity.finishLater": "Continuar más tarde",

  "verify.emailTitle": "Verifica tu correo electrónico",
  "verify.phoneTitle": "Verifica tu teléfono",
  "verify.sentTo": "Enviamos un código de un solo uso de {length} dígitos a",
  "verify.submit": "Verificar",
  "verify.changeEmail": "Cambiar el correo",
  "verify.changeNumber": "Cambiar el número",
  "verify.resend": "Reenviar código",
  "verify.resendIn": "Reenviar código ({seconds} s)",
  "verify.emailVerified": "Correo electrónico verificado",
  "verify.phoneVerified": "Número de teléfono verificado",
  "verify.fallbackEmail": "tu correo electrónico",
  "verify.fallbackPhone": "tu teléfono",

  "terms.title": "Términos y privacidad",
  "terms.description": "Revisa y acepta ambos documentos para crear tu cuenta de OPA.",
  "terms.acceptPrefix": "He leído y acepto",
  "terms.termsOfUse": "los Términos de uso",
  "terms.privacyPolicy": "la Política de privacidad",
  "terms.docTerms": "Términos de uso",
  "terms.docPrivacy": "Política de privacidad",
  "terms.submit": "Crear cuenta",
  "terms.summaryNote":
    "En resumen, esto es lo que aceptas. Los documentos enlazados son el acuerdo completo.",
  "terms.termsPoint1":
    "OPA presta dinero para cubrir las tasas de presentación de USCIS. Que te aprobemos, y en qué condiciones, depende de la información que nos des y de las verificaciones que se describen abajo.",
  "terms.termsPoint2":
    "Confirmas que los datos que ingresaste son correctos y te comprometes a avisarnos cuando cambien.",
  "terms.termsPoint3":
    "Aceptas recibir los documentos de tu préstamo de forma electrónica y firmarlos electrónicamente.",
  "terms.termsPoint4":
    "El importe a pagar, el calendario y las comisiones se establecen en el contrato de préstamo que firmas antes de que se desembolse el dinero, no aquí.",
  "terms.privacyPoint1":
    "Recopilamos lo que ingresaste en este formulario, incluidos tu fecha de nacimiento y tu SSN, para confirmar quién eres y decidir sobre tu solicitud.",
  "terms.privacyPoint2":
    "Lo compartimos con los proveedores de verificación de identidad y de control que utilizamos, y con la entidad que administra tus pagos.",
  "terms.privacyPoint3":
    "Lo conservamos durante el tiempo que la ley exige conservar los registros de préstamos, incluso si se rechaza tu solicitud.",
  "terms.privacyPoint4":
    "Puedes pedirnos qué información tenemos sobre ti y solicitar que la corrijamos.",

  "done.title": "Tu cuenta está lista",
  "done.description": "Tu cuenta para {email} está lista.",
  "done.next": "Ya puedes iniciar tu solicitud de préstamo.",
  "done.primary": "Ir a mi cuenta",

  "forgot.title": "Restablece tu contraseña",
  "forgot.subtitle":
    "Te enviaremos por correo electrónico un enlace seguro para crear una contraseña nueva.",
  "forgot.submit": "Enviar el enlace",
  "forgot.sentTitle": "Revisa tu correo electrónico",
  "forgot.sentBefore": "Si existe una cuenta para",
  "forgot.sentAfter": ", enviamos un enlace para restablecer la contraseña.",
  "forgot.sendAgain": "Enviar el enlace de nuevo",
  "forgot.openLinkDemo": "Abrir el enlace del correo (demo)",
  "forgot.sendAgainIn": "Enviar el enlace de nuevo ({seconds} s)",

  "reset.title": "Crea una contraseña nueva",
  "reset.subtitle": "Elige una contraseña que no uses en ningún otro sitio.",
  "reset.newPassword": "Contraseña nueva",
  "reset.newPasswordPlaceholder": "Ingresa la contraseña nueva",
  "reset.confirmPassword": "Confirmar contraseña",
  "reset.confirmPasswordPlaceholder": "Confirma la contraseña nueva",
  "reset.submit": "Actualizar contraseña",
  "reset.doneTitle": "Contraseña actualizada",
  "reset.doneDescription":
    "Tu contraseña se cambió. Inicia sesión con tu contraseña nueva.",
  "reset.goToSignIn": "Ir al inicio de sesión",

  "profile.pageTitle": "Ajustes del perfil",
  "profile.pageSubtitle":
    "Tus datos, cómo te contacta OPA y tu contraseña.",
  "profile.navPersonal": "Información personal",
  "profile.navContact": "Datos de contacto",
  "profile.navCard": "Tarjeta de pago",
  "profile.cardSubtitle":
    "Agrega o actualiza la tarjeta de débito de la que OPA cobra tus pagos. OPA nunca ve el número — lo guarda Repay.",
  "profile.navPassword": "Contraseña",
  "profile.passwordSubtitle":
    "Elige una contraseña que no uses en ningún otro sitio. Seguirás con la sesión iniciada en este dispositivo.",
  "profile.identityTitle": "Información personal (bloqueada)",
  "profile.contactTitle": "Datos de contacto",
  "profile.readOnlyTitle": "Por ahora tus datos de contacto son de solo lectura",
  "profile.readOnlyDescription":
    "Podrás actualizar tu correo electrónico, teléfono y dirección postal cuando se apruebe tu solicitud.",
  "profile.verified": "Verificado",
  "profile.unverified": "Sin verificar",
  "profile.save": "Guardar cambios",
  "profile.passwordTitle": "Contraseña",
  "profile.change": "Cambiar",
  "profile.updated": "Perfil actualizado",
  "profile.passwordUpdated": "Contraseña actualizada",
  "profile.lockReason":
    "Comunícate con el soporte de OPA para cambiarlo. Se usa para la verificación de identidad.",
  "profile.preferenceHint": "Cómo te enviamos las novedades de la solicitud, los recordatorios de pago y los recibos.",
  "profile.preferenceSaved": "Preferencia guardada",

  "changePassword.title": "Cambia tu contraseña",
  "changePassword.subtitle":
    "Seguirás con la sesión iniciada en este dispositivo. En los demás se cerrará.",
  "changePassword.current": "Contraseña actual",

  "staffProfile.title": "Datos de la cuenta",
  "staffProfile.description":
    "El nombre y el correo los gestiona Microsoft; contacta con un admin de OPA para cambiarlos.",
  "staffProfile.lockReason": "Gestionado por tu cuenta de trabajo de Microsoft.",

  "session.title": "¿Sigues ahí?",
  "session.description":
    "Por tu seguridad cerramos la sesión tras un periodo de inactividad. Se cerrará en {seconds} segundos.",
  "session.descriptionOne":
    "Por tu seguridad cerramos la sesión tras un periodo de inactividad. Se cerrará en 1 segundo.",
  "session.signOutNow": "Cerrar sesión ahora",
  "session.staySignedIn": "Seguir conectado",

  "header.home": "Inicio de OPA",
  "header.notifications": "Notificaciones",
  "profile.navNotifications": "Notificaciones",
  "dashboard.title": "Panel",
  "dashboard.titleApplication": "Solicitud {ref}",
  "dashboard.titleLoan": "Préstamo {ref}",
  "dashboard.titleNone": "Aquí empieza tu préstamo",
  "dashboard.leadNone": "Todavía no hay nada abierto. Inicia una solicitud y aparecerá todo aquí.",
  "dashboard.leadApplication": "Tu solicitud está en OPA. Aquí ves en qué punto está.",
  "dashboard.leadApplicationCoBorrower":
    "La solicitud de {name} está en OPA. Aquí ves en qué punto está.",
  "dashboard.urgent": "Se acaba el plazo",
  "dashboard.leadLoan": "Aquí está tu préstamo, lo que cuesta y lo que viene.",
  "dashboard.emptyBody":
    "Cuando solicites, esta página te mostrará qué está haciendo OPA, qué debes y qué pasa después.",

  "dashboard.tileLoan": "Importe del préstamo",
  "dashboard.tileLoanHint": "{apr} TAE",
  "dashboard.tileCard": "Tarjeta virtual",
  "dashboard.tileCardUsed": "En uso",
  "dashboard.tileCardUnused": "Sin usar",
  "dashboard.tileRepaymentCard": "Tu tarjeta",
  "dashboard.tileNoCard": "Sin añadir",
  "dashboard.tilePayments": "Pagos",
  "dashboard.tilePaymentsValue": "{paid} de {total} pagados",
  "dashboard.tileDocuments": "Documentos",
  "dashboard.tileDocumentsValue": "{count} archivos",
  "dashboard.tileNothing": "Sin datos aún",

  "dashboard.ringTitle": "Amortización",
  "dashboard.ringCentre": "pagado",
  "dashboard.ringPaid": "Pagadas",
  "dashboard.ringOverdue": "Vencidas",
  "dashboard.ringLeft": "Por pagar",
  "dashboard.ringCount": "{count} de {total}",
  "dashboard.ringNone": "El anillo se llena cuando OPA financia el préstamo y empieza el calendario.",
  "dashboard.recentTitle": "Pagos recientes",
  "dashboard.recentAll": "Todos los pagos",
  "dashboard.recentNone": "Tus pagos aparecerán aquí en cuanto se cobre el primero.",

  "dashboard.stageStep": "Paso {index} de {total}",
  "dashboard.stageYou": "Te toca",
  "dashboard.stageOpa": "Con OPA",
  "dashboard.stageReview": "En revisión",
  "dashboard.stageNeedsInfo": "Falta información",
  "dashboard.stageCoBorrower": "Esperando a tu codeudor",
  "dashboard.stageReviewBody":
    "OPA está revisando tu solicitud. No tienes que hacer nada mientras está en análisis.",
  "dashboard.stageReviewInfo":
    "Un analista ha pedido algo más. Nada avanza hasta que llegue.",
  "dashboard.stageReviewCoBorrower":
    "El análisis no puede empezar hasta que tu codeudor acepte la invitación y complete su parte.",
  "dashboard.stageDeclined": "No aprobada",
  "dashboard.stageDeclinedBody": "OPA no ha podido aprobar esta solicitud.",
  "dashboard.stageOpenApplication": "Abrir la solicitud",
  "dashboard.stageSign": "Firma los documentos del préstamo",
  "dashboard.stageOpenDocuments": "Abrir los documentos",
  "dashboard.stageFunding": "OPA está desembolsando",
  "dashboard.stageCancelledBody":
    "Este préstamo se canceló antes de usar la tarjeta. No debes nada.",
  "dashboard.stageRepaying": "Amortizando",
  "dashboard.stageRepayingBody": "Se cobran {amount} el {due}, y el día 1 de cada mes después.",
  "dashboard.stageSettled": "Pagado por completo",
  "dashboard.stageSettledBody": "Todas las cuotas del calendario están pagadas. El préstamo está cerrado.",
  "dashboard.stageOpenPayments": "Abrir pagos",
  "dashboard.stageSeeStatus": "Ver el estado",
  "dashboard.stageFundedBody":
    "OPA ha pagado la tasa de presentación y tu tarjeta ya está emitida. La amortización empieza el día 1, dentro de los 45 días siguientes a la aprobación.",

  "dashboard.trackSubmitted": "Enviada",
  "dashboard.trackReviewed": "Revisión",
  "dashboard.trackSigned": "Firma",
  "dashboard.trackFunded": "Desembolso",
  "dashboard.trackRepaid": "Amortización",
  "dashboard.stepsBehind": "Pasos completados",
  "dashboard.applicationDone": "Amortización iniciada",
  "dashboard.loanPaidOff": "Solicitud completada",
  "dashboard.trackGoal": "Comienza la amortización",
  "dashboard.pastSubmitted": "Tu solicitud llegó a OPA y entró en la cola.",
  "dashboard.pastReviewed": "El análisis terminó y OPA tomó una decisión.",
  "dashboard.pastSigned": "El contrato del préstamo volvió firmado por DocuSign.",
  "dashboard.pastFunded": "OPA pagó la tasa de USCIS y emitió tu tarjeta.",
  "dashboard.pastRepaid": "Se realizaron todos los pagos programados y el préstamo quedó saldado.",

  "dashboard.appliedFor": "Solicitado",
  "dashboard.submittedOn": "Enviada el {date}",
  "dashboard.viewApplication": "Ver la solicitud",
  "dashboard.reference": "Referencia",
  "dashboard.uscis": "Trámite de USCIS",
  "dashboard.loanBand": "Tu préstamo",
  "dashboard.journeyTitle": "Progreso de la solicitud",

  "dashboard.nextTitle": "Qué pasa después",
  "dashboard.nextNone": "No hay nada programado.",
  "dashboard.nextNoneYet": "Cuando solicites, tus fechas aparecerán aquí.",
  "dashboard.journeyNone": "El avance de tu solicitud aparecerá aquí.",
  "dashboard.whenUnset": "—",
  "dashboard.ownerYou": "Tú",
  "dashboard.ownerOpa": "OPA",

  "dashboard.stepDecision": "OPA toma una decisión",
  "dashboard.stepDecisionBody":
    "Suscripción revisa lo que enviaste. Te avisaremos por correo y SMS en cuanto haya respuesta.",
  "dashboard.stepInvitation": "Tu coprestatario completa su parte",
  "dashboard.stepInvitationBody":
    "La suscripción no puede empezar hasta que lo haga. Si la invitación caduca, puedes invitar a otra persona.",
  "dashboard.stepYourPart": "Completa tu parte de la solicitud",
  "dashboard.stepYourPartBody":
    "La invitación deja de funcionar después de esta fecha y la solicitud espera hasta entonces.",
  "dashboard.stepMoreInfo": "Envía lo que te piden",
  "dashboard.stepMoreInfoBody":
    "Tu solicitud vuelve a la cola de revisión en cuanto llegue.",
  "dashboard.stepSign": "Firma los documentos del préstamo",
  "dashboard.stepSignBody":
    "La firma se realiza en DocuSign. No se desembolsa nada hasta que esté hecha, y la amortización comienza en un plazo de 45 días desde la aprobación, el día 1 de cada mes.",
  "dashboard.stepSignBodyBoth":
    "La firma se realiza en DocuSign, y los dos firmáis antes de que OPA desembolse nada. La amortización comienza en un plazo de 45 días desde la aprobación, el día 1 de cada mes.",
  "dashboard.stepFunding": "OPA desembolsa el préstamo",
  "dashboard.stepFundingBody":
    "Tu tarjeta virtual de pago se emite a la vez. Los pagos empiezan dentro de los 45 días desde la aprobación, el día 1 del mes.",
  "dashboard.stepPayment": "Pagar {amount}",
  "dashboard.stepPaymentBody": "Se cobrará de la tarjeta terminada en {card}.",
  "dashboard.stepLateFee": "Se cobra un recargo por demora",
  "dashboard.stepLateFeeBody":
    "El día 16 tras el vencimiento: $5.00 o el 5% de la cuota impagada, lo que sea menor. Un recargo por cada pago perdido.",
  "dashboard.stepAcceleration": "El préstamo se acelera",
  "dashboard.stepAccelerationBody":
    "Si el saldo vencido de {amount} no se paga en 30 días, vence todo el saldo restante.",
  "dashboard.stepAccelerated": "Paga el saldo completo",
  "dashboard.stepAcceleratedBody":
    "{amount}, intereses y recargos incluidos, en un plazo de 30 días desde el aviso de mora.",
  "dashboard.stepFinal": "Último pago",
  "dashboard.stepFinalBody": "La última cuota del calendario. El préstamo se cierra con ella.",

  "notify.inbox": "Bandeja",
  "notify.markAllRead": "Marcar todo como leído",
  "notify.none": "Nada que leer. Te avisaremos cuando ocurra algo.",
  "notify.email": "Notificaciones por correo",
  "notify.sms": "Notificaciones por SMS",
  "notify.channelHint":
    "Por dónde te envía OPA lo que tiene que contarte. Al menos una debe quedar activada.",
  "notify.channelSaved": "Preferencias de notificación guardadas",

  "notify.approvedTitle": "Tu solicitud fue aprobada",
  "notify.approvedBody": "OPA puede cubrir tu tasa de tramitación. Siguen los documentos del préstamo.",
  "notify.declinedTitle": "Tu solicitud fue rechazada",
  "notify.declinedBody": "Llama a OPA y alguien la revisará contigo.",
  "notify.moreInformationTitle": "OPA necesita una cosa más",
  "notify.moreInformationBody": "Envía lo que te piden y tu solicitud continúa.",
  "notify.signingTitle": "Tus documentos están listos para firmar",
  "notify.signingBody": "La firma se realiza en DocuSign. No se desembolsa nada hasta que se firmen.",
  "notify.signedTitle": "Tus documentos están firmados",
  "notify.signedBody": "OPA está desembolsando tu préstamo. Te avisaremos cuando se mueva el dinero.",
  "notify.coBorrowerNeededTitle": "Tu solicitud necesita un coprestatario",
  "notify.coBorrowerNeededBody":
    "{coBorrower} fue invitado y todavía no ha terminado. La invitación caduca el {expiresOn}.",
  "notify.coBorrowerExpiredTitle": "La invitación al coprestatario caducó",
  "notify.coBorrowerExpiredBody":
    "{coBorrower} no la usó a tiempo. Puedes invitar a otra persona y continuar.",
  "notify.coBorrowerDeclinedTitle": "Tu coprestatario no cumple los requisitos",
  "notify.coBorrowerDeclinedBody":
    "Puedes invitar a otra persona y tu solicitud continúa desde ahí.",
  "notify.fundedTitle": "Tu préstamo está desembolsado",
  "notify.fundedBody": "El dinero se movió y tu tarjeta virtual de pago está lista.",
  "notify.fundedBodyCoBorrower": "El dinero se movió. Los pagos empiezan el día 1 del mes.",
  "notify.reminderTitle": "Se acerca un pago",
  "notify.reminderBody": "{nextAmount} vence el {nextDue}.",
  "notify.paidTitle": "Pago recibido",
  "notify.paidBody": "Se cobraron {paidAmount} de tu tarjeta. Gracias.",
  "notify.paidOffTitle": "Tu préstamo está pagado",
  "notify.paidOffBody": "No queda nada por pagar. Gracias.",
  "notify.failedTitle": "Un pago no se completó",
  "notify.failedBody": "No se cobró nada. Puedes intentarlo de nuevo desde la página de pagos.",
  "notify.overdueTitle": "Hay un pago vencido",
  "notify.overdueBody": "{pastDue} está vencido y se ha añadido un recargo por demora.",
  "notify.defaultTitle": "Tu cuenta está en mora",
  "notify.defaultBody":
    "{pastDue} debe pagarse en un plazo de 30 días para evitar la aceleración del préstamo.",
  "notify.acceleratedTitle": "Tu préstamo ha sido acelerado",
  "notify.acceleratedBody":
    "El saldo completo de {outstanding} vence en 30 días desde el aviso de mora.",
  "notify.unableTitle": "No podemos continuar con tu solicitud",
  "notify.unableBody": "Llama al servicio de atención al cliente de OPA y alguien te ayudará.",

  "header.myProfile": "Mi perfil",
  "header.logOut": "Cerrar sesión",
  "header.language": "Idioma de la interfaz",

  "nav.openMenu": "Abrir menú",
  "nav.groupOperations": "Operaciones",
  "nav.groupAdmin": "Administración",
  "nav.dashboard": "Panel",
  "nav.application": "Solicitud",
  "nav.loan": "Préstamo",
  "nav.payments": "Pagos",
  "nav.contact": "Contacto",
  "nav.borrowers": "Prestatarios",
  "nav.applications": "Solicitudes",
  "nav.reviewQueue": "Cola de revisión",
  "nav.loans": "Préstamos",
  "nav.payment": "Pagos",
  "nav.acquisition": "Captación",
  "nav.source": "Origen",
  "nav.partners": "Socios y grupos",
  "nav.campaigns": "Campañas",
  "nav.performance": "Informe de rendimiento",
  "nav.users": "Usuarios",
  "nav.reporting": "Informes",

  "validation.required": "Campo obligatorio",
  "validation.amount": "Ingresa un importe mayor que cero",
  "validation.cardNumber": "Ingresa un número de tarjeta válido",
  "validation.cardExpiry": "Ingresa una fecha de vencimiento válida en formato MM/AA",
  "validation.cardExpired": "Esta tarjeta ha vencido",
  "validation.cardLuhn": "Revisa el número de la tarjeta: algún dígito es incorrecto",
  "validation.cardCvv": "El CVV debe tener {count} dígitos",
  "validation.email": "Ingresa un correo electrónico válido",
  "validation.phone": "Formato de teléfono no válido",
  "validation.ssn": "SSN no válido: debe tener 9 dígitos",
  "validation.zip": "El código postal debe tener 5 dígitos",
  "validation.dobFuture": "La fecha de nacimiento no puede estar en el futuro",
  "validation.minAge": "Debes tener {age} años o más",
  "validation.currentPassword": "Ingresa tu contraseña actual",
  "validation.confirmPassword": "Confirma tu contraseña nueva",
  "validation.passwordsMismatch": "Las contraseñas no coinciden",

  "users.title": "Usuarios",
  "access.deniedTitle": "No tienes acceso a esta página",
  "access.deniedDescription":
    "Tu rol no tiene acceso a esta página. Vuelve a la lista de prestatarios.",
  "access.goToBorrowers": "Ir a prestatarios",
  "users.searchPlaceholder": "Busca por nombre o correo",
  "users.new": "Nuevo usuario",
  "users.col.name": "Nombre",
  "users.col.email": "Correo electrónico",
  "users.col.role": "Rol",
  "users.col.status": "Estado",
  "users.col.password": "Contraseña",
  "users.status.active": "Activo",
  "users.status.inactive": "Inactivo",
  "users.password.set": "Definida",
  "users.password.pending": "Pendiente",
  "users.rowActions": "Acciones para {name}",
  "users.action.sendLink": "Enviar enlace para crear la contraseña",
  "users.action.resendLink": "Reenviar el enlace para crear la contraseña",
  "users.action.edit": "Editar",
  "users.action.deactivate": "Desactivar",
  "users.action.activate": "Activar",
  "users.action.delete": "Eliminar",
  "users.empty": "Ningún usuario coincide con tu búsqueda",
  "users.emptyHint": "Prueba con otro nombre o correo electrónico.",
  "users.newTitle": "Nuevo usuario",
  "users.newSubtitle":
    "Le enviaremos por correo un enlace para que cree su propia contraseña. Tú nunca la eliges.",
  "users.editTitle": "Editar usuario",
  "users.save": "Guardar",
  "users.created": "Usuario creado: se envió el correo para crear la contraseña",
  "users.updated": "Usuario actualizado",
  "users.linkSent": "Enlace para crear la contraseña enviado",
  "users.deleted": "Usuario eliminado",
  "users.deactivated": "{name} ya no puede iniciar sesión",
  "users.activated": "{name} puede iniciar sesión de nuevo",
  "users.deleteTitle": "¿Eliminar al usuario?",
  "users.deleteBody": "¿Eliminar a {name}? Esta acción no se puede deshacer.",
  "users.deactivateTitle": "¿Retirar el acceso de esta cuenta?",
  "users.deactivateBody":
    "Se cerrará la sesión de {name} y no podrá iniciar sesión hasta que reactives la cuenta.",
  "users.activateTitle": "¿Restablecer el acceso de esta cuenta?",
  "users.activateBody": "{name} podrá iniciar sesión de nuevo.",
  "role.admin": "Admin",
  "role.underwriter": "Analista de riesgo",
  "role.staff": "Personal de OPA",
  "role.staffHint": "solo lectura",

  "filters.title": "Filtros",
  "filters.clearAll": "Quitar todos",
  "filters.remove": "Quitar el filtro: {name}",
  "borrowers.filterState": "Estado",
  "borrowers.filterStatus": "Estado de la solicitud",
  "borrowers.filterFlag": "Lista NO PRESTAR",

  "borrowers.title": "Prestatarios",
  "borrowers.searchPlaceholder": "Busca por nombre, correo o teléfono",
  "borrowers.allStates": "Todos los estados",
  "borrowers.allStatuses": "Todos los estados de solicitud",
  "borrowers.allFlags": "Todos los prestatarios",
  "borrowers.flagOnly": "En la lista NO PRESTAR",
  "borrowers.flagNone": "Fuera de la lista NO PRESTAR",
  "borrowers.col.phone": "Teléfono",
  "borrowers.col.state": "Estado",
  "borrowers.col.application": "Solicitud",
  "borrowers.col.address": "Dirección",
  "borrowers.col.flag": "Marca",
  "borrowers.empty": "Ningún prestatario coincide con estos filtros",
  "borrowers.emptyHint": "Prueba con otra búsqueda o quita los filtros.",
  "borrowers.coBorrowerOf": "Coprestatario de {name}",

  "application.none": "Sin solicitud",
  "application.submitted": "Enviada",
  "application.review": "En revisión",
  "application.coBorrower": "Requiere coprestatario",
  "application.approved": "Aprobada",
  "application.declined": "Rechazada",

  "doNotLoan.tag": "NO PRESTAR",
  "doNotLoan.add": "Añadir a NO PRESTAR",
  "doNotLoan.remove": "Quitar de NO PRESTAR",
  "doNotLoan.addTitle": "¿Añadir a la lista NO PRESTAR?",
  "doNotLoan.addBody":
    "{name} no podrá iniciar una nueva solicitud de préstamo. Puedes deshacerlo cuando quieras.",
  "doNotLoan.removeTitle": "¿Quitar de la lista NO PRESTAR?",
  "doNotLoan.removeBody": "{name} podrá volver a solicitar.",
  "doNotLoan.added": "Añadido a la lista NO PRESTAR",
  "doNotLoan.removed": "Quitado de la lista NO PRESTAR",

  "borrower.back": "Volver a prestatarios",
  "borrower.manage": "Gestionar la cuenta",
  "borrower.sendLink": "Enviar enlace para crear la contraseña",
  "borrower.moreActions": "Más acciones para esta cuenta",
  "borrower.tab.profile": "Perfil",
  "borrower.tab.application": "Solicitud",
  "borrower.tab.coBorrower": "Coprestatario",
  "borrower.tab.loan": "Préstamo",
  "detail.emailVerified": "Correo verificado",
  "detail.phoneVerified": "Teléfono verificado",
  "detail.identityVerified": "Identidad verificada",
  "detail.address": "Dirección",
  "detail.yes": "Sí",
  "detail.no": "No",
  "detail.status": "Estado",
  "detail.uscisType": "Tipo de trámite de USCIS",
  "detail.loanAmount": "Importe del préstamo",
  "detail.annualIncome": "Ingresos anuales",
  "detail.incomeDoc": "Comprobante de ingresos",
  "detail.coBorrowerRequired": "Requiere coprestatario",
  "detail.docsSigned": "Documentos de suscripción firmados",
  "detail.householdSize": "Tamaño del hogar",
  "detail.submitted": "Enviada",
  "detail.referral": "Origen de la referencia",
  "detail.uploaded": "Subido",
  "detail.notUploaded": "Sin subir",
  "detail.amount": "Importe",
  "detail.rate": "Tasa",
  "detail.agreementSigned": "Contrato firmado",
  "detail.virtualCard": "Tarjeta virtual",
  "detail.debitCard": "Tarjeta de débito",
  "detail.relationship": "Relación",
  "loan.funded": "Desembolsado",
  "loan.repaying": "En pago",
  "loan.closed": "Cerrado",
  "application.emptyTitle": "Todavía no hay solicitud",
  "application.emptyDescription":
    "Este prestatario no ha iniciado una solicitud de préstamo.",
  "coBorrower.openRecord": "Abrir su ficha de prestatario",
  "coBorrower.sponsoring": "Avala a",
  "coBorrower.sponsoringCap": "Un coprestatario puede avalar hasta 3 prestatarios.",
  "coBorrower.emptyTitle": "Sin coprestatario",
  "coBorrower.emptyDescription": "Esta solicitud no tiene coprestatario.",
  "loan.emptyTitle": "Todavía no hay préstamo",
  "loan.emptyDescription":
    "El préstamo aparece aquí cuando la solicitud se aprueba y se desembolsa.",

  "manageBorrower.title": "Gestionar la cuenta del prestatario",
  "manageBorrower.saved": "Datos del prestatario actualizados",

  "setPassword.title": "Crea tu contraseña",
  "setPassword.subtitle": "Elige una contraseña que no uses en ningún otro sitio.",
  "setPassword.forAccount": "Iniciarás sesión como {email}.",
  "setPassword.submit": "Guardar",
  "setPassword.doneTitle": "Contraseña creada",
  "setPassword.doneDescription":
    "Tu cuenta de OPA está lista. Inicia sesión con tu correo y tu contraseña nueva.",

  "application.title": "Solicitud",
  "application.startTitle": "Inicia tu solicitud de préstamo",
  "application.startSubtitle":
    "Te guiaremos paso a paso y te mostraremos lo que OPA puede cubrir.",
  "application.start": "Iniciar la solicitud",
  "application.invitedTitle": "{name} te pidió unirte a su solicitud",
  "application.invitedBody":
    "Eres el coprestatario. Tu parte lleva unos minutos y la invitación caduca el {date}.",
  "application.invitedAction": "Empezar mi parte",
  "application.assignedDoneTitle": "Tu parte está lista",
  "application.assignedDoneBody":
    "OPA está revisando la solicitud. Puedes seguir su avance en la página de tu préstamo.",
  "application.assignedDoneAction": "Ver la solicitud",
  "application.blockedActiveTitle": "Tu solicitud está en OPA",
  "application.blockedActiveBody":
    "OPA está revisando tu solicitud. Puedes seguir su avance en la página de tu préstamo.",
  "application.resume": "Revisar mi solicitud",
  "application.blockedFlagTitle": "No puedes iniciar una solicitud nueva",
  "application.blockedFlagBody":
    "Esta cuenta no puede solicitar en este momento. Comunícate con el soporte de OPA si crees que es un error.",

  "appStep.account": "Cuenta",
  "appStep.income": "Ingresos",
  "appStep.loan": "Préstamo",
  "appStep.coBorrower": "Coprestatario",
  "appStep.sign": "Firma",
  "appStep.card": "Tarjeta",
  "appStep.household": "Hogar",
  "appStep.review": "Revisión",

  "income.title": "Verificación de ingresos",
  "income.subtitle":
    "Lo que ganas al año y algo que lo demuestre. Es lo primero que revisa la suscripción.",
  "income.annual": "Ingresos anuales",
  "income.annualPlaceholder": "p. ej. 40,000",
  "income.docType": "Tipo de documento",
  "income.docTypePlaceholder": "Selecciona un tipo de documento",
  "income.uploadRequired": "Sube comprobantes de ingresos",
  "income.choose": "Elegir un archivo",
  "income.uploadHelp":
    "PDF, JPG o PNG. Los revisa el equipo de underwriting, así que deben ser legibles.",
  "income.remove": "Quitar {name}",

  "loanDetails.title": "Datos del préstamo",
  "loanDetails.subtitle":
    "OPA presta exactamente la tasa de presentación de USCIS: ni más, ni menos.",
  "loanDetails.uscis": "Tu trámite de USCIS",
  "loanDetails.uscisPlaceholder": "Selecciona tu trámite",
  "loanDetails.type": "Tipo de solicitud",
  "loanDetails.typePlaceholder": "Selecciona el tipo que presentas",
  "loanDetails.amountLabel": "Importe calculado del préstamo",
  "loanDetails.terms": "1 % TAE · plazo de 12 meses",
  "loanDetails.pending": "Elige un tipo de solicitud para ver el importe.",

  "application.coBorrowerWaitingTitle": "Esperando a tu coprestatario",
  "application.coBorrowerWaitingBody":
    "{name} ha sido invitado y su parte todavía no está lista. La invitación caduca el {date}; puedes invitar a otra persona.",
  "inviteCoBorrower.title": "Invitar a un coprestatario",
  "inviteCoBorrower.subtitle":
    "Tu solicitud espera aquí hasta que acepten y completen su parte. Les enviamos la invitación por correo y tienen cinco días para usarla.",
  "inviteCoBorrower.done": "Volver a mi solicitud",
  "coBorrowerStep.title": "Coprestatario",
  "coBorrowerStep.subtitle":
    "Alguien que solicita junto a ti y comparte la responsabilidad del préstamo.",
  "coBorrowerStep.requiredNote":
    "Tu solicitud necesita un coprestatario porque no se verificaron tus ingresos.",
  "coBorrowerStep.optIn": "Quiero añadir un coprestatario",
  "coBorrowerStep.send": "Enviar la invitación",
  "coBorrowerStep.resend": "Enviar una invitación nueva",
  "coBorrowerStep.replace": "Cambiar de coprestatario",
  "coBorrowerStep.sent": "Invitación enviada",
  "coBorrowerStep.expiresOn": "Vence el {date}",
  "coBorrowerStep.acceptedOn": "Aceptada el {date}",
  "coBorrowerStep.expiredOn": "Venció el {date}",
  "coBorrowerStep.sponsorLimit":
    "Una persona puede firmar como coprestatario para un máximo de tres prestatarios.",
  "coBorrowerStep.limitReached":
    "{name} ya es coprestatario en tres solicitudes, que es el límite. Invita a otra persona.",
  "coBorrowerStep.replaceTitle": "¿Cambiar de coprestatario?",
  "coBorrowerStep.replaceBody":
    "La invitación de {name} dejará de funcionar y perderá el acceso a esta solicitud. Después podrás invitar a otra persona.",
  "coBorrowerStep.replaced": "Invitación cancelada: ya puedes invitar a otra persona",
  "invitation.pending": "Pendiente",
  "invitation.accepted": "Aceptada",
  "invitation.expired": "Vencida",

  "sign.title": "Firma los documentos de suscripción",
  "sign.subtitle":
    "Preparados para {state} y para tu rol. Ahora solo se firma lo que necesita la suscripción; los documentos del préstamo llegan tras la aprobación.",
  "sign.package": "Tu paquete de documentos",
  "sign.open": "Revisar y firmar",
  "sign.external": "DocuSign",
  "sign.externalNote":
    "La firma se hace en DocuSign. Solo añades tu firma: los documentos no se pueden editar y la fecha de hoy se aplica automáticamente.",
  "sign.signedTitle": "Firmado con DocuSign",
  "sign.signedOn": "Firmado el {date}",

  "card.title": "Tarjeta de débito",
  "card.subtitle":
    "OPA desembolsa el préstamo en esta tarjeta y cobra de ella las cuotas. Solo tarjetas de débito de EE. UU.; no se aceptan tarjetas de crédito.",
  "card.external": "Repay",
  "card.externalNote":
    "Este formulario es de Repay, el procesador de pagos de OPA. Los datos de tu tarjeta van directamente a ellos; OPA solo guarda un token que la representa.",
  "card.open": "Introducir los datos de la tarjeta",
  "card.savedCard": "{brand} \u2022\u2022\u2022\u2022 {last4}",
  "card.replace": "Cambiar la tarjeta",
  "card.update": "Cambiar",
  "card.brandLine": "{brand} débito",
  "card.owner": "Tu tarjeta",
  "card.expiresLabel": "Caduca",
  "card.number": "Número de tarjeta",
  "card.expiry": "Caducidad",
  "card.cvv": "CVV",
  "card.save": "Guardar tarjeta",
  "card.mockNote": "Solo datos de prueba: no se envía ni se guarda nada.",
  "card.fillTest": "Rellenar una tarjeta de prueba",
  "card.active": "Activa",
  "card.debitLine": "{brand} Debit · cad. {exp}",
  "card.declined":
    "Repay no pudo aceptar esta tarjeta. Usa una tarjeta de débito de EE. UU.: no se admiten tarjetas de crédito.",

  "submitStep.title": "Unos últimos datos",
  "submitStep.subtitle":
    "Nos ayudan a entender tu situación y a llegar a más personas como tú.",
  "summary.title": "Lo que vas a enviar",
  "summary.loanAmount": "Importe del préstamo",
  "summary.income": "Ingresos anuales",
  "summary.documents": "Documentos firmados",
  "summary.card": "Tarjeta de débito",
  "summary.notProvided": "Sin indicar",

  "review.title": "Resumen",
  "review.subtitle":
    "Todo lo que ingresaste, en un solo lugar. Una vez que envíes, no se podrá cambiar nada.",
  "review.edit": "Editar",
  "review.view": "Revisar",
  "review.confirmSaveTitle": "¿Reemplazar lo que ingresaste?",
  "review.confirmSaveBody":
    "Esto guarda tus cambios sobre las respuestas que están ahora en la solicitud. No se envía nada hasta que pulses Enviar solicitud.",
  "review.saveChanges": "Guardar cambios",
  "review.submit": "Enviar solicitud",
  "review.sectionLoan": "El préstamo",
  "review.sectionIncome": "Ingresos",
  "review.sectionCoBorrower": "Coprestatario",
  "review.sectionDocuments": "Documentos",
  "review.sectionCard": "Tarjeta de débito",
  "review.sectionHousehold": "Hogar",
  "review.uscis": "Solicitud USCIS",
  "review.none": "Ninguno",
  "review.notSigned": "Sin firmar",
  "review.name": "Nombre",
  "review.status": "Invitación",
  "review.proof": "Justificante de ingresos",
  "review.file": "{count} archivo",
  "review.files": "{count} archivos",
  "review.noCoBorrower": "Nadie invitado",
  "review.signedVia": "Firmado el {date} con DocuSign",
  "review.cardLine": "{brand} \u2022\u2022\u2022\u2022 {last4} · cad. {exp}",
  "submitStep.householdIncome": "Ingresos totales del hogar",
  "submitStep.householdSize": "Personas en tu hogar",
  "submitStep.veteran": "¿Eres veterano/a?",
  "submitStep.heardAbout": "¿Cómo conociste OPA?",
  "submitStep.heardAboutPlaceholder": "Selecciona una opción",
  "common.yes": "Sí",
  "common.no": "No",

  "submitted.tag": "En revisión",
  "submitted.tagWaiting": "Esperando a tu coprestatario",
  "submitted.title": "Tu solicitud está enviada",
  "submitted.partTitle": "Tu parte está enviada",
  "submitted.partDescription":
    "OPA está revisando la solicitud. Puedes seguir su avance en la página de tu préstamo.",
  "submitted.description":
    "OPA la está revisando. Puedes seguir su avance en la página de tu préstamo.",
  "submitted.coBorrowerFailedTitle": "Tu coprestatario no cumple los requisitos",
  "submitted.coBorrowerFailedBody":
    "OPA revisó a {name} y no cumple los requisitos. Tu solicitud te espera: invita a otro coprestatario y continúa desde ahí.",
  "submitted.inviteAnother": "Invitar a otro coprestatario",
  "submitted.waitingCoBorrower":
    "Tu coprestatario todavía tiene que completar su parte. La suscripción empieza cuando lo haga.",
  "submitted.dashboard": "Ver mi solicitud",
  "submitted.contactTitle": "Si nos necesitas",

  "contact.title": "Contacta con nosotros",
  "contact.subtitle": "Nos escribas como nos escribas, te responde una persona.",
  "contact.phone": "Teléfono",
  "contact.phoneValue": "(800) 555-0142",
  "contact.email": "Correo electrónico",
  "contact.emailValue": "support@opa.example",
  "contact.hours": "Horario de atención",
  "contact.hoursValue": "De lunes a viernes, 9:00–18:00 (ET)",
  "contact.address": "Dirección postal",
  "contact.addressValue": "1200 Wilshire Blvd, Suite 400, Los Angeles, CA 90017",
  "contact.openNow": "Abierto ahora",
  "contact.closedNow": "Cerrado",
  "contact.emailNote": "Mejor para lo que no es urgente.",
  "contact.callTitle": "Llámanos",
  "contact.callDesc": "Habla con una persona de OPA.",
  "contact.emailTitle": "Escríbenos",
  "contact.emailDesc": "Envía un mensaje al equipo de OPA.",
  "contact.hoursTitle": "Horario de atención",
  "contact.hoursDesc": "Cuándo hay alguien en la línea.",
  "contact.addressTitle": "Dirección postal",
  "contact.addressDesc": "Dónde enviar documentos por correo.",
  "contact.mapLink": "Ver en Google Maps",

  "invite.title": "Te han invitado como coprestatario",
  "invite.body": "{name} te pide que solicites junto a él o ella un préstamo de OPA.",
  "invite.accept": "Crear mi cuenta",
  "invite.expires": "Vence el {date}",
  "invite.expiredTitle": "Esta invitación ha vencido",
  "invite.expiredBody":
    "Las invitaciones son válidas cinco días. Pídele a {name} que te envíe una nueva.",

  "coApp.contextTitle": "Solicitud de préstamo de {name}",
  "coApp.contextBody":
    "Te has unido como coprestatario. Estos pasos son tu parte de la solicitud.",
  "coApp.accountTitle": "Tus datos de contacto",
  "coApp.accountSubtitle":
    "Los datos que nos dio {name}. Revísalos y completa lo que falte: se te pedirá la misma información que dio el prestatario.",


  // ── Epic 5 — Manage loan ───────────────────────────────────────────────
  "loanPage.title": "Gestionar el préstamo",
  "loanPage.none": "Aún no hay solicitud ni préstamo",
  "loanPage.noneBody":
    "Inicia una solicitud y aparecerá aquí, con su estado, sus condiciones y todos sus documentos.",
  "loanPage.startApplication": "Iniciar una solicitud",

  "loanPage.application": "Solicitud",
  "loanPage.reference": "Referencia",
  "loanPage.uscis": "Servicio USCIS",
  "loanPage.amount": "Importe",
  "loanPage.submitted": "Enviada",
  "loanPage.status": "Estado",

  "sign.loanTitle": "Firma el contrato de tu préstamo",
  "sign.signedOne": "{name} firmado",
  "sign.signedAll": "Todos los documentos están firmados",
  "sign.loanApproved":
    "Tu solicitud fue aprobada. Ya puedes revisar y firmar electrónicamente los documentos del préstamo, y no se desembolsa nada hasta que estén firmados.",
  "sign.loanDone":
    "Todo está firmado. OPA está pagando la tasa de solicitud, y tu tarjeta virtual aparecerá en la página del préstamo cuando se haya hecho el pago.",
  "sign.loanPackage": "Documentos para revisar y firmar",
  "sign.progress": "{signed} de {count} firmados",
  "sign.reviewAndSign": "Revisar y firmar",
  "sign.loanExternalNote": "La firma se realiza en DocuSign. Allí no se pueden modificar los documentos: lo único que aportas es tu firma, y la fecha se añade automáticamente.",
  "sign.here": "Firma aquí",
  "sign.hereHint": "Pulsa el botón para añadir tu firma.",
  "sign.signOne": "Firmar {name}",
  "sign.signAll": "Firmar los {count} restantes",
  "sign.signAllShort": "Firmar todos los documentos",
  "sign.backToLoan": "Volver a mi préstamo",
  "loanPage.interestRate": "TAE",
  "loanPage.repaymentStarts": "Los pagos empiezan",
  "loanPage.repayment": "Pagos",
  "loanPage.nextPayment": "Próximo pago",
  "loanPage.paymentsMade": "Pagos realizados",
  "loanPage.paymentsMadeValue": "{paid} de {count}",
  "loanPage.progressLine": "{paid} de {count} pagos realizados · último pago {due}",
  "loanPage.dueOn": "Vence el {due}",
  "loanPage.terms": "{count} pagos mensuales · {apr}",
  "loanPage.viewSchedule": "Ver el calendario completo",
  "loanPage.cardEndingLabel": "Tarjeta terminada en",
  "loanPage.cardModalTitle": "Tu tarjeta OPA",
  "loanPage.cardIssuer": "Tarjeta virtual",
  "loanPage.cardOwner": "Emitida por OPA",
  "loanPage.cardholder": "Titular",
  "loanPage.cardExpires": "Caduca",
  "loanPage.cardShowDetails": "Ver los datos de la tarjeta",
  "loanPage.cardHideDetails": "Ocultar los datos",
  "loanPage.cardIssuerView": "Vista segura de USIO",
  "loanPage.cardMock": "Simulación",
  "loanPage.cardNumber": "Número de tarjeta",
  "loanPage.cardCvv": "CVV",
  "loanPage.cardRevealedNote": "Estos datos los muestra USIO, no OPA. Cierra esta ventana al terminar: cualquiera que vea tu pantalla puede leerlos.",
  "loanPage.cancelTitle": "Cancelar este préstamo",
  "loanPage.cancelBody": "Puedes cancelar mientras la tarjeta virtual siga sin usarse. La tarjeta se cierra y no se desembolsa nada.",
  "loanPage.cancelClosedTitle": "Este préstamo ya no se puede cancelar",
  "loanPage.documents": "Documentos",
  "loanPage.docName": "Nombre",
  "loanPage.docType": "Tipo",
  "loanPage.docDate": "Fecha",
  "loanPage.download": "Descargar",
  "loanPage.executed": "Firmado",
  "loanPage.noDocuments": "Todavía no hay nada que descargar",

  "loanPage.signTitle": "Tus documentos del préstamo están listos para firmar",
  "loanPage.signBody": "La firma se realiza en DocuSign. No se desembolsa nada hasta que se firme el contrato.",
  "loanPage.signWaiting": "Tu firma ya está. OPA desembolsará cuando {name} también haya firmado.",
  "loanPage.sign": "Revisar y firmar",

  "loanPage.withdraw": "Retirar solicitud",
  "withdraw.title": "¿Retirar esta solicitud?",
  "withdraw.body": "Se detiene aquí y OPA no continuará con ella. Puedes solicitar de nuevo más adelante, y esa solicitud empezaría desde el principio.",
  "withdraw.confirm": "Retirarla",
  "withdraw.done": "Solicitud retirada",

  "loanPage.loanAmount": "Importe del préstamo",
  "loanPage.unused": "Saldo sin usar",
  "loanPage.schedule": "Calendario de pagos",
  "loanPage.payment": "Importe",
  "schedule.scheduled": "Programado",
  "schedule.paid": "Pagado",
  "schedule.overdue": "Vencido",

  "loanPage.card": "Tu tarjeta OPA",
  "loanPage.cardBody": "USIO custodia la tarjeta. OPA nunca ve ni guarda el número.",
  "loanPage.cardOpen": "Ver",
  "loanPage.cardUnused": "Sin usar",
  "loanPage.cardUsed": "En uso",

  "loanPage.cancel": "Cancelar este préstamo",
  "cancelLoan.title": "¿Cancelar este préstamo?",
  "cancelLoan.body": "Se cierra la tarjeta y no se desembolsa nada. Solo puede hacerse mientras la tarjeta esté sin usar, así que no se puede deshacer una vez confirmes.",
  "cancelLoan.confirm": "Cancelar el préstamo",
  "cancelLoan.done": "Préstamo cancelado",
  "loanPage.cancelBlocked": "La tarjeta ya se ha usado, así que el préstamo ya no se puede cancelar. Llama al servicio de atención de OPA si algo no está bien.",

  "loanPage.stageAwaitingSignature": "Esperando tu firma",
  "loanPage.stageAwaitingOther": "Esperando a {name}",
  "loanPage.stageFunding": "En desembolso",
  "loanPage.fundingTitle": "OPA está desembolsando tu préstamo.",
  "loanPage.fundingBody": "Tu tarjeta virtual aparecerá aquí en cuanto se mueva el dinero. Los pagos empiezan el {date}.",
  "loanPage.fundingBodyCoBorrower": "Te avisaremos por correo en cuanto se mueva el dinero. Los pagos empiezan el {date}.",
  "loanPage.stageFunded": "Desembolsado",
  "loanPage.stageCancelled": "Cancelado",

  "loanPage.journeySigned": "Firmado",
  "loanPage.journeyRepaid": "Pagado",
  "loanPage.journeyDecision": "Decisión",

  "loanPage.submittedOn": "Enviada el {date}",
  "loanPage.withdrawTitle": "Retirar esta solicitud",
  "loanPage.withdrawBody": "Puedes detener la solicitud mientras no haya una decisión. Volver a solicitar más adelante empieza desde el principio.",

  "loanAdmin.addTitle": "Añadir documento o comentario",
  "loanAdmin.attach": "Adjuntar documento",
  "loanAdmin.noteRequired": "Escribe un comentario o adjunta un documento.",
  "loanAdmin.uploadedBy": "Subido por",
  "loanAdmin.uploadedBySystem": "Sistema",
  "loanAdmin.docComment": "Comentario",
  "loanAdmin.unsigned": "Sin firmar",
  "loanAdmin.noteAdded": "Añadido al préstamo",
  "loanAdmin.openRecord": "Abrir el expediente del préstamo",
  "loanAdmin.loanId": "ID del préstamo {id}",
  "loanAdmin.cardIssuance": "Emisión de la tarjeta virtual",
  "loanAdmin.cardIssued": "Emitida · {last4} ({state})",
  "loanAdmin.cardNotIssued": "Todavía no emitida",
  "loanAdmin.cardStateUsed": "usada",
  "loanAdmin.cardStateUnused": "sin usar",
  "loanAdmin.repaymentTerms": "Condiciones de pago",
  "acquisition.title": "Información de captación",
  "acquisition.source": "Fuente de captación",
  "acquisition.partner": "Socio de referencia",
  "acquisition.campaign": "Campaña de marketing",
  "acquisition.notAvailable": "No disponible",
  "acquisition.none": "Este préstamo no tiene información de captación asociada.",
  "acquisition.allSources": "Todas las fuentes",
  "acquisition.allPartners": "Todos los socios",
  "acquisition.allCampaigns": "Todas las campañas",
  "loans.title": "Préstamos",
  "loans.card": "Préstamo",
  "loans.searchPlaceholder": "Buscar por nombre o correo",
  "loans.allStatuses": "Todos los estados",
  "loans.col.borrower": "Titular",
  "loans.col.amount": "Importe",
  "loans.col.rate": "Tipo",
  "loans.col.status": "Estado del préstamo",
  "loans.col.agreement": "Contrato",
  "loans.col.funded": "Desembolsado",
  "loans.agreementSigned": "Firmado",
  "loans.agreementUnsigned": "Sin firmar",
  "loans.empty": "Ningún préstamo coincide con la búsqueda",
  "loans.emptyHint": "Borra la búsqueda o prueba con otro nombre.",
  "loans.notFound": "Ese préstamo no existe",
  "loans.back": "Volver a los préstamos",
  "loanAdmin.comments": "Comentarios",
  "loanAdmin.noComments": "Sin comentarios en este préstamo",
  "loanAdmin.commentLabel": "Comentario",
  "loanAdmin.commentPlaceholder": "¿Qué debería saber la próxima persona que lea este préstamo?",
  "loanAdmin.save": "Guardar",
  "loanAdmin.funding": "Estado del desembolso",

  "application.needsInfoTitle": "Nos falta una cosa",
  "application.needsInfoBody": "La persona que revisa tu solicitud ha pedido algo. Tu solicitud espera aquí hasta que llegue.",
  "application.needsInfoAction": "Ver qué se necesita",
  "application.checkPausedTitle": "Una de nuestras verificaciones no responde",
  "application.checkPausedBody": "Es cosa nuestra, no tuya. No se pierde nada de lo que enviaste y tu solicitud no ha sido rechazada. Continúa sola en cuanto el servicio vuelva.",
  "application.checkPausedAction": "Volver a mi perfil",
  "application.coBorrowerNeededTitle": "Tu solicitud necesita un coprestatario",
  "application.coBorrowerNeededBody": "Un coprestatario solicita junto a ti y comparte la responsabilidad de devolver el préstamo. Invita a uno y tu solicitud continúa desde ahí.",
  "application.coBorrowerNeededAction": "Invitar a un coprestatario",
  "application.stoppedTitle": "No podemos continuar con esta solicitud",
  "application.stoppedBody": "Llama al servicio de atención de OPA para que alguien la revise contigo.",
  "application.stoppedAction": "Llamar al (800) 555-0142",

  "moreInfo.title": "Envía lo que se te pidió",
  "moreInfo.subtitle": "Tu solicitud vuelve a revisión en cuanto envíes esto.",
  "moreInfo.requested": "Qué se pidió",
  "moreInfo.askedBy": "{name} lo pidió el {date}",
  "moreInfo.upload": "Documentos",
  "moreInfo.uploadHelp": "PDF, JPG o PNG. El equipo de suscripción los lee, así que deben ser legibles.",
  "moreInfo.choose": "Elegir un archivo",
  "moreInfo.note": "Algo que quieras añadir",
  "moreInfo.notePlaceholder": "Opcional. Una frase sobre lo que has enviado, si ayuda.",
  "moreInfo.submit": "Enviar y reenviar a revisión",
  "moreInfo.sent": "Enviado. Tu solicitud está de vuelta con quien la revisa.",
  "moreInfo.needSomething": "Adjunta un documento o escribe una nota antes de enviar",

  // ── Epic 4 — Loan decisioning ──────────────────────────────────────────
  "check.viaInstantId": "LexisNexis InstantID",
  "check.viaSanctions": "Lista de sanciones OFAC",
  "check.viaNoLendList": "Listas DO NOT LOAN y de rechazos recientes",
  "check.viaEquifax": "Equifax · la puntuación solo se ve en este portal",
  "check.viaOcr": "Resultado del OCR",
  "check.viaRules": "Resultado de las reglas automáticas",
  "check.identity": "Verificación de identidad",
  "check.ofac": "Control OFAC",
  "check.noLend": "Consulta NO LEND",
  "check.credit": "Consulta de crédito",
  "check.income": "Verificación de ingresos",
  "check.rules": "Resultado de elegibilidad",
  "check.whatIdentity":
    "LexisNexis InstantID cotejó el nombre, la fecha de nacimiento, el domicilio y el SSN con registros públicos.",
  "check.whatOfac":
    "Cotejado con la lista de sanciones OFAC, como parte de la verificación de identidad.",
  "check.whatNoLend":
    "Buscó una solicitud o un préstamo abiertos, y consultó la lista heredada de no préstamo y los rechazos de los últimos 6 meses.",
  "check.whatIncome":
    "Leyó los documentos subidos para confirmar que existe una fuente de ingresos. El importe no se verifica.",
  "verify.creditScore": "Puntaje de crédito",
  "verify.bandPoor": "Bajo",
  "verify.bandFair": "Medio",
  "verify.bandGood": "Bueno",
  "check.pending": "Aún no ejecutada",
  "check.passed": "Superada",
  "check.review": "Marcada",
  "check.failed": "No superada",
  "check.unavailable": "Servicio no disponible",
  "check.ranOn": "Ejecutada el {date}",
  "check.notRun": "Sin ejecutar",
  "check.rulesBlocked":
    "Las reglas se ejecutan al final. Primero hay que resolver: {check}.",

  "application.pendingAction": "Acción pendiente",

  "queue.col.name": "Nombre",
  "queue.col.source": "Origen",
  "queue.col.income": "Ingresos",
  "queue.review": "Revisar",
  "queue.export": "Exportar",
  "queue.exportXlsx": "Exportar en XLSX",
  "queue.exportCsv": "Exportar en CSV",
  "queue.exported": "Exportando {count} solicitudes",

  "reporting.title": "Informes",
  "reporting.lead": "Exporta informes y datos de solicitudes para tus registros. Los archivos se descargan en XLSX o CSV.",
  "reporting.statApplications": "Solicitudes",
  "reporting.statApproved": "Aprobadas",
  "reporting.statDeclined": "Rechazadas",
  "reporting.statInReview": "En revisión",
  "reporting.statBorrowers": "Prestatarios",

  "acq.save": "Guardar",
  "acq.col.status": "Estado",
  "acq.status.active": "Activo",
  "acq.status.inactive": "Inactivo",
  "acq.action.edit": "Editar",
  "acq.action.activate": "Activar",
  "acq.action.deactivate": "Desactivar",
  "acq.action.delete": "Eliminar",
  "acq.rowActions": "Acciones para {name}",
  "acq.activateTitle": "¿Activar esta fuente?",
  "acq.activateBody": "{name} volverá a estar disponible para nuevos préstamos.",
  "acq.deactivateTitle": "¿Desactivar esta fuente?",
  "acq.deactivateBody": "{name} dejará de ofrecerse para nuevos préstamos. Las atribuciones existentes no se ven afectadas.",
  "acq.activated": "{name} activada",
  "acq.deactivated": "{name} desactivada",
  "acq.source.title": "Fuentes de captación",
  "acq.source.new": "Nueva fuente",
  "acq.source.newTitle": "Nueva fuente de captación",
  "acq.source.editTitle": "Editar fuente de captación",
  "acq.source.name": "Nombre",
  "acq.source.partner": "Socio",
  "acq.source.code": "Código",
  "acq.source.codePlaceholder": "p. ej. ORG-SEARCH",
  "acq.source.deleteTitle": "¿Eliminar esta fuente?",
  "acq.source.deleteBody": "{name} se eliminará. Los préstamos ya atribuidos conservan su historial.",
  "acq.source.created": "Fuente creada",
  "acq.source.updated": "Fuente actualizada",
  "acq.source.deleted": "Fuente eliminada",
  "acq.source.empty": "Aún no hay fuentes de captación",
  "acq.source.emptyHint": "Crea una para empezar a clasificar cómo llegan los préstamos.",
  "acq.saved": "Cambios guardados",
  "acq.deleteTitle": "¿Eliminar este {noun}?",
  "acq.deleteBody": "{name} se eliminará. Los préstamos ya atribuidos conservan su historial.",
  "acq.activateTitleGeneric": "¿Activar este {noun}?",
  "acq.activateBodyGeneric": "{name} volverá a estar disponible.",
  "acq.deactivateTitleGeneric": "¿Desactivar este {noun}?",
  "acq.deactivateBodyGeneric": "{name} dejará de ofrecerse para nuevos préstamos. Las atribuciones existentes no se ven afectadas.",
  "acq.partner.noun": "socio",
  "acq.group.noun": "grupo de socios",
  "acq.partners.title": "Socios de referencia",
  "acq.partners.tabPartners": "Socios de referencia",
  "acq.partners.tabGroups": "Grupos de socios",
  "acq.partner.new": "Nuevo socio",
  "acq.partner.newTitle": "Nuevo socio de referencia",
  "acq.partner.editTitle": "Editar socio de referencia",
  "acq.partner.name": "Nombre",
  "acq.partner.group": "Grupo de socios",
  "acq.group.new": "Nuevo grupo",
  "acq.group.newTitle": "Nuevo grupo de socios",
  "acq.group.editTitle": "Editar grupo de socios",
  "acq.group.name": "Nombre",
  "acq.group.code": "Código",
  "acq.campaign.noun": "campaña",
  "acq.campaign.title": "Campañas de marketing",
  "acq.campaign.new": "Nueva campaña",
  "acq.campaign.newTitle": "Nueva campaña de marketing",
  "acq.campaign.editTitle": "Editar campaña de marketing",
  "acq.campaign.name": "Nombre",
  "acq.campaign.source": "Fuente",
  "acq.campaign.period": "Periodo de validez",
  "acq.campaign.empty": "Aún no hay campañas",
  "acq.campaign.emptyHint": "Crea una para hacer seguimiento de una acción de marketing.",
  "acq.perf.title": "Rendimiento de préstamos",
  "acq.perf.lead": "Crea un informe de crédito o de crédito al consumidor acotado a un canal de captación.",
  "acq.perf.analyzeBy": "Analizar por",
  "acq.perf.dimCampaign": "Campaña",
  "acq.perf.dimGroup": "Grupo de socios",
  "acq.perf.dimPartner": "Socio de referencia",
  "acq.perf.dimSource": "Fuente de captación",
  "acq.perf.selectValue": "Selecciona uno",
  "acq.perf.reportType": "Informe",
  "acq.perf.reportCredit": "Informe de crédito",
  "acq.perf.reportConsumer": "Informe de crédito al consumidor",
  "acq.perf.create": "Crear informe",
  "acq.perf.created": "Preparando el informe de {name}",
  "acq.perf.statLoans": "Préstamos totales",
  "acq.perf.statReports": "Informes de crédito",
  "acq.perf.statVolume": "Volumen de préstamos",
  "acq.perf.statApproval": "Tasa de aprobación",
  "acq.perf.byChannel": "Por canal",
  "acq.perf.colChannel": "Canal",
  "acq.perf.colLoans": "Préstamos",
  "acq.perf.colReports": "Informes de crédito",
  "acq.perf.colApproval": "Tasa de aprobación",

  "staffDash.jumpTo": "Ir a",
  "staffDash.quickActions": "Acciones rápidas",
  "staffDash.donutTitle": "Estado de solicitudes",
  "staffDash.donutCenter": "Total",
  "staffDash.statPending": "Pendientes",
  "staffDash.recentApps": "Solicitudes recientes",
  "staffDash.recentLoans": "Préstamos recientes",
  "staffDash.colBorrower": "Prestatario",
  "staffDash.colStatus": "Estado",
  "staffDash.colAmount": "Importe",
  "reporting.creditTitle": "Informe de crédito",
  "reporting.creditDesc": "Informes y puntuaciones de crédito del prestatario obtenidos de Equifax.",
  "reporting.metroTitle": "Informe de crédito al consumidor (Metro II)",
  "reporting.metroDesc": "El informe mensual Metro II que OPA envía a Equifax.",
  "reporting.appDataTitle": "Datos de solicitudes",
  "reporting.appDataDesc": "La lista completa de solicitudes de préstamo y su estado.",
  "reporting.exported": "Preparando tu exportación de {report}",
  "queue.title": "Cola de suscripción",
  "queue.col.uscis": "Servicio USCIS",
  "queue.col.amount": "Importe",
  "queue.empty": "Ninguna solicitud coincide con estos filtros",
  "queue.emptyBody": "Quita un filtro o vuelve cuando se envíe la siguiente solicitud.",
  "queue.coBorrowerTag": "Coprestatario",

  "appDetail.back": "Volver a las solicitudes",
  "appDetail.notFound": "No hay ninguna solicitud con ese número",
  "appDetail.borrower": "Prestatario",
  "appDetail.coBorrower": "Coprestatario",
  "appDetail.checks": "Resultados de verificación",
  "appDetail.application": "Solicitud",
  "appDetail.documents": "Documentos",
  "appDetail.requests": "Peticiones de información",
  "appDetail.audit": "Historial",
  "appDetail.requested": "Importe solicitado",
  "appDetail.approved": "Importe aprobado",
  "appDetail.uscis": "Servicio USCIS",
  "appDetail.submitted": "Enviada",
  "appDetail.coBorrowerRequired": "Esta solicitud requiere un coprestatario",
  "appDetail.noCoBorrower": "Esta solicitud no tiene coprestatario",
  "appDetail.noRequests": "No se ha pedido nada",
  "appDetail.askedBy": "Pedido por {name} el {date}",
  "appDetail.answeredOn": "Respondido el {date}",
  "appDetail.awaitingAnswer": "Esperando al prestatario",
  "appDetail.decidedBy": "{outcome} por {name} el {date}",
  "appDetail.decidedByShort": "por {name} · {date}",
  "appDetail.sourceAutomated": "Automática",
  "appDetail.sourceManual": "Manual",
  "appDetail.sourceOverride": "Anulación",
  "appDetail.readOnly": "Tienes acceso de solo lectura a las solicitudes",
  "appDetail.readOnlyBody": "Puedes ver todo en esta página. Decidir, pedir información y cambiar el importe corresponden a un suscriptor.",

  "appAction.approve": "Aprobar",
  "appAction.decline": "Rechazar",
  "appAction.override": "Anular decisión",
  "appDetail.actions": "Acciones de suscripción",
  "appDetail.bySystem": "Sistema",
  "appDetail.coBorrowerChecks": "Resultados de verificación del codeudor",
  "appAction.autoDecided": "El sistema lo decidió automáticamente: {outcome}.",
  "appAction.alreadyDecided": "Esta solicitud ya está decidida: {outcome}.",
  "appAction.outcome.approved": "aprobada",
  "appAction.outcome.declined": "rechazada",
  "amountPanel.currentIs": "Actualmente {amount}",
  "amountPanel.newAmount": "Nuevo importe (USD)",
  "amountPanel.history": "Historial de cambios",
  "amountPanel.noChanges": "El importe no se ha modificado.",
  "amountPanel.colWhen": "Cuándo",
  "amountPanel.colChange": "Cambio",
  "amountPanel.colBy": "Por",
  "amountPanel.colReason": "Motivo",
  "amountPanel.reasonPlaceholder": "p. ej. cambio en la tasa de USCIS",
  "appAction.requestInfo": "Pedir información",
  "appAction.editAmount": "Cambiar importe",

  "approveModal.title": "¿Aprobar esta solicitud?",
  "approveModal.body": "El prestatario recibe un aviso en cuanto apruebes. Los documentos del préstamo se generan después.",
  "approveModal.reason": "Nota (opcional)",
  "approveModal.reasonHint": "Se registra con tu nombre y la hora.",
  "declineModal.title": "¿Rechazar esta solicitud?",
  "declineModal.body": "El prestatario recibe un aviso en cuanto rechaces. Esto no se puede deshacer desde aquí.",
  "declineModal.reason": "Motivo",
  "declineModal.reasonHint": "Obligatorio. Se registra y se usa en el aviso que recibe el prestatario.",
  "overrideModal.title": "¿Anular esta decisión?",
  "overrideModal.body": "Esto sustituye la decisión que tomaron las reglas. La decisión anterior queda en el historial.",
  "overrideModal.outcome": "Nueva decisión",
  "overrideModal.reason": "Motivo",
  "overrideModal.reasonHint": "Obligatorio y se conserva para auditoría.",
  "requestModal.title": "Pedir información",
  "requestModal.body": "Se envía un correo al prestatario y la solicitud pasa a Acción pendiente hasta que responda.",
  "requestModal.note": "¿Qué necesitas?",
  "requestModal.notePlaceholder": "Sé concreto: qué falta y qué lo resolvería.",
  "requestModal.send": "Enviar petición",
  "amountModal.title": "Cambiar el importe solicitado",
  "amountModal.body": "Úsalo cuando el importe que puedes aprobar no sea el que se pidió. Cambiarlo puede recalcular las condiciones y regenerar los documentos.",
  "amountModal.requested": "Solicitado",
  "amountModal.newAmount": "Importe aprobado",
  "amountModal.reason": "Motivo",
  "amountModal.reasonHint": "Obligatorio. Se registra con el valor anterior y el nuevo.",
  "amountModal.save": "Guardar importe",

  "audit.submitted": "Solicitud enviada",
  "audit.routed": "Enviada a revisión manual",
  "audit.coBorrowerRequired": "Coprestatario requerido",
  "audit.coBorrowerCompleted": "El coprestatario completó su parte",
  "audit.checkUnavailable": "Una verificación no pudo ejecutarse",
  "audit.approvedAuto": "Aprobada automáticamente",
  "audit.declinedAuto": "Rechazada automáticamente",
  "audit.approved": "Aprobada",
  "audit.declined": "Rechazada",
  "audit.overridden": "Decisión anulada",
  "audit.infoRequested": "Información solicitada",
  "audit.infoSubmitted": "El prestatario respondió",
  "audit.amountChanged": "Importe aprobado modificado",
  "audit.from": "Desde",
  "audit.to": "Hasta",
  "audit.reason": "Motivo",

  "uscis.n400": "N-400 · Solicitud de naturalización",
  "uscis.i485": "I-485 · Ajuste de estatus / residencia permanente",
  "uscis.i765": "I-765 · Autorización de empleo",
  "uscis.i130": "I-130 · Petición para familiar extranjero",
  "uscis.n600": "N-600 · Certificado de ciudadanía",
  "applicationType.single": "Un solicitante, tasa estándar",
  "applicationType.singleReduced": "Un solicitante, tasa reducida",
  "applicationType.family2": "Dos solicitantes",
  "applicationType.family3": "Tres solicitantes",
  "incomeDoc.paystub": "Recibo de nómina reciente",
  "incomeDoc.w2": "W-2",
  "incomeDoc.taxReturn": "Declaración de impuestos",
  "incomeDoc.bankStatement": "Extracto bancario",
  "incomeDoc.employerLetter": "Carta del empleador",
  "heardAbout.search": "Buscador",
  "heardAbout.friend": "Amistad o familia",
  "heardAbout.community": "Organización comunitaria",
  "heardAbout.attorney": "Abogado de inmigración",
  "heardAbout.social": "Redes sociales",
  "heardAbout.other": "En otro sitio",
  "doc.creditAuthorization": "Autorización de crédito",
  "doc.eConsent": "Consentimiento de comunicaciones electrónicas",
  "doc.privacyNotice": "Aviso de privacidad",
  "doc.creditScoreDisclosure": "Divulgación del puntaje de crédito",
  "doc.coBorrowerAcknowledgement": "Reconocimiento del coprestatario",
  "doc.caPrivacy": "Aviso de privacidad para consumidores de California",
  "doc.nyDisclosure": "Divulgación para prestatarios de Nueva York",
  "doc.txDisclosure": "Divulgación para consumidores de Texas",
  "payments.title": "Pagos",
  "payments.tabScheduled": "Pago programado",
  "payments.tabAdditional": "Pago adicional",
  "payments.installmentLabel": "Cuota",
  "payments.installmentPlaceholder": "Elige una cuota",
  "payments.installmentRequired": "Elige qué cuota estás pagando.",
  "payments.installmentOption": "N.º {number} · Vence el {due} · {amount}",
  "payments.payingWith": "Se cobrarán {amount} en la tarjeta {brand} Debit •••• {last4}.",
  "payments.borrower": "Titular",
  "payments.number": "N.º",
  "payments.dueDate": "Fecha de vencimiento",
  "payments.payNow": "Pagar ahora",
  "payments.nextPaymentLine": "Próximo el {due}",
  "payments.savedCard": "Tarjeta guardada",
  "payments.filterByBorrower": "Filtrar por titular",

  "payments.noneTitle": "Todavía no hay nada que pagar",
  "payments.noneBody": "Tu calendario de pagos se crea cuando se desembolsa el préstamo. Aparecerá aquí con cada fecha de vencimiento.",
  "payments.viewLoan": "Ir a mi préstamo",
  "payments.noLoanTitle": "Todavía no hay pagos",
  "payments.noLoanBody":
    "Los pagos empiezan cuando OPA te haya desembolsado un préstamo. Solicítalo y el calendario aparecerá aquí.",
  "payments.startApplication": "Iniciar la solicitud",

  "payments.outstanding": "Saldo pendiente",
  "payments.makePayment": "Hacer un pago",
  "payments.nothingDue": "No queda nada por pagar",
  "payments.feesApplied": "Recargos",
  "payments.payoffToday": "Liquidar hoy",
  "payments.maturity": "Último pago",

  "payments.overdueTitle": "Hay un pago con {days} días de retraso",
  "payments.overdueBody": "Tienes {pastDue} vencidos. El recargo por mora se cobra el día 16 después del vencimiento y es de $5.00 o el 5% del pago no realizado, la cantidad que sea menor. Solo se cobra un recargo por cada pago omitido.",
  "payments.defaultTitle": "Esta cuenta está en mora, con {days} días de retraso",
  "payments.defaultBody": "Una cuenta con más de 90 días de retraso se considera en mora. El total vencido de {pastDue} debe pagarse en un plazo de 30 días para evitar que se acelere el préstamo.",
  "payments.acceleratedTitle": "Este préstamo se ha acelerado, con {days} días de retraso",
  "payments.acceleratedBody": "Una cuenta con más de 120 días de retraso se acelera. El saldo restante completo de {outstanding}, incluidos los intereses y los recargos pendientes, debe pagarse en un plazo de 30 días desde el aviso de mora. La TAE se mantiene en {apr}.",

  "payments.stateOverdue": "{days} días de retraso",
  "payments.stateDefault": "En mora · {days} días",
  "payments.stateAccelerated": "Acelerado · {days} días",
  "payments.pastDueLabel": "Vencido",
  "payments.progressLine": "{percent}%",
  "payments.progressCount": "{paid} de {total} pagadas",


  "payments.rulesTitle": "Cómo funcionan los recargos y las cuentas vencidas",
  "payments.ruleLateFee": "Si un pago mensual no se recibe en los 15 días naturales posteriores al vencimiento, el día 16 se cobra un recargo por mora. El recargo es de $5.00 o el 5% del pago no realizado, la cantidad que sea menor. Solo se cobra un recargo por cada pago omitido.",
  "payments.ruleDefault": "Una cuenta con más de 90 días de retraso se considera en mora. El total vencido debe pagarse entonces en un plazo de 30 días para evitar que se acelere el préstamo.",
  "payments.ruleAcceleration": "Una cuenta con más de 120 días de retraso se acelera: el saldo restante completo, incluidos los intereses y los recargos pendientes, debe pagarse en un plazo de 30 días desde el aviso de mora. La TAE se mantiene en el 1%.",

  "payments.history": "Historial de pagos",
  "payments.date": "Fecha",
  "payments.method": "Pagado con",
  "payments.cardEnding": "•••• {last4}",
  "payments.reference": "Referencia",
  "payments.paidByBorrower": "Tarjeta del titular",
  "payments.paidByCoBorrower": "Tarjeta del codeudor",
  "payments.retry": "Intentar de nuevo",
  "payments.noHistory": "Todavía no hay pagos",
  "payments.noHistoryBody": "Cada intento aparece aquí, tanto si se completó como si no.",
  "payments.succeeded": "Completado",
  "payments.pending": "Pendiente",
  "payments.failed": "Fallido",
  "payments.refunded": "Reembolsado",
  "payments.reversed": "Revertido",
  "payments.noteDeclined": "El banco rechazó la tarjeta.",
  "payments.noteExpired": "La tarjeta había caducado.",
  "payments.noteInsufficient": "No había fondos suficientes en la cuenta.",
  "payments.notePending": "Repay todavía está procesando este pago.",
  "payments.noteRefunded": "Este pago se reembolsó y el saldo ya se ha ajustado.",
  "payments.noteReversed": "El banco revirtió este pago, así que ya no cuenta para el saldo.",

  "payments.cardPrivacy": "Cada tarjeta solo la ve quien la añadió.",
  "payments.noCard": "Todavía no hay tarjeta de pago",
  "payments.noCardBody": "Añade una tarjeta de débito estadounidense y tus pagos programados se cobrarán en ella.",
  "payments.noCardCo": "No has añadido ninguna tarjeta. A ti no se te muestra la tarjeta del titular, y a él no se le muestra la tuya.",
  "payments.addCard": "Añadir una tarjeta",
  "payments.saveCardTitle": "¿Guardar esta tarjeta?",
  "payments.saveCardBody": "Desde ahora, todos los pagos de este préstamo se cobrarán a esta tarjeta.",
  "payments.saveCardBodyReplace": "Se elimina la tarjeta que termina en {last4} y, desde ahora, todos los pagos se cobrarán a la nueva.",
  "payments.saveCardConfirm": "Guardar la tarjeta",
  "payments.replaceTitle": "Esto sustituye tu tarjeta",
  "payments.replaceBody": "La tarjeta que termina en {last4} se elimina en cuanto se acepte la nueva, y la nueva pasa por las mismas comprobaciones de Repay que la primera. Solo se admiten tarjetas de débito estadounidenses.",
  "payments.cardSaved": "Tarjeta guardada",
  "payments.cardReplaced": "Tarjeta sustituida",

  "payments.payTitle": "Hacer un pago",
  "payments.payAmount": "Pagar {amount}",
  "payments.noCardToCharge": "No hay ninguna tarjeta en la que cobrar este pago.",
  "payments.choicePayoff": "Liquidar el saldo restante ({payoff})",
  "payments.choiceOther": "Importe personalizado",
  "payments.otherLabel": "Importe",
  "payments.otherRequired": "Indica cuánto quieres pagar.",
  "payments.otherTooMuch": "Eso es más de lo que se debe. El máximo que puedes pagar es {payoff}.",
  "payments.resultSucceeded": "Pago enviado",
  "payments.resultPending": "El pago se está procesando",
  "payments.resultFailed": "El pago no se ha completado",
  "payments.resultRefunded": "Pago reembolsado",
  "payments.resultReversed": "Pago revertido",

  "card.inactive": "No en uso",


  "country.mx": "México",
  "country.gt": "Guatemala",
  "country.hn": "Honduras",
  "country.sv": "El Salvador",
  "country.co": "Colombia",
  "country.ve": "Venezuela",
  "country.ph": "Filipinas",
  "country.in": "India",
  "country.ng": "Nigeria",
  "country.ua": "Ucrania",
  "communication.email": "Correo electrónico",
  "communication.sms": "SMS",
};

export const dictionary = { en, es } as const;
