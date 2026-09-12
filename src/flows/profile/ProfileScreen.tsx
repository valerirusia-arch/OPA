// src/flows/profile/ProfileScreen.tsx
//
// Epic 1 — "View profile" (P1) and "Update profile" / "Change password" (P2)
// for borrowers and co-borrowers.
//
// WBS rules made visible here:
// - Identity fields (name, DoB, SSN, country) are locked; changing them needs
//   OPA staff, not self-service.
// - Only approved borrowers may edit contact details — `canEditContact`.
// - Changing email or phone re-triggers verification before it is saved.
//
// Dumb screen: mock data lives in the default props, local state covers the
// modals and the dirty-field check. Nothing is fetched or persisted.

import { useState } from "react";
import {
  Alert,
  App,
  Button,
  Col,
  Divider,
  Flex,
  Form,
  Input,
  Row,
  Select,
  Switch,
  Typography,
  theme,
} from "antd";
import {
  EditOutlined,
  ExclamationCircleOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "@tanstack/react-router";
import { AppHeader } from "../../shared/ui/AppHeader";
import { ProfileLayout } from "../../features/Profile/ui/ProfileLayout";
import { borrowerNav } from "../../shared/ui/navigation";
import { BorrowerInbox } from "../notifications/BorrowerInbox";
import { setChannels, useChannels } from "../notifications/notifications";
import type { ChannelPreferences } from "../../features/Notifications/ui/types";
import { useUnreadCount } from "../notifications/notifications";
import { useT } from "../../shared/ui/i18n/useT";
import { stateOptions } from "../../features/Auth/ui/options";
import { formatUsPhone, digitsOnly } from "../../features/Auth/ui/masks";
import { useAuthRules } from "../../features/Auth/ui/validation";
import { SessionTimeoutModal } from "../../features/Auth/ui/SessionTimeoutModal";
import {
  useIdleTimer,
  DEFAULT_IDLE_MS,
} from "../../features/Auth/ui/useIdleTimer";
import { ChangePasswordModal } from "../../features/Profile/ui/ChangePasswordModal";
import { LockedField } from "../../features/Profile/ui/LockedField";
import { VerifiedLabel } from "../../features/Profile/ui/VerifiedLabel";
import { VerifyContactModal } from "../../features/Profile/ui/VerifyContactModal";
import { getStyles as getButtonStates } from "../../shared/ui/buttonStates.styles";
import { getStyles, styles } from "./ProfileScreen.styles";

export type ContactValues = {
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
};

/**
 * How OPA reaches this user.
 *
 * It was read-only here, on the reading that Epic 1's "Update profile" lists
 * only email, phone and mailing address. That reading was too narrow: the
 * **Notifications & Communications** epic has its own story — "Manage
 * notification preferences: Users shall be able to manage their preferred
 * communication channels" — whose role is `User`, i.e. everybody, not only an
 * approved borrower. So the channel is editable, and it is editable even where
 * the contact form is not.
 */
export type ProfilePreferences = ChannelPreferences;

export type ProfileScreenProps = {
  fullName?: string;
  identity?: {
    firstName: string;
    middleName?: string;
    lastName: string;
    dateOfBirth: string;
    ssn: string;
    country: string;
  };
  contact?: ContactValues;
  preferences?: ProfilePreferences;
  /** WBS: only approved borrowers and co-borrowers can edit contact details. */
  canEditContact?: boolean;
  /** WBS: the inactivity window is configurable. */
  idleMs?: number;
  /** Whether the contact details on file have been confirmed. */
  emailVerified?: boolean;
  phoneVerified?: boolean;
};

const mockIdentity = {
  firstName: "Levi",
  middleName: "Ren",
  lastName: "Ackerman",
  dateOfBirth: "02/26/1994",
  ssn: "•••-••-2602",
  country: "Mexico",
};

const mockPreferences: ProfilePreferences = { email: true, sms: false };

const mockContact: ContactValues = {
  email: "leviackerman@example.com",
  phone: "(555) 051-1010",
  street: "1200 Avenida Del Sol",
  city: "El Paso",
  state: "TX",
  zip: "88061",
};

export default function ProfileScreen({
  fullName = "Levi Ackerman",
  identity = mockIdentity,
  contact = mockContact,
  preferences = mockPreferences,
  canEditContact = true,
  idleMs = DEFAULT_IDLE_MS,
  emailVerified = true,
  phoneVerified = true,
}: ProfileScreenProps) {
  const { message } = App.useApp();
  const navigate = useNavigate();
  /** WBS Notifications: what the bell's badge counts. */
  const unreadCount = useUnreadCount("borrower");
  const t = useT();
  const rules = useAuthRules();
  const { idle, reset: staySignedIn } = useIdleTimer(idleMs);
  const [form] = Form.useForm<ContactValues>();
  const { token } = theme.useToken();
  const buttons = getButtonStates(token);
  const s = getStyles(token);

  /**
   * Three unrelated subjects — who you are, how OPA reaches you, your password
   * — so three sections rather than one long page. See ProfileLayout.
   */
  const [section, setSection] = useState("personal");

  /** Shared with the staff profile, so the two never drift apart. */

  /**
   * Nothing to save until something is different. Comparing against the values
   * on file rather than antd's "touched" flag means typing a change and then
   * undoing it puts the buttons back to sleep, which is what the reader means
   * by "I have not changed anything".
   */
  /**
   * The notification channel, kept out of the contact form on purpose.
   *
   * The contact form is disabled for a borrower who is not approved yet
   * (Epic 1's own restriction), and antd's `disabled` cascades to every field
   * inside it. The Notifications epic gives the channel to every user, so it
   * cannot live in there. A preference also does not need a Save button
   * beside two others: it applies when it is changed.
   */
  /* The shared preference, so the inbox's own switches and these are one
     control in two places. The prop seeds nothing — it is the default the
     module already holds — and stays for Storybook. */
  void preferences;
  const channels = useChannels();
  const saveChannels = (next: ChannelPreferences) => {
    setChannels(next);
    console.log("update notification channels", next);
    message.success(t("notify.channelSaved"));
  };

  const edited = Form.useWatch([], form);
  const dirty = edited
    ? (Object.keys(contact) as (keyof ContactValues)[]).some(
        (field) => edited[field] !== contact[field],
      )
    : false;

  const [changingPassword, setChangingPassword] = useState(false);
  const [pending, setPending] = useState<ContactValues | null>(null);
  const [verifying, setVerifying] = useState<"email" | "phone" | null>(null);

  /** WBS: email and phone changes must be re-verified before they take effect. */
  const startSave = (values: ContactValues) => {
    const emailChanged = values.email !== contact.email;
    const phoneChanged = values.phone !== contact.phone;

    if (emailChanged || phoneChanged) {
      setPending(values);
      setVerifying(emailChanged ? "email" : "phone");
      return;
    }

    console.log("save contact information", values);
    message.success(t("profile.updated"));
  };

  /** Both changed? Verify the email, then the phone, then save once. */
  const finishVerification = () => {
    const values = pending;
    if (verifying === "email" && values && values.phone !== contact.phone) {
      setVerifying("phone");
      return;
    }
    setVerifying(null);
    setPending(null);
    console.log("save contact information", values);
    message.success(t("profile.updated"));
  };

  return (
    <Flex vertical style={styles.page}>
      <AppHeader
        navItems={borrowerNav}
        notifications={<BorrowerInbox />}
        notificationCount={unreadCount}
        userName={fullName}
        profileTo="/profile"
        onLogout={() => {
          console.log("log out");
          navigate({ to: "/" });
        }}
      />

      {/* The banner and the avatar are the page's header, so the rail brings
          no second title. It runs on the full grid rather than the single
          column the banner uses elsewhere — otherwise the form pays for the
          rail beside it. */}
      <ProfileLayout
        name={fullName}
        meta={`${contact.email} \u00b7 ${contact.city}, ${contact.state}`}
        activeKey={section}
        onSectionChange={setSection}
        sections={[
          {
            key: "personal",
            label: t("profile.navPersonal"),
            icon: <UserOutlined />,
          },
          { key: "contact", label: t("profile.navContact"), icon: <MailOutlined /> },
          { key: "password", label: t("profile.navPassword"), icon: <LockOutlined /> },
        ]}
      >
        {section === "personal" ? (
          <>
            <>
              <Typography.Title level={4} style={styles.sectionTitle}>
                {t("profile.navPersonal")}
              </Typography.Title>
              {/* The locks on the fields ask the question; this answers it
                  once, instead of leaving it to a tooltip nobody hovers. */}
              <Flex gap={8} align="flex-start" style={styles.note}>
                <ExclamationCircleOutlined style={styles.noteIcon} />
                <Typography.Text type="secondary" style={styles.noteText}>
                  {t("profile.lockReason")}
                </Typography.Text>
              </Flex>

              <Form layout="vertical">
                {/* Same three-across name row as registration, so the profile
                    reads as the form you filled in, not a different list. */}
                <Row gutter={16}>
                  <Col xs={24} md={8}>
                    <LockedField
                      label={t("field.firstName")}
                      value={identity.firstName}
                    />
                  </Col>
                  <Col xs={24} md={8}>
                    <LockedField
                      label={t("field.middleName")}
                      value={identity.middleName ?? "\u2014"}
                    />
                  </Col>
                  <Col xs={24} md={8}>
                    <LockedField
                      label={t("field.lastName")}
                      value={identity.lastName}
                    />
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <LockedField
                      label={t("field.dateOfBirth")}
                      value={identity.dateOfBirth}
                    />
                  </Col>
                  <Col xs={24} md={12}>
                    <LockedField label={t("field.ssn")} value={identity.ssn} />
                  </Col>
                </Row>

                <Form.Item style={styles.noMargin}>
                  <LockedField
                    label={t("field.country")}
                    value={identity.country}
                  />
                </Form.Item>
              </Form>
            </>
          </>
        ) : null}

        {section === "contact" ? (
          <>
            <Typography.Title level={4} style={styles.sectionTitle}>
              {t("profile.navContact")}
            </Typography.Title>

            {!canEditContact && (
              <Alert
                type="info"
                showIcon
                style={styles.alert}
                title={t("profile.readOnlyTitle")}
                description={t("profile.readOnlyDescription")}
              />
            )}

            <Form
              form={form}
              layout="vertical"
              // Both triggers are offered; each RULE picks the one it needs.
              // "Required" listens for changes, so an error clears the moment
              // the field is filled. Format rules listen for blur, so half a
              // typed email is never flagged mid-word. See useAuthRules.
              validateTrigger={["onBlur", "onChange"]}
              initialValues={contact}
              disabled={!canEditContact}
              onFinish={startSave}
            >
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <VerifiedLabel
                        label={t("field.email")}
                        verified={emailVerified}
                        required
                      />
                    }
                    required={false}
                    name="email"
                    rules={rules.email}
                  >
                    <Input autoComplete="email" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <VerifiedLabel
                        label={t("field.phone")}
                        verified={phoneVerified}
                        required
                      />
                    }
                    required={false}
                    name="phone"
                    rules={rules.phone}
                    normalize={(value: string) => formatUsPhone(value)}
                  >
                    <Input inputMode="tel" autoComplete="tel" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label={t("field.street")}
                name="street"
                rules={[rules.required()]}
              >
                <Input autoComplete="street-address" />
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item
                    label={t("field.city")}
                    name="city"
                    rules={[rules.required()]}
                  >
                    <Input autoComplete="address-level2" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label={t("field.state")}
                    name="state"
                    rules={[rules.required()]}
                  >
                    <Select
                      showSearch
                      optionFilterProp="label"
                      options={stateOptions}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label={t("field.zip")}
                    name="zip"
                    rules={rules.zip}
                    normalize={(value: string) => digitsOnly(value, 5)}
                  >
                    <Input inputMode="numeric" autoComplete="postal-code" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item style={styles.noMargin}>
                <Flex gap={12} justify="flex-end" style={styles.actions}>
                  <Button disabled={!dirty} onClick={() => form.resetFields()}>
                    {t("common.cancel")}
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={!dirty}
                    style={dirty ? undefined : buttons.idlePrimary}
                  >
                    {t("profile.save")}
                  </Button>
                </Flex>
              </Form.Item>
            </Form>

            {/*
              NOT EPIC 1. "Manage notification preferences — Users shall be
              able to manage their preferred communication channels" is a story
              in Notifications & Communications, and its role is `User`: it is
              not restricted to an approved borrower the way the contact form
              above is. Outside that form for exactly that reason, and it saves
              on change, because a preference with a Save button beside two
              other Save buttons is three things to press for one screen.
            */}
            <Divider />
            <Flex vertical gap={8} style={styles.preference}>
              <Typography.Text style={s.preferenceLabel}>
                {t("profile.navNotifications")}
              </Typography.Text>
              <Typography.Text type="secondary">
                {t("notify.channelHint")}
              </Typography.Text>
              {/*
                TWO SWITCHES, NOT A CHOICE OF ONE.

                It was a Select — Email or SMS — which was a placeholder for
                this epic and read the WBS's "SMS/Email" as either/or. The
                story itself is looser and the wireframe settles it: "Users may
                select if they want SMS or email notifications to be sent", two
                independent switches at the foot of the inbox. Same preference
                in both places, so it is the same control in both.

                The last one on cannot be turned off: "notification is sent
                within the notification channel selected in user's profile",
                and with neither there is nothing to send a decline or a
                default notice down.
              */}
              <Flex vertical gap={8} style={styles.channels}>
                <Flex align="center" justify="space-between">
                  <Typography.Text>{t("notify.email")}</Typography.Text>
                  <Switch
                    checked={channels.email}
                    disabled={channels.email && !channels.sms}
                    onChange={(email) => saveChannels({ ...channels, email })}
                  />
                </Flex>
                <Flex align="center" justify="space-between">
                  <Typography.Text>{t("notify.sms")}</Typography.Text>
                  <Switch
                    checked={channels.sms}
                    disabled={channels.sms && !channels.email}
                    onChange={(sms) => saveChannels({ ...channels, sms })}
                  />
                </Flex>
              </Flex>
            </Flex>
          </>
        ) : null}

        {section === "password" ? (
          <>
            <Typography.Title level={4} style={styles.sectionTitle}>
              {t("profile.navPassword")}
            </Typography.Title>
            <Typography.Text type="secondary" style={styles.sectionSubtitle}>
              {t("profile.passwordSubtitle")}
            </Typography.Text>
            <Flex gap={8}>
              <Input value={"\u2022".repeat(10)} readOnly />
              <Button
                icon={<EditOutlined />}
                onClick={() => setChangingPassword(true)}
              >
                {t("profile.change")}
              </Button>
            </Flex>
          </>
        ) : null}
      </ProfileLayout>


      <ChangePasswordModal
        open={changingPassword}
        onCancel={() => setChangingPassword(false)}
        onSubmit={(values) => {
          console.log("change password", values);
          setChangingPassword(false);
          message.success(t("profile.passwordUpdated"));
        }}
      />

      <SessionTimeoutModal
        open={idle}
        onStaySignedIn={staySignedIn}
        onSignOut={() => {
          console.log("session ended after inactivity");
          navigate({ to: "/" });
        }}
      />

      <VerifyContactModal
        open={verifying !== null}
        channel={verifying ?? "email"}
        target={(verifying === "phone" ? pending?.phone : pending?.email) ?? ""}
        onCancel={() => {
          setVerifying(null);
          setPending(null);
        }}
        onVerified={finishVerification}
      />
    </Flex>
  );
}
