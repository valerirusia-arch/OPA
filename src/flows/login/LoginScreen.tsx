// src/flows/login/LoginScreen.tsx
//
// Epic 1 — "Login with email and password" (borrowers) and, on the second tab,
// the Entra ID hand-off for OPA staff.
//
// Dumb screen: local UI state only (which audience tab is open, a simulated
// submit). No fetching, no auth, no guards — Dev wires those in /app.

import { useState } from "react";
import { Flex, Segmented, Typography } from "antd";
import { TeamOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "@tanstack/react-router";
import { useT } from "../../shared/ui/i18n/useT";
import { NEXT_PARAM, useNextDestination } from "../../shared/ui/nextDestination";
import { AuthLayout } from "../../features/Auth/ui/AuthLayout";
import { LoginForm, type LoginValues } from "../../features/Auth/ui/LoginForm";
import { StaffSignIn } from "../../features/Auth/ui/StaffSignIn";
import { styles } from "./LoginScreen.styles";

type Audience = "borrower" | "staff";

export default function LoginScreen() {
  const navigate = useNavigate();
  const t = useT();
  const [audience, setAudience] = useState<Audience>("borrower");
  /** A co-borrower signing in from an invitation goes back to it, not to
   *  their profile. Everyone else lands where they always did. */
  const next = useNextDestination("/profile");

  const handleSubmit = (values: LoginValues) => {
    // Stub: Dev replaces this with the real sign-in mutation.
    console.log("sign in", values);
    navigate({ to: next });
  };

  return (
    <AuthLayout>
      <Typography.Title level={2} style={styles.heading}>
        {t("login.title")}{" "}
        {/* Decorative: the heading already greets, so screen readers skip it. */}
        <span style={styles.wave} aria-hidden>
          👋
        </span>
      </Typography.Title>
      <Typography.Text type="secondary" style={styles.subheading}>
        {t("login.subtitle")}
      </Typography.Text>

      <Segmented<Audience>
        block
        size="large"
        style={styles.segmented}
        value={audience}
        onChange={setAudience}
        // Only the active segment carries its icon — the inactive one drops it,
        // so the icon reads as "you are here" rather than decoration.
        // title="" suppresses the native tooltip antd derives from the label.
        options={[
          {
            value: "borrower",
            label: (
              <span style={audience === "borrower" ? styles.segmentActive : undefined}>
                {t("login.tabBorrower")}
              </span>
            ),
            icon: audience === "borrower" ? <UserOutlined style={styles.segmentActiveIcon} /> : undefined,
            title: "",
          },
          {
            value: "staff",
            label: (
              <span style={audience === "staff" ? styles.segmentActive : undefined}>
                {t("login.tabStaff")}
              </span>
            ),
            icon: audience === "staff" ? <TeamOutlined style={styles.segmentActiveIcon} /> : undefined,
            title: "",
          },
        ]}
      />

      <Flex vertical style={styles.panel}>
        {audience === "borrower" ? (
          <LoginForm
            onSubmit={handleSubmit}
            onForgotPassword={() => navigate({ to: "/forgot-password" })}
            onCreateAccount={() =>
              navigate({ to: "/register", search: { [NEXT_PARAM]: next } })
            }
          />
        ) : (
          <StaffSignIn
            onSignIn={() => {
              console.log("redirect to Microsoft Entra ID");
              navigate({ to: "/staff/profile" });
            }}
          />
        )}
      </Flex>
    </AuthLayout>
  );
}
