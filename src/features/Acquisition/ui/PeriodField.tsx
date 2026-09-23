// src/features/Acquisition/ui/PeriodField.tsx
//
// A campaign's validity period: two dates, two calendars, one value.
//
// WHY NOT RangePicker. It was one, and measured in the dialog it opens in, its
// panel came out 828px wide against a 480px modal — two months side by side
// cannot be made narrower — so it hung off BOTH edges, its left at x=-100,
// past the window itself. With no room under the field it also opened upward,
// covering the modal's title and the two fields above it. Nothing about that
// is configurable: the panel is two months because it is a range.
//
// Two single-month pickers are ~280px each. They fit, they open downward, and
// each one says which end of the period it is instead of leaving the reader to
// work it out from a dash between two blank boxes.
//
// THE PAIR IS STILL ONE FIELD. It takes and emits `[Dayjs, Dayjs]`, exactly
// what RangePicker did, so `entityDates.ts` and every screen that stores a
// `[from, to]` string pair are untouched.
//
// WHAT EACH PICKER KNOWS ABOUT THE OTHER:
//   · the end cannot fall before the start, and the start cannot fall after
//     the end — enforced by greying the days out, not by an error after the
//     fact, because a date you cannot pick never becomes a mistake to explain;
//   · opening the end picker lands on the start's own month rather than on
//     today, which is where the next date is.
//
// IT DROPS DOWN, NOT UP. antd picks a side by itself and, left to it, put the
// panel over the form the reader had just filled in — *"ქვემოთ ჩამოწიე, ზემოთ
// რატომ აგაქ."* `placement="bottomLeft"` puts it under the field, where the
// two dates and everything above them stay in view.
//
// It still flips up when the window is genuinely too short for it — measured,
// under about 890px of window — and that fallback is antd's overflow guard
// doing its job: above the field is worse than below it, and both are better
// than half a calendar off the bottom of the screen.
//
// NO "Today" FOOTER, and that is a measurement rather than a preference. The
// dialog sits 100px down a 768px window and the field lands at y=458, so a
// 448px panel has room neither below it nor above: it opened at top=-19 with
// its own month-navigation header cut off above the window, which is the one
// control a calendar cannot do without. Dropping the footer takes the panel to
// ~408 and the whole of it back on screen. Today is still marked on the grid.
//
// And the span is named under the pair once both ends are set. A campaign is
// bought in weeks; "Mar 01 – May 31" is a fact the reader would otherwise have
// to count out on their fingers.
//
// Dumb: local display only, value in and value out.

import { DatePicker, Flex, Form, Typography } from "antd";
import type { Dayjs } from "dayjs";
import { useT } from "../../../shared/ui/i18n/useT";
import { styles } from "./PeriodField.styles";

/** The same shape RangePicker used, so nothing downstream changes. */
export type Period = [Dayjs | null, Dayjs | null] | null;

export type PeriodFieldProps = {
  value?: Period;
  onChange?: (value: Period) => void;
};

/** The product's own date format — the campaigns table prints "Mar 01, 2026",
 *  and a field that writes the same date differently reads as another date. */
const FORMAT = "MMM DD, YYYY";

export function PeriodField({ value, onChange }: PeriodFieldProps) {
  const t = useT();
  const [from, to] = value ?? [null, null];

  const set = (next: Period) => onChange?.(next);

  /* Inclusive of both ends: a campaign valid Mar 01–Mar 01 runs for a day, not
     for none. `startOf("day")` so a stored timestamp cannot round it down. */
  const days =
    from && to
      ? to.startOf("day").diff(from.startOf("day"), "day") + 1
      : undefined;

  return (
    <Flex vertical gap={8}>
      <Flex gap={12} wrap>
        <Form.Item
          label={t("acq.campaign.starts")}
          style={styles.half}
          /* Nested inside the outer Form.Item, so it carries no `name` and
             holds no value of its own — it is here for the label. */
        >
          <DatePicker
            size="large"
            style={styles.fullWidth}
            format={FORMAT}
            value={from}
            showToday={false}
            placement="bottomLeft"
            placeholder={t("acq.campaign.starts")}
            disabledDate={(day) => (to ? day.isAfter(to, "day") : false)}
            onChange={(next) => set(next || to ? [next, to] : null)}
          />
        </Form.Item>

        <Form.Item label={t("acq.campaign.ends")} style={styles.half}>
          <DatePicker
            size="large"
            style={styles.fullWidth}
            format={FORMAT}
            value={to}
            showToday={false}
            placement="bottomLeft"
            placeholder={t("acq.campaign.ends")}
            /* Opens where the next date is, not on today. */
            defaultPickerValue={from ?? undefined}
            disabledDate={(day) => (from ? day.isBefore(from, "day") : false)}
            onChange={(next) => set(from || next ? [from, next] : null)}
          />
        </Form.Item>
      </Flex>

      {days !== undefined ? (
        <Typography.Text type="secondary" style={styles.span}>
          {t("acq.campaign.runsFor", { days: String(days) })}
        </Typography.Text>
      ) : null}
    </Flex>
  );
}

export default PeriodField;
