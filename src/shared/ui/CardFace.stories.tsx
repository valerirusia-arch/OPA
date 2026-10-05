// The two finishes, side by side, at the width each one is drawn at in the app.
//
// This is where the choice between them was made, and the dark one won for
// both cards. The light finish stays here rather than in the product: it is
// drawn, it works, and it is one prop away if a second kind of card ever needs
// telling apart from OPA's own.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, Flex, Typography } from "antd";
import { CardFace } from "./CardFace";

/** The column the card sits in on both pages, minus the card body's inset. */
const SLOT = 340;

function Faces() {
  return (
    <Flex gap={32} wrap style={{ padding: 24 }}>
      <Flex vertical gap={12} style={{ width: SLOT }}>
        <Typography.Text type="secondary">
          OPA's card — the front, as /loan draws it
        </Typography.Text>
        <Card title="Your OPA card">
          <CardFace
            front
            label="OPA Virtual Card"
            status={{ label: "Not used" }}
            facts={[{ key: "h", label: "Cardholder", value: "Levi Ackerman" }]}
          />
        </Card>
      </Flex>

      <Flex vertical gap={12} style={{ width: SLOT }}>
        <Typography.Text type="secondary">
          OPA's card — the thumbnail, inside the details dialog
        </Typography.Text>
        <Card title="Your OPA card">
          <CardFace
            nameplate
            label="OPA Virtual Card"
            status={{ label: "Not used" }}
            number="•••• 3094"
            facts={[{ key: "h", label: "Cardholder", value: "Levi Ackerman" }]}
          />
        </Card>
      </Flex>

      <Flex vertical gap={12} style={{ width: SLOT }}>
        <Typography.Text type="secondary">
          OPA's card — as USIO returns it, revealed
        </Typography.Text>
        <Card title="Your OPA card">
          <CardFace
            label="OPA Virtual Card"
            status={{ label: "Mock" }}
            number="4111 2233 4455 3094"
            facts={[
              { key: "h", label: "Cardholder", value: "Levi Ackerman" },
              { key: "e", label: "Expires", value: "11/29" },
              { key: "c", label: "CVV", value: "318" },
            ]}
          />
        </Card>
      </Flex>

    </Flex>
  );
}

const meta = {
  title: "Shared/Card face",
  component: Faces,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Faces>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BothFinishes: Story = {};
