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

/** Settled, or decided in the reader's favour. The one green mark in the set,
 *  and it means FINISHED — which is why the state below cannot borrow it. */
export const Done: Story = { args: { variant: "done" } };

/** With OPA and being read. Time passing, not a decision made. */
export const Review: Story = { args: { variant: "review" } };

/** Filed, and not your move — a check in progress, a decision pending, an
 *  application that has stopped. No badge at all: there is nothing to do. */
export const Waiting: Story = { args: { variant: "waiting" } };

/** Something needs looking at: a co-borrower whose invitation is running out,
 *  or one who was reviewed and did not qualify. The amber runs through the
 *  packet's lines and the shape behind it, not just the badge — this is the
 *  one state meant to be readable across a room. */
export const Attention: Story = { args: { variant: "attention" } };

/* The last three draw a person's record rather than the loan's packet,
   because they are states about a person. */

/** Somebody has asked you to join their application. Their record, with an
 *  envelope — a "+" here would read as "add this person", which is backwards. */
export const Invite: Story = { args: { variant: "invite" } };

/** And that invitation once it is over: the same record without the envelope.
 *  The absence is the state. */
export const Closed: Story = { args: { variant: "closed" } };

/** Waiting on somebody else — an invited co-borrower whose part is not in.
 *  No badge: nothing has happened to them yet, and a mark would say it had. */
export const Person: Story = { args: { variant: "person" } };

/** Reviewed, and did not pass. The cross says what the exclamation mark was
 *  too mild for; the amber says it is still a detour. */
export const Failed: Story = { args: { variant: "failed" } };
