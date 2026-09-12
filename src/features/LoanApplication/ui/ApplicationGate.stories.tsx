// Every state the Application tab can be in — three from Epic 3, four from
// Loan Decisioning. Only "open" is reachable by walking the app, so this is
// where the other six are judged.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { ApplicationGate } from "./ApplicationGate";

const meta = {
  title: "Loan decisioning/Application gate",
  component: ApplicationGate,
  parameters: { layout: "centered" },
  decorators: [(Story) => <div style={{ width: 720 }}><Story /></div>],
} satisfies Meta<typeof ApplicationGate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CanStart: Story = { args: { state: "open" } };

/** WBS: "One active application per borrower is assumed." */
export const AlreadyHasOne: Story = { args: { state: "hasActive" } };

/** WBS: on the DO NOT lend list, "not allowed to create a new application". */
export const DoNotLoan: Story = { args: { state: "notEligible" } };

/** WBS "Request additional information" → the borrower's way in to story 12. */
export const InformationNeeded: Story = { args: { state: "needsInfo" } };

/** WBS credit check: "email is sent about requiring a co-borrower". */
export const CoBorrowerRequired: Story = { args: { state: "coBorrowerNeeded" } };

/** WBS: a technical failure "shall not cause the application to be rejected". */
export const CheckUnavailable: Story = { args: { state: "checkPaused" } };

/** WBS OFAC: "unable to proceed, they receive a message to call customer service". */
export const Stopped: Story = { args: { state: "stopped" } };
