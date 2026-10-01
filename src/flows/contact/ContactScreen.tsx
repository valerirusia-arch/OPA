// src/flows/contact/ContactScreen.tsx
//
// Epic 3, WBS story 8 — "borrower shall be able to access a static page with
// support contacts details (information only, no interactive elements)".
//
// Taken literally: no contact form, no chat launcher, no click-to-call, no map
// link. Nothing on this page can be pressed. A reader still gets the number,
// the address and the hours — the story asks for them to be ACCESSIBLE, not
// actionable — and on a phone the operating system finds a phone number in
// plain text anyway, which is the one thing a `tel:` link was buying.
//
// ─────────────────────────────────────────────────────────────────────────
// THE REDESIGN, and the one idea behind it.
//
// It was four identical cards in a row: phone, email, hours, address, each
// with an icon, a title, a sentence and a value. The designer's verdict was
// that the page was boring and the layout wrong, and the diagnosis is not
// "four cards is a dull shape" — it is that THREE OF THE FOUR ARE NOT PEERS:
//
//   · Opening hours is not a way to contact OPA. It is an ATTRIBUTE OF THE
//     PHONE LINE — the hours the line is staffed. Given its own card it reads
//     as a fourth channel you might reach somebody through.
//   · A mailing address is not support either. It is where documents go by
//     post, which is a different errand from "I need to ask something".
//   · And a page that sets a phone number and a postal address at the same
//     size has decided they matter equally, on a page people open because
//     something about their immigration filing is worrying them.
//
// So the page is now TWO CHANNELS AND A FOOTNOTE:
//
//   Call      the number at the product's large figure size, the hours folded
//             in underneath it where they belong, and whether the line is
//             staffed RIGHT NOW — the one fact nobody can work out from
//             "Monday to Friday, 9:00–18:00 ET" while standing in a queue.
//   Email     the address at figure size, for when it is not urgent.
//   By post   one quiet band under the pair. Still there, no longer
//             pretending to be a support channel.
//
// WHAT DID NOT CHANGE, on the designer's instruction: the ground, the tokens,
// the type scale, the spacing rhythm and the component vocabulary. Every size
// here is one the product already uses — `figureLg` is the loan page's
// headline figure, `microLabel` is the label above every value in the app, and
// all three of those labels start on one left rule, the page's own. The page
// stopped being an outlier by joining the system, not by inventing inside it.
//
// It also stopped being centred. Every other screen in this product sets its
// title at the left and stacks bands under it; this page alone opened with a
// centred mark and a centred h1, which is most of why it read as a different
// product. The mark is not gone — it moved into the panel whose promise it
// draws.
//
// Dumb: no fetching, no state. The only thing computed is whether the support
// line is open, from the hours already printed on the page.

import { Card, Col, Divider, Flex, Grid, Row, Typography, theme } from "antd";
import { ClockCircleOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate } from "@tanstack/react-router";
import { AppHeader } from "../../shared/ui/AppHeader";
import { SupportMark } from "../../features/LoanApplication/ui/SupportMark";
import { StatusPill } from "../../shared/ui/StatusPill";
import { HeroBackdrop } from "../../shared/ui/HeroBackdrop";
import { borrowerNav } from "../../shared/ui/navigation";
import { BorrowerInbox } from "../notifications/BorrowerInbox";
import { useUnreadCount } from "../notifications/notifications";
import { useT } from "../../shared/ui/i18n/useT";
import { useCustomerViewer } from "../../shared/ui/viewerRole";
import { getStyles, styles } from "./ContactScreen.styles";

/** WBS: the line is staffed Monday to Friday, 9:00–18:00, Eastern. */
const OPEN_HOUR = 9;
const CLOSE_HOUR = 18;
const SUPPORT_ZONE = "America/New_York";

/**
 * Is the support line staffed at this moment?
 *
 * The hours are on the page either way; this turns them into the answer the
 * reader actually wants, which they otherwise have to work out from their own
 * time zone while worried. It reads the clock and nothing else — no request,
 * no store — and it is deliberately conservative: anything it cannot
 * determine comes back closed, because telling somebody the line is open when
 * it is not is the one failure that costs them a phone call.
 */
const isSupportOpen = (now: Date): boolean => {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: SUPPORT_ZONE,
      hour: "numeric",
      hour12: false,
      weekday: "short",
    }).formatToParts(now);
    const hour = Number(parts.find((part) => part.type === "hour")?.value);
    const weekday = parts.find((part) => part.type === "weekday")?.value ?? "";
    const weekend = weekday === "Sat" || weekday === "Sun";
    return !weekend && Number.isFinite(hour) && hour >= OPEN_HOUR && hour < CLOSE_HOUR;
  } catch {
    return false;
  }
};

export type ContactScreenProps = {
  userName?: string;
  /** Injectable so a story can draw the closed state at any hour. */
  now?: Date;
};

export default function ContactScreen({ userName, now }: ContactScreenProps) {
  const navigate = useNavigate();
  // Whoever the DevBar is pointed at, unless the caller names someone.
  const viewer = useCustomerViewer();
  /** WBS Notifications: what the bell's badge counts. */
  const unreadCount = useUnreadCount(viewer.role);
  const person = userName ?? viewer.name;
  const t = useT();
  const { token } = theme.useToken();
  const s = getStyles(token);
  const screens = Grid.useBreakpoint();

  const open = isSupportOpen(now ?? new Date());

  return (
    <>
      <AppHeader
        navItems={borrowerNav}
        notifications={<BorrowerInbox />}
        notificationCount={unreadCount}
        activeKey="contact"
        userName={person}
        profileTo="/profile"
        onLogout={() => {
          console.log("log out");
          navigate({ to: "/" });
        }}
      />

      {/* The plain ground, on the designer's instruction. The wash that used
          to sit here was doing a job the page now does with hierarchy. */}
      <HeroBackdrop tone="plain" paddingBlock={0}>
        <div style={styles.page}>
          <div style={styles.column}>
            {/* NO LEDE. "However you reach us, a person answers" was the page
                reassuring the reader before telling them anything, and the two
                panels under it now say the same thing by being what they are:
                a number, and whether somebody is on the end of it. */}
            <Typography.Title level={3} style={styles.header}>
              {t("contact.title")}
            </Typography.Title>

            <Row gutter={[24, 24]} style={styles.band}>
              {/*
                CALL — the page's one figure.

                Wider than the panel beside it because it is not its peer: the
                phone is what somebody worried opens this page for, and the
                two things it needs to carry — the number and whether anyone
                is there — are both on it.
              */}
              <Col xs={24} lg={14}>
                <Card style={styles.panel} styles={{ body: styles.panelBody }}>
                  {/* CENTRED, not top-hung: the mark is 104 and the copy block is
                      about 90, so aligning their tops left the drawing
                      dangling below the sentence it sits beside. */}
                  <Flex justify="space-between" align="center" gap={24}>
                    <Flex vertical gap={4} style={styles.panelCopy}>
                      <Typography.Text style={s.label}>
                        {t("contact.callTitle")}
                      </Typography.Text>
                      {/* The number at the loan page's headline size, tabular
                          so the digits sit on their own grid. */}
                      <Typography.Text style={s.figure}>
                        {t("contact.phoneValue")}
                      </Typography.Text>
                      <Typography.Text type="secondary" style={styles.lead}>
                        {t("contact.callDesc")}
                      </Typography.Text>
                    </Flex>

                    {/* The mark the page used to open with, moved to the panel
                        whose promise it draws: a message with somebody behind
                        it. It is the only illustration on the page now, which
                        is what makes it worth having.

                        ONLY WHILE THE TWO-UP BAND IS UP. At 375px the number
                        and a 104px drawing cannot share a line at all. And
                        between there and `lg` the cards go full width, which
                        strands the mark 400px from the number it belongs to —
                        a drawing alone at the far edge of a white field. It
                        is tied to the same breakpoint as the layout, so it
                        appears exactly when there is a column shaped to hold
                        it. It is the one thing on this panel that is not
                        information; it gives way to the fact. */}
                    {screens.lg === false ? null : <SupportMark size={150} />}
                  </Flex>

                  {/* Pinned to the foot of the panel so this rule and the
                      one in the panel beside it land on the same line. */}
                  <div style={styles.footer}>
                    <Divider style={styles.rule} />

                    {/*
                      THE HOURS, FOLDED INTO THE LINE THEY DESCRIBE — with the
                      one thing they do not say out loud. "Monday to Friday,
                      9:00–18:00 ET" is a rule; "Open now" is the answer.
                    */}
                    <Flex align="center" gap={12} wrap style={styles.footRow}>
                      <StatusPill color={open ? "success" : undefined}>
                        {t(open ? "contact.openNow" : "contact.closedNow")}
                      </StatusPill>
                      <Flex align="center" gap={8}>
                        <ClockCircleOutlined style={s.rowIcon} />
                        <Typography.Text type="secondary" style={styles.rowText}>
                          {t("contact.hoursValue")}
                        </Typography.Text>
                      </Flex>
                    </Flex>
                  </div>
                </Card>
              </Col>

              {/* EMAIL — the same anatomy at the smaller step, because it is
                  the same kind of thing one rank down. */}
              <Col xs={24} lg={10}>
                <Card style={styles.panel} styles={{ body: styles.panelBody }}>
                  <Flex vertical gap={4} style={styles.panelCopy}>
                    <Typography.Text style={s.label}>
                      {t("contact.emailTitle")}
                    </Typography.Text>
                    <Typography.Text style={s.figureSm}>
                      {t("contact.emailValue")}
                    </Typography.Text>
                    <Typography.Text type="secondary" style={styles.lead}>
                      {t("contact.emailDesc")}
                    </Typography.Text>
                  </Flex>

                  <div style={styles.footer}>
                    <Divider style={styles.rule} />

                    <Flex align="center" gap={8} style={styles.footRow}>
                      <MailOutlined style={s.rowIcon} />
                      <Typography.Text type="secondary" style={styles.rowText}>
                        {t("contact.emailNote")}
                      </Typography.Text>
                    </Flex>
                  </div>
                </Card>
              </Col>
            </Row>

            {/*
              BY POST — a footnote, and drawn as one.

              It is on the page because documents do go by post, and it is one
              quiet band rather than a fourth card in the row because nobody
              opens a support page to find a street address. It is drawn with
              the panels' own anatomy at the panels' own padding, so it reads
              as the same product one rank quieter.
            */}
            <Card styles={{ body: styles.postalBody }}>
              {/*
                LABEL OVER VALUE, ON THE PAGE'S LEFT RULE.

                Same anatomy as the two panels above, and now the same x: the
                pin that used to lead this row pushed MAILING ADDRESS 22px
                right of CALL US and EMAIL US, so the page's three labels
                started at three different places and only one of them had a
                reason to. The glyph was the only thing on the page doing a
                label's job, and the word was already doing it.

                The "Where to send documents by post" line went the same way:
                under a label reading MAILING ADDRESS it was saying the label
                again.
              */}
              <Flex vertical gap={4}>
                <Typography.Text style={s.label}>
                  {t("contact.addressTitle")}
                </Typography.Text>
                <Typography.Text style={s.postalValue}>
                  {t("contact.addressValue")}
                </Typography.Text>
              </Flex>
            </Card>
          </div>
        </div>
      </HeroBackdrop>
    </>
  );
}
