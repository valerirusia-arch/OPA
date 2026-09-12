// The pay dialog, and the four outcomes it can end on. WBS story 12 puts the
// confirmation "within the LMS", which means here, in the dialog that caused
// it — so each result is a state worth judging on its own.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { MakePaymentModal } from "./MakePaymentModal";
import { mockCurrent, mockOverdue } from "../../../flows/payments/mockPayments";

const card = mockCurrent.cards[0];

const meta = {
  title: "Manage payments/Make a payment",
  component: MakePaymentModal,
  parameters: { layout: "fullscreen" },
  args: {
    open: true,
    balance: mockCurrent.balance,
    installments: mockCurrent.schedule,
    card,
  },
} satisfies Meta<typeof MakePaymentModal>;

export default meta;
type Story = StoryObj<typeof meta>;

/** WBS story 5, opened from a schedule row: the installment leads. */
export const ScheduledPayment: Story = {
  args: { installment: mockCurrent.schedule[3] },
};

/**
 * WBS story 6, opened from the balance card while behind: everything past due
 * leads, and the installment carries its late fee.
 */
export const WhileOverdue: Story = {
  args: {
    balance: mockOverdue.balance,
    installments: mockOverdue.schedule,
    installment: mockOverdue.schedule[3],
  },
};

/** WBS story 7: nothing to charge, so the dialog says so instead of failing. */
export const NoCard: Story = { args: { card: undefined } };

export const Submitting: Story = {
  args: { installment: mockCurrent.schedule[3], submitting: true },
};

/** WBS story 12's confirmation. */
export const Succeeded: Story = {
  args: {
    attempt: { status: "succeeded", amount: "$120.65", reference: "RPY-448201" },
  },
};

/** Repay has taken it but not settled it. */
export const Pending: Story = {
  args: {
    attempt: {
      status: "pending",
      amount: "$120.65",
      reference: "RPY-448202",
      noteKey: "payments.notePending",
    },
  },
};

/** WBS story 13: a failure ends with a way forward, not an OK button. */
export const Failed: Story = {
  args: {
    attempt: {
      status: "failed",
      amount: "$120.65",
      reference: "RPY-448203",
      noteKey: "payments.noteDeclined",
    },
  },
};
