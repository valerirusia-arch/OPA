// The application journey's three drawings, which are one drawing and three
// badges. Reviewed together because that is the only way to check the claim:
// a reader moving between gate states should see the badge change and nothing
// else move.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { JourneyScene } from "./JourneyScene";

const meta = {
  title: "Loan application/Journey scene",
  component: JourneyScene,
  parameters: { layout: "centered" },
  args: { size: 200 },
} satisfies Meta<typeof JourneyScene>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Your move: start an application, invite a co-borrower, answer a request. */
export const Act: Story = { args: { variant: "act" } };

/** Settled, and nothing is owed. The one green mark in the set. */
export const Done: Story = { args: { variant: "done" } };

/** Filed, and not your move — a check in progress, a decision pending, an
 *  application that has stopped. No badge at all: there is nothing to do. */
export const Waiting: Story = { args: { variant: "waiting" } };

/** Something needs looking at: a co-borrower whose invitation is running out,
 *  or one who was reviewed and did not qualify. The amber runs through the
 *  packet's lines and the shape behind it, not just the badge — this is the
 *  one state meant to be readable across a room. */
export const Attention: Story = { args: { variant: "attention" } };
