// src/features/Auth/ui/validation.ts
//
// antd Form rules for the account fields. These are the messages drawn on the
// "All error statements" wireframe, kept in one place so registration, profile
// and password screens can never drift apart — and so they follow the
// interface language like every other string.
//
// Presentation-level validation only (antd's own Form rules). The authoritative
// checks — "this email is already registered", SSN uniqueness, identity — are
// server-side and arrive back as field errors during integration.

import { useMemo } from "react";
import type { Rule } from "antd/es/form";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useT } from "../../../shared/ui/i18n/useT";
import { cardNetwork, cvvLength, passesLuhn } from "./cardNetwork";

/**
 * OPA lends to adults. The WBS does not state this, but a loan agreement
 * signed by a minor is not enforceable, so the form does not offer it.
 */
export const MIN_AGE = 18;

/**
 * One hook for every rule set the account screens use. A hook rather than
 * module constants because the messages are translated, and translation is
 * only knowable at render time.
 */
export function useAuthRules() {
  const t = useT();

  return useMemo(() => {
    /**
     * "Required" for a STRING field, checked when the value changes and when
     * the form is submitted — never on blur.
     *
     * String only, and not by preference: async-validator only takes its
     * `required`-only fast path when the rule has exactly one key besides
     * `message`. Ours also carries `validateTrigger`, so it falls through to
     * the validator for `rule.type`, which defaults to "string" — and that
     * one rejects any non-string value it is handed, reporting it with THIS
     * rule's message. A filled Upload came back "Required field" because its
     * value is an array. Use `requiredValue` for anything that is not text.
     *
     * Focusing a field and clicking away without typing is not a mistake, so
     * blur alone must not report one. Watching changes instead means the
     * error appears only if you actually empty a field you had filled, and —
     * just as important — it clears the instant you fix a field that failed
     * at submit. Checking on submit alone would leave that error frozen on
     * screen until the next submit.
     */
    const required = (message?: string): Rule => ({
      required: true,
      message: message ?? t("validation.required"),
      validateTrigger: ["onSubmit", "onChange"],
    });

    /**
     * "Required" for a value that is NOT a string — a number, a boolean, a
     * Dayjs, an Upload's file list.
     *
     * A `validator` function takes precedence over every built-in rule, so
     * this sidesteps the string-validator trap described above entirely. It
     * checks presence directly: `false` counts as an answer — "no, I am not a
     * veteran" is a filled-in field, not a blank one — and an EMPTY array does
     * not, because an Upload with nothing in it is nothing uploaded.
     */
    const requiredValue = (message?: string): Rule => ({
      validateTrigger: ["onSubmit", "onChange"],
      validator: (_rule, value: unknown) => {
        const blank =
          value === undefined ||
          value === null ||
          value === "" ||
          (Array.isArray(value) && value.length === 0);
        return blank
          ? Promise.reject(new Error(message ?? t("validation.required")))
          : Promise.resolve();
      },
    });

    /**
     * "Required" for a figure somebody has to state — an income, a household
     * income.
     *
     * Zero is not a blank, so `requiredValue` lets it through, and on a field
     * whose empty state already READS as "$0" that is the whole problem: a
     * slider dragged back to the left and a question never answered end up as
     * the same submitted application. Somebody applying for a loan against a
     * declared income has an income; asking them to state it is not a lending
     * rule, it is the field doing its job.
     */
    const amount = (message?: string): Rule => ({
      validateTrigger: ["onSubmit", "onChange"],
      validator: (_rule, value: unknown) =>
        typeof value === "number" && value > 0
          ? Promise.resolve()
          : Promise.reject(new Error(message ?? t("validation.amount"))),
    });

    /**
     * Format rules wait for blur. Half a typed email is not a wrong email,
     * and reporting it mid-word is what makes forms feel hostile.
     */
    const onLeave = (rule: Rule): Rule => ({ ...rule, validateTrigger: "onBlur" });

    return {
      required,
      requiredValue,
      amount,

      email: [required(), onLeave({ type: "email", message: t("validation.email") })],

      /** WBS: US number with a mask, e.g. (555) 010-2020. */
      phone: [
        required(),
        onLeave({ pattern: /^\(\d{3}\) \d{3}-\d{4}$/, message: t("validation.phone") }),
      ],

      ssn: [
        required(),
        onLeave({ pattern: /^\d{3}-?\d{2}-?\d{4}$/, message: t("validation.ssn") }),
      ],

      /**
       * THE SAME NUMBER, WHERE LEAVING IT BLANK IS AN ANSWER.
       *
       * The back office holds only a mask, so its SSN field cannot be an edit
       * of what is there — it is a replacement, and "no replacement" has to be
       * allowed. Same format when something IS typed.
       */
      ssnOptional: [
        onLeave({ pattern: /^\d{3}-?\d{2}-?\d{4}$/, message: t("validation.ssn") }),
      ],

      zip: [required(), onLeave({ pattern: /^\d{5}$/, message: t("validation.zip") })],

      /**
       * The WBS states no password policy, so this one is OPA's to confirm.
       * It is here because a form that accepts "1234" and lets the server
       * refuse it later is worse than one that says the rule up front.
       */
      password: [
        required(),
        onLeave({
          pattern: /^(?=.*[A-Z])(?=.*\d).{8,}$/,
          message: t("hint.password"),
        }),
      ],

      /**
       * The mock Repay form, checked for SHAPE and nothing more.
       *
       * A real processor answers whether a card is good; this one cannot, and
       * pretending otherwise would be a lie about what the prototype does. But
       * a form that accepts a single digit hands the review a card reading
       * "Card •••• 1 · exp 11/11", and a summary that can say that is not
       * showing anybody their card. Length, a month that exists, and a date
       * that has not already passed are answerable here.
       */
      cardNumber: [
        required(),
        onLeave({
          validator: (_rule, value: string | undefined) => {
            const digits = (value ?? "").replace(/\D/g, "");
            if (!digits) return Promise.resolve();

            /**
             * Shape first, then the checksum.
             *
             * A number outside every network's range, or the wrong length for
             * the one it is in, is not a card at all — saying "check the
             * digits" about it points at the wrong thing. Only once it could
             * be a card is the checksum the useful complaint.
             */
            const network = cardNetwork(digits);
            if (!network || !network.lengths.includes(digits.length)) {
              return Promise.reject(new Error(t("validation.cardNumber")));
            }

            return passesLuhn(digits)
              ? Promise.resolve()
              : Promise.reject(new Error(t("validation.cardLuhn")));
          },
        }),
      ],

      cardExpiry: [
        required(),
        onLeave({
          validator: (_rule, value: string | undefined) => {
            if (!value) return Promise.resolve();
            if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) {
              return Promise.reject(new Error(t("validation.cardExpiry")));
            }
            // A card is good through the LAST day of its month. Built as an
            // ISO string on purpose: dayjs only reads "MM/YY" with the
            // customParseFormat plugin loaded, and without it "11/11" falls
            // through to the engine's own Date parsing, which differs between
            // browsers.
            const [month, year] = value.split("/");
            const expires = dayjs(`20${year}-${month}-01`).endOf("month");
            return expires.isBefore(dayjs())
              ? Promise.reject(new Error(t("validation.cardExpired")))
              : Promise.resolve();
          },
        }),
      ],

      /**
       * How many digits depends on the card, so this one reads the number.
       *
       * "3 or 4" is the rule a form writes when it has not looked: an Amex
       * always prints four and a Visa always prints three, and the leading
       * digits already say which is in the field above.
       */
      cardCvv: (numberField: string): Rule[] => [
        required(),
        ({ getFieldValue }) => ({
          validateTrigger: "onBlur",
          validator: (_rule, value: string | undefined) => {
            if (!value) return Promise.resolve();
            const digits = String(getFieldValue(numberField) ?? "").replace(/\D/g, "");
            const count = cvvLength(digits);
            return value.length === count && /^\d+$/.test(value)
              ? Promise.resolve()
              : Promise.reject(new Error(t("validation.cardCvv", { count })));
          },
        }),
      ],

      dateOfBirth: [
        // A date is a Dayjs object; see requiredValue above for why the plain
        // `required` rule cannot be used on one.
        requiredValue(),
        onLeave({
          validator: (_rule, value: Dayjs | undefined) => {
            if (!value) return Promise.resolve();
            if (value.isAfter(dayjs())) {
              return Promise.reject(new Error(t("validation.dobFuture")));
            }
            if (dayjs().diff(value, "year") < MIN_AGE) {
              return Promise.reject(new Error(t("validation.minAge", { age: MIN_AGE })));
            }
            return Promise.resolve();
          },
        }),
      ],

      /** Typing a password you cannot see is easy to get wrong, and finding
       *  out at the first sign-in attempt is the worst possible moment. */
      confirmPassword: (field: string): Rule[] => [
        required(t("validation.confirmPassword")),
        ({ getFieldValue }) => ({
          validateTrigger: "onBlur",
          validator: (_rule, value: string) =>
            !value || getFieldValue(field) === value
              ? Promise.resolve()
              : Promise.reject(new Error(t("validation.passwordsMismatch"))),
        }),
      ],
    };
  }, [t]);
}
