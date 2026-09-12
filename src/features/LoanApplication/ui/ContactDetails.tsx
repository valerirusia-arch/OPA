// src/features/LoanApplication/ui/ContactDetails.tsx
//
// WBS story 8 — "a static page with support contacts details (INFORMATION
// ONLY, no interactive elements)". So the phone number is not a tel: link, the
// email is not a mailto: and the address is not a map. It is read, not clicked.
//
// This is the SECONDARY copy of those details: the confirmation screen carries
// them under "if you need us", below the thing the borrower actually came to
// see. The Contact page gives them the room they deserve; here they are a
// footnote, and a footnote drawn as tall icon rows with rules between them is
// a second subject competing with the confirmation above it.
//
// So: a plain two-column list of label and value. No icons — four of them in a
// column, each floating between its own two lines, read as decoration rather
// than as a guide to anything. No rules — four short facts do not need to be
// told apart.
//
// Dumb: it renders four strings.

import { Col, Row, Typography, theme } from "antd";
import { useT } from "../../../shared/ui/i18n/useT";
import { getStyles, styles } from "./ContactDetails.styles";

export function ContactDetails() {
  const t = useT();
  const { token } = theme.useToken();
  const s = getStyles(token);

  const items = [
    { key: "phone", label: t("contact.phone"), value: t("contact.phoneValue") },
    { key: "email", label: t("contact.email"), value: t("contact.emailValue") },
    { key: "hours", label: t("contact.hours"), value: t("contact.hoursValue") },
    { key: "address", label: t("contact.address"), value: t("contact.addressValue") },
  ];

  return (
    <Row gutter={[24, 20]}>
      {items.map((item) => (
        <Col key={item.key} xs={24} sm={12}>
          <Typography.Text style={s.label}>{item.label}</Typography.Text>
          <Typography.Text style={styles.value}>{item.value}</Typography.Text>
        </Col>
      ))}
    </Row>
  );
}

export default ContactDetails;
