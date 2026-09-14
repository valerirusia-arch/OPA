// src/flows/invitation/CoBorrowerInvitationScreen.tsx
//
// Epic 3, WBS story 9 — where the co-borrower's invitation link lands.
//
// "The system shall allow a co-borrower to create a personal account, IF
// REQUIRED, to securely access the assigned loan application and complete the
// required application steps."
//
// "If required" is doing work in that sentence. Somebody invited as a
// co-borrower may already have an OPA account — they could be a past borrower,
// or a co-borrower on somebody else's application — and telling them to create
// a second one would either fail on a duplicate email or split one person
// across two accounts. So the screen offers both doors: register, or sign in
// to the account you already have.
//
// The wireframe's own note says the account itself is created "using the same
// registration flow as the one used in the authentication section", so this
// screen does not repeat that form — it says who invited them and what they
// are agreeing to look at, then hands over to Epic 1's registration.
//
// The other state the WBS names is the one that expires: invitations are good
// for five calendar days, and an expired one is a dead end the co-borrower
// cannot fix alone — so it names the person who can.
//
// Both doors carry `?next=/co-application`, so finishing registration or
// signing in lands the co-borrower on the application they were invited to
// rather than on their own profile — which is where a shared auth screen would
// otherwise leave them, with no sign of why they followed the link at all.
//
// Dumb: which state shows is a prop; nothing validates the token in the URL.

import { Avatar, Button, Card, Divider, Flex, Result, Typography, theme } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "@tanstack/react-router";
import { useT } from "../../shared/ui/i18n/useT";
import { NEXT_PARAM } from "../../shared/ui/nextDestination";
import { InvitationMark } from "../../features/LoanApplication/ui/InvitationMark";
import { AuthLayout } from "../../features/Auth/ui/AuthLayout";
import { getStyles, styles } from "./CoBorrowerInvitationScreen.styles";

export type CoBorrowerInvitationScreenProps = {
  /** Who sent it — the borrower this co-borrower would be applying with. */
  invitedBy?: string;
  expiresOn?: string;
  expired?: boolean;
};

/** The application this invitation is for. Carried through the auth screens. */
const APPLICATION = "/co-application";

export default function CoBorrowerInvitationScreen({
  invitedBy = "Levi Ackerman",
  expiresOn = "19 Aug 2026",
  expired = false,
}: CoBorrowerInvitationScreenProps) {
  const navigate = useNavigate();
  const t = useT();
  const { token } = theme.useToken();
  const s = getStyles(token);
  const withReturn = { search: { [NEXT_PARAM]: APPLICATION } };

  return (
    <AuthLayout>
      <Card style={styles.panel}>
        {expired ? (
          <Result
            style={styles.result}
            icon={
              <Avatar size={56} icon={<ClockCircleOutlined />} style={s.expiredBadge} />
            }
            title={t("invite.expiredTitle")}
            subTitle={t("invite.expiredBody", { name: invitedBy })}
            styles={{ title: s.title, subTitle: s.subTitle, extra: s.extra }}
            extra={
              <Button size="large" onClick={() => navigate({ to: "/contact" })}>
                {t("nav.contact")}
              </Button>
            }
          />
        ) : (
          <>
            <Result
              style={styles.result}
              icon={<InvitationMark />}
              title={t("invite.title")}
              subTitle={t("invite.body", { name: invitedBy })}
              styles={{ title: s.title, subTitle: s.subTitle, extra: s.extra }}
              extra={
                <Button
                  type="primary"
                  size="large"
                  onClick={() => navigate({ to: "/register", ...withReturn })}
                >
                  {t("invite.accept")}
                </Button>
              }
            />

            {/* The second door, quieter than the first: most people arriving
                on an invitation are new, so registering stays the primary
                action and signing in sits under it. */}
            {/* wrap + nowrap link: on a narrow phone the question and the link
                fall onto two lines instead of the link's word breaking apart
                ("Sig / n in"). */}
            <Flex justify="center" gap={4} wrap style={styles.signIn}>
              <Typography.Text type="secondary">
                {t("register.haveAccount")}
              </Typography.Text>
              {/* A Typography.Link inside a router Link would nest one <a>
                  inside another, so navigation goes through the callback. */}
              <Typography.Link
                onClick={() => navigate({ to: "/", ...withReturn })}
                style={{ whiteSpace: "nowrap" }}
              >
                {t("login.submit")}
              </Typography.Link>
            </Flex>

            {/* The deadline is a different KIND of thing from everything above
                it — a fact about the invitation, not a step in it — so it is
                set apart rather than added as a third grey paragraph. */}
            <Divider style={styles.divider} />
            <Flex align="center" justify="center" gap={6}>
              <ClockCircleOutlined style={s.metaIcon} />
              <Typography.Text type="secondary" style={styles.meta}>
                {t("invite.expires", { date: expiresOn })}
              </Typography.Text>
            </Flex>
          </>
        )}
      </Card>
    </AuthLayout>
  );
}
