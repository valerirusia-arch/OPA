// The pause before something that cannot be taken back, or that takes someone's
// access away. Same component for all three of Epic 2's confirmations.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { ConfirmModal } from "./ConfirmModal";

const meta = {
  title: "Shared/Confirm",
  component: ConfirmModal,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ConfirmModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DeleteUser: Story = {
  args: {
    open: true,
    danger: true,
    title: "Delete user?",
    body: "Delete Alex Goldbarg? This cannot be undone.",
    confirmLabel: "Delete",
  },
};

/** Reinstating access is not destructive, so it does not confirm in red. */
export const ReinstateAccess: Story = {
  args: {
    open: true,
    title: "Reinstate access for this account?",
    body: "Devon Marsh will be able to sign in again.",
    confirmLabel: "Activate",
  },
};

export const AddToDoNotLoan: Story = {
  args: {
    open: true,
    danger: true,
    title: "Add to the DO NOT LOAN list?",
    body: "Andrés Molina will be blocked from starting a new loan application. You can undo this at any time.",
    confirmLabel: "Add to DO NOT LOAN",
  },
};
