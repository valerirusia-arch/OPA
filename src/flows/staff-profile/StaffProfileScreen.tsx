// src/flows/staff-profile/StaffProfileScreen.tsx
//
// Epic 1 — "View profile" for Admin / Underwriter / OPA Staff.
//
// The WBS asks for exactly two things: "Admin/underwriter shall be able to see
// in their profile their name and email". So that is what the fields are. The
// role is not a field — it is stated once as a tag beside the heading, where
// it labels the account rather than pretending to be another editable detail.
//
// Everything is read-only on purpose: internal accounts are created by an Admin
// (Users management epic) and authenticated through Microsoft Entra ID, so the
// identity lives outside this application.

import { Col, Flex, Form, Row, Tag, Typography, theme } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "@tanstack/react-router";
import { AdminShell } from "../../shared/ui/AdminShell";
import { staffNavFor } from "../../shared/ui/navigation";
import { useStaffViewer } from "../../shared/ui/viewerRole";
import { useRoleLabel } from "../../features/Users/ui/roles";
import { useT } from "../../shared/ui/i18n/useT";
import { SessionTimeoutModal } from "../../features/Auth/ui/SessionTimeoutModal";
import { useIdleTimer, DEFAULT_IDLE_MS } from "../../features/Auth/ui/useIdleTimer";
import { LockedField } from "../../features/Profile/ui/LockedField";
import { ProfileLayout } from "../../features/Profile/ui/ProfileLayout";
import { getStyles, styles } from "./StaffProfileScreen.styles";

export type StaffProfileScreenProps = {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  /** WBS: the inactivity window is configurable. */
  idleMs?: number;
};

export default function StaffProfileScreen({
  firstName,
  lastName,
  email,
  role,
  idleMs = DEFAULT_IDLE_MS,
}: StaffProfileScreenProps) {
  // Whose profile this is follows the DevBar's "view as" switch, so the role
  // tag and the name in the top bar never contradict the screen you came from.
  const viewer = useStaffViewer();
  const roleLabel = useRoleLabel();
  const [defaultFirst, defaultLast] = viewer.name.split(" ");
  const first = firstName ?? defaultFirst;
  const last = lastName ?? defaultLast;
  const address =
    email ?? `${first}.${last}`.toLowerCase().replace(/\s+/g, "") + "@opa.example";
  const roleName = role ?? roleLabel(viewer.role);
  const navigate = useNavigate();
  const t = useT();
  const { token } = theme.useToken();
  const s = getStyles(token);
  const { idle, reset: staySignedIn } = useIdleTimer(idleMs);
  // Shared with the borrower profile: they are the same screen carrying
  // different content, so the layout has to be judged for both at once.

  return (
    <AdminShell
      sections={staffNavFor(viewer.role)}
      userName={viewer.name}
      profileTo="/staff/profile"
      onLogout={() => {
        console.log("log out");
        navigate({ to: "/" });
      }}
    >
      {/* The same profile the borrower gets, in whichever layout is being
          previewed — no section rail, because the WBS gives internal accounts
          one thing to look at. */}
      <ProfileLayout name={`${first} ${last}`} meta={address}>
        <>
          {/* The role belongs beside the heading, not inside a banner: it is
              a fact about this account, not news. */}
          <Flex align="center" gap={8} style={styles.titleRow}>
            <Typography.Title level={4} style={styles.sectionTitle}>
              {t("staffProfile.title")}
            </Typography.Title>
            <Tag color="blue" variant="filled">
              {roleName}
            </Tag>
          </Flex>

          <Flex gap={8} align="flex-start" style={s.note}>
            <ExclamationCircleOutlined style={s.noteIcon} />
            <Typography.Text type="secondary" style={s.description}>
              {t("staffProfile.description")}
            </Typography.Text>
          </Flex>

          <Form layout="vertical">
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <LockedField
                  label={t("field.firstName")}
                  value={first}
                  reason={t("staffProfile.lockReason")}
                />
              </Col>
              <Col xs={24} md={12}>
                <LockedField
                  label={t("field.lastName")}
                  value={last}
                  reason={t("staffProfile.lockReason")}
                />
              </Col>
              <Col xs={24} md={12}>
                <LockedField
                  label={t("field.email")}
                  value={address}
                  reason={t("staffProfile.lockReason")}
                />
              </Col>
            </Row>
          </Form>
        </>
      </ProfileLayout>


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
}
