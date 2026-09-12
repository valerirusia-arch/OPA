// The inactivity warning that precedes an automatic sign-out.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { SessionTimeoutModal } from "./SessionTimeoutModal";

const meta = {
  title: "Auth/Session timeout",
  component: SessionTimeoutModal,
  decorators: [(Story) => <div style={{ minHeight: 420 }}><Story /></div>],
} satisfies Meta<typeof SessionTimeoutModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Warning: Story = { args: { open: true } };

/** The last few seconds, when the progress bar turns urgent. */
export const AboutToExpire: Story = { args: { open: true, graceSeconds: 8 } };
