// src/features/Auth/ui/DateOfBirthPicker.tsx
//
// A date picker built for one job: entering a birthday.
//
// A calendar is the wrong shape for this. It opens on this month — the least
// likely month anyone was born in — and reaching 1994 means paging back three
// hundred times. What people actually recall is the other way round: the year
// first, then the month, then the day.
//
// So this asks in that order and shows the answer building up as it goes:
// "1996" → "Aug 1996" → "21 Aug 1996". Nothing is committed to the form until
// the day is chosen, so a half-made choice can never be mistaken for an
// answer. Ages OPA cannot lend to are disabled rather than accepted and then
// rejected — the WBS requires applicants to be adults.
//
// Built by hand because antd's DatePicker cannot show a partial selection:
// its input is either empty or a whole date.
//
// Dumb: value in, value out. Form.Item wires both.

import { useState } from "react";
import { Button, Dropdown, Flex, Input, Typography, theme } from "antd";
import {
  CalendarOutlined,
  CloseCircleFilled,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useT } from "../../../shared/ui/i18n/useT";
import { MIN_AGE } from "./validation";
import { getStyles, styles } from "./DateOfBirthPicker.styles";

/** Which years the list opens on — a plausible middle for adult applicants. */
const TYPICAL_AGE = 30;
/** How far back the year list can page. Not a rule, just a sane bottom. */
const EARLIEST_YEAR = 1900;
const YEARS_PER_PAGE = 12;
/**
 * The month is spelled out rather than numbered. "08/07" is ambiguous the
 * world over — a Guatemalan applicant reads it as 8 July, the US form means
 * 7 August — and a birthday is exactly the field where that mistake is
 * invisible until underwriting. dayjs is switched with the interface
 * language, so the name arrives translated.
 */
const DATE_FORMAT = "DD MMM YYYY";
const MONTH_FORMAT = "MMM YYYY";

type Stage = "year" | "month" | "day";

export type DateOfBirthPickerProps = {
  value?: Dayjs;
  onChange?: (value: Dayjs | null) => void;
  disabled?: boolean;
  status?: "error" | "warning";
  id?: string;
};

/** Old enough to sign for a loan, and not a date that has yet to happen. */
const newestAllowed = () => dayjs().subtract(MIN_AGE, "year");

const isYearAllowed = (year: number) =>
  year >= EARLIEST_YEAR && year <= newestAllowed().year();

const isDateAllowed = (date: Dayjs) => !date.isAfter(newestAllowed(), "day");

export function DateOfBirthPicker({
  value,
  onChange,
  disabled,
  status,
  id,
}: DateOfBirthPickerProps) {
  const { token } = theme.useToken();
  const s = getStyles(token);
  const t = useT();

  const [open, setOpen] = useState(false);
  /** The clear control replaces the calendar icon only while the field is in
   *  play — pointed at or open. At rest the field just says what it is. */
  const [hovered, setHovered] = useState(false);
  const [stage, setStage] = useState<Stage>("year");
  const [year, setYear] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);
  const [pageStart, setPageStart] = useState(
    () => dayjs().subtract(TYPICAL_AGE, "year").year() - YEARS_PER_PAGE + 1
  );

  /** Reopening always starts the walk again, from wherever the value sits. */
  const handleOpen = (next: boolean) => {
    setOpen(next);
    if (!next) return;
    const anchor = value ?? dayjs().subtract(TYPICAL_AGE, "year");
    setStage("year");
    setYear(value ? value.year() : null);
    setMonth(value ? value.month() : null);
    setPageStart(anchor.year() - YEARS_PER_PAGE + 1);
  };

  /**
   * What the field shows: the finished date, or the part chosen so far.
   * Digits throughout, in the US order the rest of the product uses, so the
   * shape never changes under the reader — only fills in.
   */
  const display = value
    ? value.format(DATE_FORMAT)
    : year === null
      ? ""
      : month === null
        ? String(year)
        : dayjs().year(year).month(month).format(MONTH_FORMAT);

  /** Clearing wipes the half-made choice too, or the field would keep showing
   *  "Aug 1996" after the date it belonged to was removed. */
  const clearDate = () => {
    setYear(null);
    setMonth(null);
    setStage("year");
    setOpen(false);
    onChange?.(null);
  };

  const pickDay = (day: number) => {
    if (year === null || month === null) return;
    onChange?.(dayjs().year(year).month(month).date(day).startOf("day"));
    setOpen(false);
  };

  const years = Array.from({ length: YEARS_PER_PAGE }, (_, i) => pageStart + i);
  const daysInMonth =
    year !== null && month !== null ? dayjs().year(year).month(month).daysInMonth() : 31;

  const panel = (
    <div style={s.panel}>
      <Flex align="center" justify="space-between" style={s.header}>
        {stage === "year" ? (
          <>
            <Button
              type="text"
              size="small"
              icon={<LeftOutlined />}
              aria-label={t("dob.earlierYears")}
              onClick={() => setPageStart((start) => start - YEARS_PER_PAGE)}
            />
            <Typography.Text style={s.headerTitle}>
              {years[0]} – {years[years.length - 1]}
            </Typography.Text>
            <Button
              type="text"
              size="small"
              icon={<RightOutlined />}
              aria-label={t("dob.laterYears")}
              onClick={() => setPageStart((start) => start + YEARS_PER_PAGE)}
            />
          </>
        ) : (
          <>
            <Button
              type="text"
              size="small"
              icon={<LeftOutlined />}
              aria-label={t("common.back")}
              onClick={() => setStage(stage === "day" ? "month" : "year")}
            />
            <Typography.Text style={s.headerTitle}>
              {stage === "month"
                ? year
                : dayjs()
                    .year(year ?? 0)
                    .month(month ?? 0)
                    .format("MMM YYYY")}
            </Typography.Text>
            {/* Keeps the title centred against the button opposite. */}
            <span />
          </>
        )}
      </Flex>

      {stage === "year" && (
        <div style={s.yearGrid}>
          {years.map((option) => (
            <Button
              key={option}
              type={year === option ? "primary" : "text"}
              style={s.cell}
              disabled={!isYearAllowed(option)}
              onClick={() => {
                setYear(option);
                setMonth(null);
                setStage("month");
              }}
            >
              {option}
            </Button>
          ))}
        </div>
      )}

      {stage === "month" && (
        <div style={s.monthGrid}>
          {Array.from({ length: 12 }, (_, index) => index).map((option) => {
            const first = dayjs()
              .year(year ?? 0)
              .month(option)
              .date(1);
            return (
              <Button
                key={option}
                type={month === option ? "primary" : "text"}
                style={s.cell}
                disabled={!isDateAllowed(first) && !isDateAllowed(first.endOf("month"))}
                onClick={() => {
                  setMonth(option);
                  setStage("day");
                }}
              >
                {first.format("MMM")}
              </Button>
            );
          })}
        </div>
      )}

      {stage === "day" && (
        <div style={s.dayGrid}>
          {Array.from({ length: daysInMonth }, (_, index) => index + 1).map((day) => {
            const date = dayjs()
              .year(year ?? 0)
              .month(month ?? 0)
              .date(day);
            return (
              <Button
                key={day}
                type={value?.isSame(date, "day") ? "primary" : "text"}
                style={s.cell}
                disabled={!isDateAllowed(date)}
                onClick={() => pickDay(day)}
              >
                {day}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <Dropdown
      open={open && !disabled}
      onOpenChange={handleOpen}
      trigger={["click"]}
      disabled={disabled}
      placement="bottomLeft"
      // The panel always stays under the field. Left to itself the dropdown
      // flips above whenever the space below is tight, so the same click opens
      // the calendar somewhere different each time and the field you just
      // clicked disappears behind it. (Passing { adjustY: 0 } does not help:
      // antd forces adjustY back on unless shiftY is set — see
      // _util/placements getOverflowOptions.)
      autoAdjustOverflow={false}
      popupRender={() => panel}
    >
      <Input
        id={id}
        readOnly
        disabled={disabled}
        status={status}
        value={display}
        placeholder={t("dob.placeholder")}
        style={styles.field}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        suffix={
          value && (open || hovered) ? (
            // Clearing must not also open the panel, hence stopping the event
            // before it reaches the field that triggers the dropdown.
            <Button
              type="text"
              size="small"
              style={s.clear}
              icon={<CloseCircleFilled />}
              aria-label={t("dob.clear")}
              onMouseDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                clearDate();
              }}
            />
          ) : (
            <CalendarOutlined style={s.icon} />
          )
        }
      />
    </Dropdown>
  );
}

export default DateOfBirthPicker;
