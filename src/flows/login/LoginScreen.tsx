// src/flows/login/LoginScreen.tsx
//
// Epic 1 — "Login with email and password" (borrowers) and, on the second tab,
// the Entra ID hand-off for OPA staff.
//
// Dumb screen: local UI state only (which audience tab is open, a simulated
// submit). No fetching, no auth, no guards — Dev wires those in /app.

import { useState } from "react";
import { Flex, Typography } from "antd";
import { TeamOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "@tanstack/react-router";
import { useT } from "../../shared/ui/i18n/useT";
import { NEXT_PARAM, useNextDestination } from "../../shared/ui/nextDestination";
import { AuthLayout } from "../../features/Auth/ui/AuthLayout";
import { AudienceToggle } from "../../features/Auth/ui/AudienceToggle";
import { LoginForm, type LoginValues } from "../../features/Auth/ui/LoginForm";
import { StaffSignIn } from "../../features/Auth/ui/StaffSignIn";
import { styles } from "./LoginScreen.styles";

type Audience = "borrower" | "staff";

export default function LoginScreen() {
  const navigate = useNavigate();
  const t = useT();
  const [audience, setAudience] = useState<Audience>("borrower");
  /** A co-borrower signing in from an invitation goes back to it. Everyone
   *  else lands on the DASHBOARD — *"დეფაულტად დეშბორდზე უნდა ვიყო და არა
   *  პროფილზე."* It was /profile, which is a form for editing details the
   *  borrower did not sign in to edit; the dashboard is the page that says
   *  where the money and the application are, and it has a designed empty
   *  state for the borrower who has neither yet. */
  const next = useNextDestination("/dashboard");

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

      <div style={styles.toggleWrap}>
        <AudienceToggle<Audience>
          value={audience}
          onChange={setAudience}
          options={[
            { value: "borrower", label: t("login.tabBorrower"), icon: <UserOutlined /> },
            { value: "staff", label: t("login.tabStaff"), icon: <TeamOutlined /> },
          ]}
        />
      </div>

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
