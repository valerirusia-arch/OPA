// src/shared/ui/AdminPage.tsx
//
// One page inside the back-office shell: a heading, the actions that belong to
// the page as a whole, and the work below.
//
// AdminShell deliberately gives its content area no padding — full-bleed
// screens exist (the profile's banner). Everything else wraps itself in this,
// so every back-office page starts on the same margin.
//
// Dumb: title, actions and content all arrive as props.

import type { ReactNode } from "react";
import { Button, ConfigProvider, Flex, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { styles, toolbarTheme } from "./AdminPage.styles";

export type AdminPageProps = {
  title: ReactNode;
  /** Sits to the right of the heading: search, filters, the primary action. */
  extra?: ReactNode;
  /**
   * A line under the toolbar, still outside the card — what the toolbar has
   * done to the content below, e.g. the filters currently applied. Renders
   * nothing when it is empty, so an untouched page keeps its layout.
   */
  toolbarBelow?: ReactNode;
  /** Shown immediately after the title — a tag, a flag, a badge. */
  titleAfter?: ReactNode;
  /**
   * THE WAY BACK, on its own line above the title.
   *
   * It was a 48px circular button standing to the left of the heading, and it
   * was the heaviest object on a page whose job is to show a record —
   * *"ზედმეტად დიდი და მძიმეა."* A back control is the quietest thing on a
   * detail page: nobody comes here to leave, and the one person who does is
   * looking for words, not for a target.
   *
   * So it is an arrow, above the name, where a breadcrumb goes. THE WORDS CAME
   * OFF AGAIN: "Back to applications" beside an arrow is the arrow explained,
   * and on the one page in the product you can only have arrived at from that
   * list there is nowhere else the arrow could go — *"ტექსტი არაა საჭირო
   * საერთოდ, უბრალოდ აროუ ჩასვი."* The label stays as the accessible name, so
   * a screen reader still hears the destination.
   */
  back?: { label: string; onClick: () => void };
  children: ReactNode;
};

export function AdminPage({
  title,
  extra,
  toolbarBelow,
  titleAfter,
  back,
  children,
}: AdminPageProps) {
  return (
    <div style={styles.page}>
      {back ? (
        <Button
          type="link"
          size="small"
          icon={<ArrowLeftOutlined />}
          aria-label={back.label}
          style={styles.back}
          onClick={back.onClick}
        />
      ) : null}

      <Flex
        align="center"
        justify="space-between"
        gap={16}
        wrap
        style={styles.titleRow}
      >
        {/* Wraps so a long applicant name plus the id and status tag beside it
            fall onto a second line on a phone, rather than squeezing the id
            column down to one character per line. */}
        <Flex align="center" gap={12} wrap>
          {/*
            WHAT FOLLOWS THE TITLE SITS ON ITS BASELINE, not on its centre.

            Everything here was centred, and geometrically it was: the heading's
            box, the id and the status pill all had the same middle. It still
            read as misaligned, because two pieces of TYPE on one line are
            judged by where they stand, not by where their boxes' middles fall —
            and a 26px serif and a 14px sans centred on one axis have baselines
            five pixels apart. The reference this page reads as broken is the
            line the letters sit on. *"ისევ ეს შუაში დაალაინე მთავარ
            ტექსტთან."*

          */}
          <Flex align="baseline" gap={12} wrap>
            <Typography.Title level={2} style={styles.title}>
              {title}
            </Typography.Title>
            {titleAfter}
          </Flex>
        </Flex>
        {extra ? (
          <ConfigProvider theme={toolbarTheme}>
            <Flex align="center" gap={12} wrap>
              {extra}
            </Flex>
          </ConfigProvider>
        ) : null}
      </Flex>
      {toolbarBelow}
      {children}
    </div>
  );
}

export default AdminPage;
