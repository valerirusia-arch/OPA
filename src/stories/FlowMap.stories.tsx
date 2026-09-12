// src/stories/FlowMap.stories.tsx
//
// The Flow Map the DevBar links to. The story ID is load-bearing:
//   title "System/Flow Map" + export `AllFlows` -> system-flow-map--all-flows
// which is exactly the URL in src/flows/_devbar/DevBar.tsx. Rename either side
// and the DevBar's "Flow map" button 404s.
//
// Reads the designer's route tree and renders every screen, grouped by flow,
// filterable by role, with a click-through into the running app. Pure data —
// no fetching, no state, no guards.

import { useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Alert, Button, Card, Collapse, Empty, Flex, Segmented, Space, Table, Tag,
  Tooltip, Typography, theme,
} from "antd";
import { ExportOutlined, NodeIndexOutlined } from "@ant-design/icons";
import {
  flattenRoutes, groupByFlow, resolvePath, type FlatRoute,
} from "../flows/_devbar/flatten";

// Where `npm run dev` serves the app. NOT vite's default 5173: another OPA
// prototype holds that port on this machine, so vite.config.ts pins 5183.
// Every "open in app" link here goes through this constant.
const APP_URL = "http://localhost:5183";

function FlowMap() {
  const { token } = theme.useToken();
  const [role, setRole] = useState<string>("all");

  const all = useMemo(() => flattenRoutes(), []);
  const roles = useMemo(
    () => ["all", ...Array.from(new Set(all.map((r) => r.role)))],
    [all]
  );

  const visible = role === "all" ? all : all.filter((r) => r.role === role);
  const groups = groupByFlow(visible);

  const columns = [
    {
      title: "Screen",
      dataIndex: "label",
      key: "label",
      render: (label: string) => <Typography.Text strong>{label}</Typography.Text>,
    },
    {
      title: "Path",
      dataIndex: "path",
      key: "path",
      render: (path: string) => (
        <Typography.Text code style={{ fontFamily: token.fontFamilyCode }}>
          {path}
        </Typography.Text>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (r: string) => (
        <Tag color={r === "unassigned" ? "default" : "blue"}>{r}</Tag>
      ),
    },
    {
      title: "",
      key: "open",
      width: 120,
      render: (_: unknown, row: FlatRoute) => (
        <Tooltip title={`Open ${resolvePath(row.path, row.samples)} in the running app`}>
          <Button
            size="small"
            icon={<ExportOutlined />}
            href={`${APP_URL}${resolvePath(row.path, row.samples)}`}
            target="_blank"
          >
            Open
          </Button>
        </Tooltip>
      ),
    },
  ];

  return (
    <Flex vertical gap={16} style={{ padding: 24 }}>
      <Space align="center">
        <NodeIndexOutlined style={{ color: token.colorPrimary }} />
        <Typography.Title level={3} style={{ margin: 0 }}>
          Flow map
        </Typography.Title>
        <Tag>{all.length} screens</Tag>
      </Space>

      <Typography.Text type="secondary">
        Every screen declared in <Typography.Text code>src/flows/routes.tsx</Typography.Text>,
        grouped by flow. Roles here are design annotation — labels for navigating
        the prototype, not access control.
      </Typography.Text>

      {all.length === 0 ? (
        <Card>
          <Empty description="No flows yet. Add an entry to src/flows/routes.tsx and this fills in automatically." />
        </Card>
      ) : (
        <>
          <Space>
            <Typography.Text type="secondary">Role:</Typography.Text>
            <Segmented
              value={role}
              onChange={(v) => setRole(String(v))}
              options={roles.map((r) => ({ label: r, value: r }))}
            />
          </Space>

          <Alert
            type="info"
            showIcon
            title={`"Open" links assume the app is running at ${APP_URL}.`}
          />

          <Collapse
            defaultActiveKey={groups.map(([flow]) => flow)}
            items={groups.map(([flow, items]) => ({
              key: flow,
              label: (
                <Space>
                  <Typography.Text strong>{flow}</Typography.Text>
                  <Tag>{items.length}</Tag>
                </Space>
              ),
              children: (
                <Table
                  size="small"
                  pagination={false}
                  rowKey="path"
                  dataSource={items}
                  columns={columns}
                />
              ),
            }))}
          />
        </>
      )}
    </Flex>
  );
}

const meta: Meta<typeof FlowMap> = {
  title: "System/Flow Map",
  component: FlowMap,
  parameters: { layout: "fullscreen" },
};

export default meta;

// Export name is load-bearing — see the header comment.
export const AllFlows: StoryObj<typeof FlowMap> = {};
