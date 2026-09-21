// src/stories/ThemeShowcase.stories.tsx
//
// The COMPLETE kitchen sink: one instance of (nearly) every antd component,
// grouped by antd's own categories. Because antd is themed from ConfigProvider
// tokens, this page is where a designer verifies that a token change (primary
// color, radius, spacing, font) landed EVERYWHERE. Change /src/theme/tokens.ts,
// reload this story, scan top to bottom.
//
// Targets Ant Design v6 (current line; v6 is API-compatible with v5, so this
// also renders on recent v5). Requires the ThemeProvider decorator in
// .storybook/preview (see SETUP.md) so this reflects the real theme.
// The few overlay components (Modal, Drawer, Message, Notification, Popconfirm,
// Tour, FloatButton) are shown via trigger buttons — click to theme-check them.

import { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Alert, Anchor, App, AutoComplete, Avatar, Badge, Breadcrumb, Button,
  Calendar, Card, Carousel, Cascader, Checkbox, Collapse, ColorPicker,
  DatePicker, Descriptions, Divider, Drawer, Dropdown, Empty, Flex, FloatButton,
  Form, Image, Input, InputNumber, Mentions, Menu, Pagination, Popconfirm,
  Popover, Progress, QRCode, Radio, Rate, Result, Segmented, Select, Skeleton,
  Slider, Space, Spin, Statistic, Steps, Switch, Table, Tabs, Tag, TimePicker,
  Timeline, Tooltip, Tour, Transfer, Tree, TreeSelect, Typography, Upload,
  Watermark, theme,
} from "antd";
import {
  AppstoreOutlined, CommentOutlined, CustomerServiceOutlined, HomeOutlined,
  MailOutlined, SettingOutlined, StarOutlined, UploadOutlined, UserOutlined,
} from "@ant-design/icons";
import { PasswordField } from "../features/Auth/ui/PasswordField";

const { Title, Text, Link, Paragraph } = Typography;
const { RangePicker } = DatePicker;

// ---- shared demo data (mock only; nothing here calls a network) ----
const selectOptions = [
  { value: "1", label: "Option one" },
  { value: "2", label: "Option two" },
  { value: "3", label: "Option three" },
];
const cascaderOptions = [
  { value: "ua", label: "Ukraine", children: [{ value: "kyiv", label: "Kyiv" }] },
  { value: "pl", label: "Poland", children: [{ value: "waw", label: "Warsaw" }] },
];
const treeData = [
  {
    title: "Parent",
    key: "0",
    value: "0",
    children: [
      { title: "Child A", key: "0-0", value: "0-0" },
      { title: "Child B", key: "0-1", value: "0-1" },
    ],
  },
];
const transferData = Array.from({ length: 6 }, (_, i) => ({ key: String(i), title: `Item ${i + 1}` }));
const tinyImg =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='80'%3E%3Crect width='120' height='80' fill='%23bfbfbf'/%3E%3C/svg%3E";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <Divider titlePlacement="start"><Text strong>{title}</Text></Divider>
      <Space wrap size="large" align="start">{children}</Space>
    </div>
  );
}

function ShowcaseInner() {
  const { token } = theme.useToken();
  const { message, notification, modal } = App.useApp();
  const [drawer, setDrawer] = useState(false);
  const [tour, setTour] = useState(false);
  const tourAnchor = useRef<HTMLButtonElement>(null);
  const [target, setTarget] = useState<string[]>(["1"]);

  return (
    <Flex vertical gap={16} style={{ maxWidth: 960, margin: "0 auto", padding: 24 }}>
      <div id="top">
        <Title level={3}>Theme showcase — all components</Title>
        <Paragraph type="secondary">
          Themed from <Text code>src/theme/tokens.ts</Text>. Change a token, reload, scan for anything that didn't update.
        </Paragraph>
      </div>

      <Section title="General — Button, Typography">
        <Button type="primary">Primary</Button>
        <Button>Default</Button>
        <Button type="dashed">Dashed</Button>
        <Button type="link">Link</Button>
        <Button type="text">Text</Button>
        <Button type="primary" danger>Danger</Button>
        <Button type="primary" loading>Loading</Button>
        <Button type="primary" disabled>Disabled</Button>
        <Text type="success">success</Text>
        <Text type="warning">warning</Text>
        <Text type="danger">danger</Text>
        <Link href="#top">link</Link>
      </Section>

      <Section title="Layout — Grid, Divider">
        <div style={{ width: "100%" }}>
          <Flex gap={8}>
            {[1, 2, 3].map((n) => (
              <Card key={n} size="small" style={{ flex: 1, textAlign: "center" }}>col {n}</Card>
            ))}
          </Flex>
        </div>
      </Section>

      <Section title="Navigation — Breadcrumb, Menu, Dropdown, Steps, Tabs, Pagination, Anchor">
        <Breadcrumb items={[{ title: <HomeOutlined /> }, { title: "Section" }, { title: "Page" }]} />
        <Menu
          mode="horizontal"
          selectedKeys={["a"]}
          items={[
            { key: "a", icon: <MailOutlined />, label: "Nav one" },
            { key: "b", icon: <AppstoreOutlined />, label: "Nav two" },
            { key: "c", icon: <SettingOutlined />, label: "Nav three" },
          ]}
        />
        <Dropdown menu={{ items: [{ key: "1", label: "Action one" }, { key: "2", label: "Action two" }] }}>
          <Button>Dropdown</Button>
        </Dropdown>
        <div style={{ width: 320 }}>
          <Steps size="small" current={1} items={[{ title: "Start" }, { title: "Doing" }, { title: "Done" }]} />
        </div>
        <div style={{ width: 320 }}>
          <Tabs defaultActiveKey="1" items={[{ key: "1", label: "Tab one", children: "One" }, { key: "2", label: "Tab two", children: "Two" }]} />
        </div>
        <Pagination defaultCurrent={1} total={50} size="small" />
        <Anchor
          affix={false}
          items={[{ key: "top", href: "#top", title: "Back to top" }]}
        />
      </Section>

      <Section title="Data Entry — Inputs, Number, Select, AutoComplete, Cascader, TreeSelect, Mentions">
        <Input placeholder="Input" style={{ width: 200 }} />
        <PasswordField placeholder="Password" style={{ width: 200 }} />
        <Input.Search placeholder="Search" enterButton style={{ width: 220 }} />
        <Input.TextArea placeholder="Textarea" style={{ width: 220 }} rows={2} />
        <InputNumber defaultValue={10} />
        <Select style={{ width: 200 }} placeholder="Select" options={selectOptions} />
        <AutoComplete style={{ width: 200 }} placeholder="AutoComplete" options={selectOptions} />
        <Cascader style={{ width: 200 }} placeholder="Cascader" options={cascaderOptions} />
        <TreeSelect style={{ width: 200 }} placeholder="TreeSelect" treeData={treeData} />
        <Mentions style={{ width: 220 }} placeholder="Type @ to mention" options={[{ value: "denys", label: "denys" }]} />
      </Section>

      <Section title="Data Entry — Pickers, Selection controls">
        <DatePicker />
        <RangePicker />
        <TimePicker />
        <Checkbox defaultChecked>Checkbox</Checkbox>
        <Radio.Group defaultValue="a">
          <Radio.Button value="a">Left</Radio.Button>
          <Radio.Button value="b">Right</Radio.Button>
        </Radio.Group>
        <Switch defaultChecked />
        <Rate defaultValue={3} character={<StarOutlined />} />
        <ColorPicker defaultValue={token.colorPrimary} />
        <div style={{ width: 200 }}><Slider defaultValue={40} /></div>
        <Segmented options={["Daily", "Weekly", "Monthly"]} />
      </Section>

      <Section title="Data Entry — Form, Upload, Transfer">
        <Form layout="vertical" style={{ width: 260 }} requiredMark>
          <Form.Item label="Name" required><Input placeholder="Jane Doe" /></Form.Item>
          <Form.Item label="Email" validateStatus="error" help="Looks invalid">
            <Input placeholder="jane@x" />
          </Form.Item>
          <Button type="primary">Submit</Button>
        </Form>
        <Upload beforeUpload={() => false}><Button icon={<UploadOutlined />}>Upload</Button></Upload>
        <Transfer
          dataSource={transferData}
          targetKeys={target}
          onChange={(keys) => setTarget(keys as string[])}
          render={(item) => item.title}
          titles={["Source", "Target"]}
          styles={{ section: { width: 160, height: 160 } }}
        />
      </Section>

      <Section title="Data Display — Avatar, Badge, Tag, Statistic, Progress">
        <Badge count={5}><Avatar shape="square" icon={<UserOutlined />} /></Badge>
        <Avatar style={{ backgroundColor: token.colorPrimary }}>DK</Avatar>
        <Tag color="processing">processing</Tag>
        <Tag color="success">success</Tag>
        <Tag color="error">error</Tag>
        <Statistic title="Active loans" value={1128} />
        <div style={{ width: 200 }}><Progress percent={60} /></div>
        <Progress type="circle" percent={72} size={64} />
      </Section>

      <Section title="Data Display — Card, Descriptions, Table">
        <Card title="Card" extra={<Link href="#top">More</Link>} style={{ width: 260 }}>Card body content.</Card>
        <Descriptions title="Descriptions" size="small" column={1} style={{ width: 260 }}
          items={[{ key: "1", label: "Name", children: "OPA LMS" }, { key: "2", label: "Status", children: <Tag color="success">live</Tag> }]} />
        {/* `List` was here and is gone: antd 6 deprecates it and warns on
            every render, so the showcase was printing the warning three times
            on load. Its replacement `Listy` is a virtualised list with a
            different API, and the product does not use one — row lists here
            are Flex plus a hairline. Nothing to theme-check. */}
        <Table size="small" style={{ width: 320 }} pagination={false}
          columns={[
            { title: "Name", dataIndex: "name" },
            { title: "Status", dataIndex: "status", render: (s: string) => <Tag color="processing">{s}</Tag> },
            { title: "Amount", dataIndex: "amount", align: "right" },
          ]}
          dataSource={[
            { key: 1, name: "Row one", status: "active", amount: "1,200" },
            { key: 2, name: "Row two", status: "active", amount: "3,400" },
          ]} />
      </Section>

      <Section title="Data Display — Collapse, Timeline, Tree, Calendar">
        <div style={{ width: 260 }}>
          <Collapse items={[{ key: "1", label: "Panel one", children: "Content one" }, { key: "2", label: "Panel two", children: "Content two" }]} />
        </div>
        <Timeline items={[{ content: "Created" }, { content: "In review", color: "green" }, { content: "Blocked", color: "red" }]} />
        <Tree defaultExpandAll treeData={treeData} style={{ width: 200 }} />
        <div style={{ width: 300 }}><Calendar fullscreen={false} /></div>
      </Section>

      <Section title="Data Display — Carousel, Image, QRCode, Segmented, Empty">
        <div style={{ width: 240 }}>
          <Carousel autoplay>
            {["Slide 1", "Slide 2", "Slide 3"].map((s) => (
              <div key={s}>
                <div style={{ height: 100, lineHeight: "100px", textAlign: "center", color: token.colorTextLightSolid, background: token.colorFillSecondary, borderRadius: token.borderRadius }}>{s}</div>
              </div>
            ))}
          </Carousel>
        </div>
        <Image width={120} src={tinyImg} />
        <QRCode value="https://skiloope.com" size={96} />
        <Empty />
      </Section>

      <Section title="Data Display — Tooltip, Popover (hover/click to check)">
        <Tooltip title="Tooltip text"><Button>Hover: Tooltip</Button></Tooltip>
        <Popover content="Popover content" title="Popover"><Button>Click: Popover</Button></Popover>
      </Section>

      <Section title="Feedback — Alert, Result, Skeleton, Spin">
        <Alert type="info" title="Info" showIcon />
        <Alert type="success" title="Success" showIcon />
        <Alert type="warning" title="Warning" showIcon />
        <Alert type="error" title="Error" showIcon />
        <div style={{ width: 240 }}><Skeleton active /></div>
        <Spin />
        <Result status="success" title="Result" subTitle="A themed result block" style={{ width: 320 }} />
      </Section>

      <Section title="Feedback — overlays (click to theme-check)">
        <Button onClick={() => message.success("Themed message")}>Message</Button>
        <Button onClick={() => notification.info({ message: "Notification", description: "Themed notification" })}>Notification</Button>
        <Button onClick={() => modal.confirm({ title: "Confirm?", content: "Themed modal" })}>Modal</Button>
        <Button onClick={() => setDrawer(true)}>Drawer</Button>
        <Popconfirm title="Confirm this?"><Button>Popconfirm</Button></Popconfirm>
        <Drawer title="Drawer" open={drawer} onClose={() => setDrawer(false)}>Themed drawer content.</Drawer>
        <Button ref={tourAnchor} onClick={() => setTour(true)}>Tour</Button>
        <Tour
          open={tour}
          onClose={() => setTour(false)}
          steps={[{
            title: "Tour",
            description: "Themed tour step — check the mask, card and buttons.",
            target: () => tourAnchor.current as HTMLElement,
          }]}
        />
      </Section>

      <Section title="Other — Watermark">
        <Watermark content="Skiloope">
          <div style={{ height: 120, width: 260, border: `1px solid ${token.colorBorder}`, borderRadius: token.borderRadius }} />
        </Watermark>
      </Section>

      {/* Overlay/floating widgets shown live */}
      <FloatButton.Group shape="circle">
        <FloatButton icon={<CustomerServiceOutlined />} tooltip="FloatButton" />
        <FloatButton icon={<CommentOutlined />} />
        <FloatButton.BackTop />
      </FloatButton.Group>
    </Flex>
  );
}

// Wrap in antd <App> so message/notification/modal pick up the theme + context.
function Showcase() {
  return (
    <App>
      <ShowcaseInner />
    </App>
  );
}

const meta: Meta<typeof Showcase> = {
  title: "System/Theme Showcase",
  component: Showcase,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const AllComponents: StoryObj<typeof Showcase> = {};
