// src/flows/loan/sign/SignLoanScreen.tsx
//
// Epic 5 story 2 — "Sign Your Loan Agreement", the wireframe's own screen.
// The loan page links here once the application is approved.
//
// SIGNING THE LAST DOCUMENT MOVES THE PROTOTYPE ON BY ITSELF.
//
// The designer's rule, and it is a good one: *"როცა signs ვაკეთებ დოკუმენტებზე
// ავტომატურად უნდა გადადიოდეს... ხოლო რაც ჩვენზე არაა დამოკიდებული და
// ადმინებს ველოდებით, მაგაზე კი უნდა მიწევდეს [დემო ღილაკზე დაწოლა]."*
//
// Signing is the BORROWER'S act — nothing and nobody else has to happen for
// it — so when the package is complete the page moves on by itself. It moves
// to `funding`, NOT to a funded loan: WBS story 2 signs "before loan funding"
// and Notifications has its own story for the confirmation that arrives "when
// the loan has been funded and the Virtual Payment Card is available". The
// money moving is OPA's and USIO's, so that step waits for the demo dock,
// exactly like a decision on the application does.
//
// Dumb: mock package, signing is local state plus a console.log; the stage is
// preview plumbing, not product state (see flows/loan/loanRecord.ts).

import { useState } from "react";
import { App, Button, Flex, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "@tanstack/react-router";
import { AppHeader } from "../../../shared/ui/AppHeader";
import { HeroBackdrop } from "../../../shared/ui/HeroBackdrop";
import { borrowerNav } from "../../../shared/ui/navigation";
import { BorrowerInbox } from "../../notifications/BorrowerInbox";
import { useUnreadCount } from "../../notifications/notifications";
import { useT } from "../../../shared/ui/i18n/useT";
import { useCustomerViewer } from "../../../shared/ui/viewerRole";
import { SessionTimeoutModal } from "../../../features/Auth/ui/SessionTimeoutModal";
import { useIdleTimer, DEFAULT_IDLE_MS } from "../../../features/Auth/ui/useIdleTimer";
import { SignLoanAgreement } from "../../../features/Loan/ui/SignLoanAgreement";
import type { LoanDocument } from "../../../features/Loan/ui/types";
import { applySignature, setStage, signedEverything, useLoanRecord } from "../loanRecord";
import { loanPackageFor } from "../mockLoan";
import { styles } from "../LoanScreen.styles";
import { styles as signStyles } from "./SignLoanScreen.styles";

export type SignLoanScreenProps = {
  /** Left off, the package is the one generated for whoever is signing. */
  documents?: LoanDocument[];
  userName?: string;
  idleMs?: number;
};

export default function SignLoanScreen({
  documents,
  userName,
  idleMs = DEFAULT_IDLE_MS,
}: SignLoanScreenProps) {
  const navigate = useNavigate();
  const viewer = useCustomerViewer();
  /** WBS Notifications: what the bell's badge counts. */
  const unreadCount = useUnreadCount(viewer.role);
  const person = userName ?? viewer.name;
  /* WBS: the package is generated per role, so the co-borrower's carries the
     notice that says what co-signing means and the borrower's does not. */
  const documentPackage = documents ?? loanPackageFor(viewer.role);
  const t = useT();
  const { message } = App.useApp();
  const { idle, reset: staySignedIn } = useIdleTimer(idleMs);

  const [signed, setSigned] = useState<string[]>([]);
  const record = useLoanRecord();

  /**
   * THIS PERSON'S PACKAGE IS COMPLETE. THE LOAN'S MAY NOT BE.
   *
   * WBS story 2: the documents are signed by "the Borrower AND Co-borrower…
   * BEFORE loan funding". So finishing here records THIS signature, and the
   * loan moves to funding only when every signature the application needs is
   * in. On a loan with a co-borrower, the first of the two to finish is told
   * their part is done and who is still to sign — the alternative was the
   * page announcing that OPA is paying out a loan nobody else has signed.
   *
   * A short pause first either way, so the last row can be seen turning
   * "Signed" and the banner can say so — a page that vanishes the instant you
   * press a button leaves you wondering what you just did.
   */
  const finish = () => {
    applySignature(viewer.role);
    window.setTimeout(() => {
      if (signedEverything(record)) setStage("funding");
      navigate({ to: "/loan" });
    }, 1400);
  };

  return (
    <>
      <AppHeader
        navItems={borrowerNav}
        notifications={<BorrowerInbox />}
        notificationCount={unreadCount}
        activeKey="loan"
        userName={person}
        profileTo="/profile"
        onLogout={() => {
          console.log("log out");
          navigate({ to: "/" });
        }}
      />

      <HeroBackdrop tone="plain" paddingBlock={0}>
        <div style={styles.page}>
          <div style={styles.column}>
            {/* THE WAY BACK IS AT THE TOP, and it is the back-office's own
                control: a circle with an arrow in it, before the title.
                It was a text button at the foot of the page — the last thing
                on a page whose subject is the first thing, and unreachable
                without scrolling past everything. */}
            <Flex align="center" gap={16} wrap style={signStyles.titleRow}>
              <Button
                shape="circle"
                icon={<ArrowLeftOutlined />}
                aria-label={t("sign.backToLoan")}
                onClick={() => navigate({ to: "/loan" })}
              />
              <Typography.Title level={3} style={styles.title}>
                {t("sign.loanTitle")}
              </Typography.Title>
            </Flex>

            <SignLoanAgreement
              documents={documentPackage}
              signed={signed}
              onSign={(document) => {
                console.log("open DocuSign", document.name);
                const next = [...signed, document.id];
                setSigned(next);
                message.success(t("sign.signedOne", { name: document.name }));
                if (next.length === documentPackage.length) finish();
              }}
              onSignAll={() => {
                console.log("open DocuSign for the whole package");
                setSigned(documentPackage.map((document) => document.id));
                message.success(t("sign.signedAll"));
                finish();
              }}
            />
          </div>
        </div>
      </HeroBackdrop>

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
