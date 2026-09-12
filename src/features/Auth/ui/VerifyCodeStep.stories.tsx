// One-time code step, used during registration and again whenever a borrower
// changes their email or phone.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { VerifyCodeStep } from "./VerifyCodeStep";

const meta = {
  title: "Auth/Verify code step",
  component: VerifyCodeStep,
  parameters: { layout: "centered" },
  decorators: [(Story) => <div style={{ width: 420 }}><Story /></div>],
} satisfies Meta<typeof VerifyCodeStep>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Email: Story = {
  args: { channel: "email", target: "levi.ackerman@example.com" },
};

export const Phone: Story = {
  args: { channel: "phone", target: "(555) 051-1010" },
};

export const InvalidCode: Story = {
  args: {
    channel: "email",
    target: "levi.ackerman@example.com",
    errorMessage: "That code is invalid or has expired. Request a new one.",
  },
};

export const ResendAvailable: Story = {
  args: { channel: "phone", target: "(555) 051-1010", resendSeconds: 0 },
};
