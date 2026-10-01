// src/features/Notifications/ui/NotificationInbox.tsx
//
// The bell's panel, as the wireframe draws it.
//
// THE WIREFRAME'S OWN LAYOUT, 360 wide: a head with "Inbox" on the left and
// "Mark as all read" on the right, a rule under it, then rows of
// icon · title · one line · unread dot, and a shaded foot carrying the two
// channel switches. That foot is the WBS's "Manage notification preferences"
// story put where the designer put it — the same preference the profile
// carries, not a second one.
//
// WHAT EACH ROW IS. Every kind comes from one of the epic's fifteen stories
// (see types.ts); the panel only draws them. It does not decide what has been
// sent — `flows/notifications` derives that from the journey — and it does not
// decide the words, which are the dictionary's.
//
// A ROW IS A BUTTON, not a link with a dot beside it. The WBS attaches a
// destination to three of these stories by name and the rest have an obvious
// one, so the whole row is the target: a 320px row with a 24px hit area in it
// is a row that looks pressable and mostly is not.
//
// Dumb: items in, callbacks out. No fetching, no state of its own.

import { Badge, Button, Divider, Flex, Switch, Typography, theme } from "antd";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  ExclamationCircleFilled,
  InfoCircleFilled,
} from "@ant-design/icons";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { useT } from "../../../shared/ui/i18n/useT";
import type { ChannelPreferences, NotificationItem, NotificationTone } from "./types";
import { getStyles, styles } from "./NotificationInbox.styles";

export type InboxItem = NotificationItem & { unread: boolean };

export type NotificationInboxProps = {
  items: InboxItem[];
  /** Merge values for the copy — an amount, a date, a name. */
  values?: Record<string, string>;
  channels: ChannelPreferences;
  onChannelsChange?: (next: ChannelPreferences) => void;
  onOpen?: (item: InboxItem) => void;
  onMarkAllRead?: () => void;
};

export function NotificationInbox({
  items,
  values,
  channels,
  onChannelsChange,
  onOpen,
  onMarkAllRead,
}: NotificationInboxProps) {
  const t = useT();
  const { token } = theme.useToken();
  const s = getStyles(token);

  const unread = items.filter((item) => item.unread).length;

  /* The mark carries the tone, so the row says what kind of news it is before
     it is read. Filled rather than outlined: at 20px an outline reads as an
     empty circle. */
  const marks: Record<NotificationTone, { icon: typeof InfoCircleFilled; color: string }> = {
    info: { icon: InfoCircleFilled, color: token.colorPrimary },
    success: { icon: CheckCircleFilled, color: token.colorSuccess },
    warning: { icon: ExclamationCircleFilled, color: token.colorWarning },
    error: { icon: CloseCircleFilled, color: token.colorError },
  };

  return (
    <Flex vertical style={styles.panel}>
      <Flex align="center" justify="space-between" style={styles.head}>
        <Typography.Text style={s.title}>{t("notify.inbox")}</Typography.Text>
        {/* Nothing unread, nothing to mark — a link that would do nothing is
            not offered rather than disabled, because the head has room for
            exactly one thing and "you are up to date" is the list's job. */}
        {unread > 0 ? (
          <Button type="link" size="small" style={styles.markAll} onClick={onMarkAllRead}>
            {t("notify.markAllRead")}
          </Button>
        ) : null}
      </Flex>

      <Divider style={styles.rule} />

      <div style={styles.list}>
        {items.length === 0 ? (
          /* THE ONE EMPTY THAT WAS NOT IN THE FAMILY. It was a bare antd
             `Empty` with the grey tray — a third look, after the product's
             own drawings and the default "no data" glyph — on the one screen
             a borrower opens expecting to find something. It says it the
             same way every other empty in the product does now. */
          <EmptyState title={t("notify.none")} />
        ) : (
          items.map((item, index) => {
            const Mark = marks[item.tone].icon;
            return (
              <Flex vertical key={item.id}>
                {index > 0 ? <Divider style={styles.rule} /> : null}
                {/*
                  A text Button rather than a div with an onClick: it is a
                  control, and antd gives it the focus ring, the keyboard
                  behaviour and the hover the product already uses.
                */}
                <Button
                  type="text"
                  style={styles.row}
                  onClick={() => onOpen?.(item)}
                >
                  <Flex align="flex-start" gap={12} style={styles.rowInner}>
                    <Mark style={{ ...styles.mark, color: marks[item.tone].color }} />
                    <Flex vertical gap={2} style={styles.copy}>
                      <Typography.Text
                        style={item.unread ? s.titleUnread : s.rowTitle}
                        ellipsis
                      >
                        {t(item.title, { ...values, ...item.values })}
                      </Typography.Text>
                      <Typography.Text type="secondary" style={styles.body}>
                        {t(item.body, { ...values, ...item.values })}
                      </Typography.Text>
                      <Typography.Text type="secondary" style={styles.on}>
                        {item.on}
                      </Typography.Text>
                    </Flex>
                    {/* The wireframe's 8px dot: the one mark of unread. */}
                    {item.unread ? <Badge color={token.colorPrimary} style={styles.dot} /> : null}
                  </Flex>
                </Button>
              </Flex>
            );
          })
        )}
      </div>

      {/*
        WBS: "Manage notification preferences — Users shall be able to manage
        their preferred communication channels. Users may select if they want
        SMS or email notifications to be sent." The wireframe puts them here,
        at the foot, and the profile carries the same two switches — one
        preference, reachable from where it is felt and from where it is kept.

        The last one on cannot be turned off: "notification is sent within the
        notification channel selected in user's profile", so with neither there
        is nothing to send an Adverse Action letter or a default notice down.
      */}
      <Flex vertical style={s.channels}>
        <Flex align="center" justify="space-between" style={styles.channelRow}>
          <Typography.Text>{t("notify.email")}</Typography.Text>
          <Switch
            size="small"
            checked={channels.email}
            disabled={channels.email && !channels.sms}
            onChange={(email) => onChannelsChange?.({ ...channels, email })}
          />
        </Flex>
        <Flex align="center" justify="space-between" style={styles.channelRow}>
          <Typography.Text>{t("notify.sms")}</Typography.Text>
          <Switch
            size="small"
            checked={channels.sms}
            disabled={channels.sms && !channels.email}
            onChange={(sms) => onChannelsChange?.({ ...channels, sms })}
          />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default NotificationInbox;
