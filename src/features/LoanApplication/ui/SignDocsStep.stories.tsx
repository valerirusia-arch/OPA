// WBS story 1: the package is generated from the applicant's STATE and their
// ROLE, and different packages go to borrowers and co-borrowers. Side by side
// is the only way to see that the rule is actually doing something.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { SignDocsStep } from "./SignDocsStep";

const meta = {
  title: "Loan application/Sign documents",
  component: SignDocsStep,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 660 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SignDocsStep>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Texas adds a state disclosure; the borrower gets the credit-score one. */
export const BorrowerInTexas: Story = { args: { state: "TX", role: "borrower" } };

/** Illinois adds none, and a co-borrower signs an acknowledgement instead. */
export const CoBorrowerInIllinois: Story = {
  args: { state: "IL", role: "coBorrower" },
};

/** New York's own disclosure, and the co-borrower package again. */
export const CoBorrowerInNewYork: Story = {
  args: { state: "NY", role: "coBorrower" },
};

/** After DocuSign hands the envelope back. */
export const Signed: Story = {
  args: { state: "CA", role: "borrower", signedOn: "06 Sep 2026" },
};
