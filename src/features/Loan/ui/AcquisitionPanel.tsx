// src/features/Loan/ui/AcquisitionPanel.tsx
//
// Where the loan came from. This is NOT a Manage Loan story — it belongs to
// **Acquisition Channels, Referrals & Campaign Management**:
//
//   "View Acquisition Information for Loans — Authorized internal users shall
//    be able to view acquisition information associated with a loan."
//   Role: Admin / Underwriter. Priority 2.
//
// It is on the loan record because that is the screen the wireframe draws it
// on, and because a loan is the thing the acquisition data is attached to.
//
// THREE FIELDS, AND THE WBS PICKED THEM. Its comment reads "the acquisition
// attributes available for display: campaign, partner, acquisition source.
// Visible for admin/underwriter." The associating story also names a PARTNER
// GROUP, and it is deliberately not here: it is used to classify and report,
// never displayed on a loan.
//
// NOT OPA STAFF. Every acquisition story names Admin and Underwriter only —
// unlike Manage Loan story 10, which adds OPA Staff with "read only". So the
// card is not rendered for them at all, rather than rendered and emptied.
//
// Dumb: it renders what it is given.

import { Flex, Typography } from "antd";
import { useT } from "../../../shared/ui/i18n/useT";
import { DetailGrid, type DetailItem } from "../../Borrowers/ui/DetailGrid";
import { styles } from "./AcquisitionPanel.styles";

export type LoanAcquisition = {
  source: string;
  referralPartner: string;
  campaign: string;
};

export type AcquisitionPanelProps = {
  /** Absent on a loan nobody tracked. A normal state, not missing data. */
  acquisition?: LoanAcquisition;
};

export function AcquisitionPanel({ acquisition }: AcquisitionPanelProps) {
  const t = useT();
  const unknown = t("acquisition.notAvailable");

  const items: DetailItem[] = [
    { key: "source", label: t("acquisition.source"), value: acquisition?.source ?? unknown },
    {
      key: "partner",
      label: t("acquisition.partner"),
      value: acquisition?.referralPartner ?? unknown,
    },
    {
      key: "campaign",
      label: t("acquisition.campaign"),
      value: acquisition?.campaign ?? unknown,
    },
  ];

  return (
    <Flex vertical>
      <DetailGrid items={items} />
      {/* The wireframe prints this line under the three empties. Without it
          "Not available" three times reads as a page that failed to load. */}
      {acquisition ? null : (
        <Typography.Text type="secondary" style={styles.note}>
          {t("acquisition.none")}
        </Typography.Text>
      )}
    </Flex>
  );
}

export default AcquisitionPanel;
