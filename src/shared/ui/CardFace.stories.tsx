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
          OPA's card — blue, and blank
        </Typography.Text>
        <Card title="Virtual payment card">
          <CardFace
            tone="opa"
            skin="blue"
            blank
            label="OPA virtual"
            number="•••• 3094"
            facts={[{ key: "e", label: "Expires", value: "11/29" }]}
          />
        </Card>
      </Flex>

      <Flex vertical gap={12} style={{ width: SLOT }}>
        <Typography.Text type="secondary">
          OPA's card — graphite, the second finish
        </Typography.Text>
        <Card title="Virtual payment card">
          <CardFace
            tone="opa"
            skin="graphite"
            blank
            label="OPA virtual"
            number="•••• 3094"
            facts={[{ key: "e", label: "Expires", value: "11/29" }]}
          />
        </Card>
      </Flex>

      <Flex vertical gap={12} style={{ width: SLOT }}>
        <Typography.Text type="secondary">
          OPA's card — as USIO returns it, revealed
        </Typography.Text>
        <Card title="Virtual payment card">
          <CardFace
            tone="opa"
            skin="blue"
            label="OPA virtual"
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

      <Flex vertical gap={12} style={{ width: SLOT }}>
        <Typography.Text type="secondary">
          Graphite — the card the borrower brought
        </Typography.Text>
        <Card title="Saved payment card">
          <CardFace
            brand="Visa"
            label="Visa debit"
            status={{ label: "Active", color: "success" }}
            number="•••• 4417"
            facts={[{ key: "e", label: "Expires", value: "08/29" }]}
          />
        </Card>
      </Flex>

      <Flex vertical gap={12} style={{ width: SLOT }}>
        <Typography.Text type="secondary">
          Light — drawn, not in use
        </Typography.Text>
        <Card title="Saved payment card">
          <CardFace
            tone="light"
            brand="Visa"
            label="Visa debit"
            status={{ label: "Active", color: "success" }}
            number="•••• 4444"
            facts={[{ key: "e", label: "Expires", value: "09/29" }]}
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
