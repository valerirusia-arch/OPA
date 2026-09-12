// src/flows/notifications/BorrowerInbox.tsx
//
// The bell's panel, connected.
//
// Nine screens carry the borrower's header and every one of them wants the
// same inbox, so the wiring lives once here rather than nine times: read the
// feed for whoever is looking, read the channels, hand both to the dumb panel,
// and turn a pressed row into navigation.
//
// It is a FLOW component, not a feature one — it reads the prototype's own
// records and it navigates, which is exactly what a flow may do and what
// `features/*/ui` may not.

import { useNavigate } from "@tanstack/react-router";
import { App } from "antd";
import { NotificationInbox } from "../../features/Notifications/ui/NotificationInbox";
import { useT } from "../../shared/ui/i18n/useT";
import { useCustomerViewer } from "../../shared/ui/viewerRole";
import {
  markAllRead,
  markRead,
  setChannels,
  useChannels,
  useNotificationValues,
  useNotifications,
} from "./notifications";

export function BorrowerInbox() {
  const navigate = useNavigate();
  const t = useT();
  const { message } = App.useApp();
  const viewer = useCustomerViewer();
  const items = useNotifications(viewer.role);
  const values = useNotificationValues();
  const channels = useChannels();

  return (
    <NotificationInbox
      items={items}
      values={values}
      channels={channels}
      onMarkAllRead={() => markAllRead(items.map((item) => item.id))}
      /* Opening one reads it — the WBS has no "mark as read" action, and a
         notification somebody has followed is not still waiting for them. */
      onOpen={(item) => {
        markRead(item.id);
        if (item.to) navigate({ to: item.to });
      }}
      onChannelsChange={(next) => {
        setChannels(next);
        console.log("update notification channels", next);
        message.success(t("notify.channelSaved"));
      }}
    />
  );
}

export default BorrowerInbox;
