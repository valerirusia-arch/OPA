// The co-borrower step's states, including the two the running app cannot
// reach on its own: an invitation that has expired, and one refused because
// the invited person is already at the WBS's three-sponsorship cap.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { CoBorrowerStep } from "./CoBorrowerStep";

const meta: Meta<typeof CoBorrowerStep> = {
  title: "Loan application/Co-borrower",
  component: CoBorrowerStep,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof CoBorrowerStep>;

export const Optional: Story = {};

/** Loan Decisioning decided one is needed, so the opt-in is not a choice. */
export const Required: Story = { args: { required: true } };

export const InvitationPending: Story = {
  args: {
    initialValues: { wantsCoBorrower: true },
    invitation: {
      firstName: "Daniel",
      lastName: "Okafor",
      email: "daniel.okafor@example.com",
      status: "pending",
      expiresOn: "19 Aug 2026",
    },
  },
};

export const InvitationExpired: Story = {
  args: {
    initialValues: { wantsCoBorrower: true },
    invitation: {
      firstName: "Daniel",
      lastName: "Okafor",
      email: "daniel.okafor@example.com",
      status: "expired",
      expiresOn: "19 Aug 2026",
    },
  },
};

/** WBS: "Co-borrowers can sponsor up to 3 borrowers." */
export const AtSponsorLimit: Story = {
  args: {
    initialValues: {
      wantsCoBorrower: true,
      firstName: "Daniel",
      lastName: "Okafor",
      email: "daniel.okafor@example.com",
    },
    sendError:
      "Daniel Okafor is already a co-borrower on three applications, which is the limit. Invite somebody else.",
  },
};
