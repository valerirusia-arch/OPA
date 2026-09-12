// The four outcomes of the automated identity check, per the WBS notes:
// in progress, verified, data mismatch, and a technical failure that must not
// create an account.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { IdentityStep } from "./IdentityStep";

const meta = {
  title: "Auth/Identity step",
  component: IdentityStep,
  parameters: { layout: "centered" },
  decorators: [(Story) => <div style={{ width: 460 }}><Story /></div>],
} satisfies Meta<typeof IdentityStep>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checking: Story = { args: { status: "checking" } };
export const Verified: Story = { args: { status: "verified" } };
export const Mismatch: Story = { args: { status: "mismatch" } };
export const ServiceUnavailable: Story = { args: { status: "unavailable" } };
