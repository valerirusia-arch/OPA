// src/features/Dashboard/ui/ApplicationProgress.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";
import { LEAD_PANEL_INSET } from "../../../shared/ui/panel.styles";

export const styles = {
  /**
   * The lead inset, because this band IS the dashboard's lead before there is
   * a balance to lead with — it occupies the same slot the money card takes
   * after funding, and the two must not sit at different distances from their
   * own edges.
   *
   * The bottom is short by 8 on purpose: the recess below the rail carries
   * its own 24, and in the `history` variant antd's Collapse adds a row after
   * it. Both are measured from the card's floor, so the card keeps the same
   * visual foot whichever is on screen.
   */
  body: {
    paddingTop: LEAD_PANEL_INSET,
    paddingInline: LEAD_PANEL_INSET,
    paddingBottom: LEAD_PANEL_INSET - 8,
  },
  /** The row inside the recess: words on the left, the move on the right. */
  detail: { width: "100%" },
  /** `minWidth: 0` so the sentence wraps inside its own column instead of
   *  widening the row and pushing the button off the card. */
  copyBlock: { minWidth: 0 },
  /* 500, not antd's 600 Title. The step's name — Review, Signing, Funding — is
     a heading on a card that already leads with the track and its own copy; at
     600 it reads as a second heavy thing. Matches StageFoot's title, so the
     stage name weighs the same before and after funding. *"ამ სტეპებზე
     თაითლებს ბოლდნესი დააკელი — რევიუს, ფუნდინგს, სიგნინს."* */
  title: { marginTop: 0, marginBottom: 0, fontWeight: 500 },
  /**
   * NO MEASURE CAP. The sentence takes the column it is in.
   *
   * This went 460 → 560 → off, one designer note at a time, and the last one
   * settled it: *"მთლიანად გაშალე მაგის ტექსტიც ბარემ."* The reason the
   * textbook 65–75 characters does not apply here is that these are not
   * paragraphs — every one of them is a single sentence or two, and the cost
   * of a long line is only paid on the RETURN to the next one. A capped
   * two-line notice with three words on the second line and 300px of empty
   * panel beside it looked like a mistake, and it was.
   *
   * The column still has a limit, and it is the right one: `copyBlock` shares
   * the row with the step's action, so where there is an action the sentence
   * stops well short of the panel's edge on its own.
   */
  copy: { fontSize: 14, display: "block" },
  /**
   * THE LINK, ON THE HEADING'S LINE.
   *
   * It read as floating — *"ვერ გავიგე, არც შუაშია, არც დაბლა, არც მაღლა."*
   * And it was: this theme pins `controlHeight` to 48 so that fields and
   * buttons stay roomy, and antd sizes a link Button from the same token, so
   * a 21px line of text was being centred inside a 48px box while the heading
   * beside it is a 24px one. It sat 12px below where it looked like it should.
   *
   * `height: auto` gives the link its own text's height and nothing more, and
   * the row's `flex-start` then puts it level with the heading. The padding
   * goes too, so the words end flush with the panel's inset rather than one
   * button's worth inside it.
   *
   * `flex: none` so the row's `space-between` gives the sentence the slack
   * and the label keeps its own width.
   *
   * The INK is in `getStyles` — see `action` there.
   */
  actionBox: {
    flex: "none",
    height: "auto",
    padding: 0,
    /* The heading's line box is 24 and the link's is 21; 2 lands their
       cap-heights on one another rather than their boxes. */
    marginTop: 2,
  },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) => {
  return {
    /**
     * THE RULE BETWEEN THE ROAD AND THE PLACE YOU ARE STANDING.
     *
     * A tinted recess was tried in its place — the live step on its own soft
     * ground, so it would read as a thing sitting inside the band. It went
     * back: *"ნაცრისფერი ჩარჩო არ მომწონს, ესე უფრო მომწონს ჩარჩოს გარეშე."*
     * And the reason it is right is that the band has one surface and one
     * subject; a panel inside it made the card look like two cards, which is
     * the thing this dashboard has been taken apart twice to avoid.
     *
     * The failed state loses its pink ground with it. Nothing is lost there
     * either: the rail already draws the step in red and names it in red, and
     * a second red surface under the same sentence was the news told twice.
     *
     * Equal air on both sides. A divider is a joint, and unequal margins
     * would attach it to one of the two things it separates. The heading
     * below it then has 24 above and 8 below its own sentence, which is the
     * order that reading wants.
     */
    rule: {
      height: 1,
      background: token.colorSplit,
      marginBlock: 24,
    },

    /**
     * WHOSE MOVE IT IS. The plain filled tag, and nothing added to it.
     *
     * It was given a hairline while the live step sat on a tinted recess: a
     * pale tag on a pale ground had no boundary of its own. The recess is
     * gone and the tag is back on the card's white, where the tint alone is
     * enough — *"ჩარჩო თუ არ გვექნება, უკან ეს სტროუკი აღარ დაგვჭირდება."*
     * An edge that was compensating for a background is furniture once the
     * background goes.
     */
    ownerTag: { fontWeight: 500, paddingBlock: 1 },

    /**
     * THE STEP'S WAY OUT, IN THE PAGE'S OWN INK.
     *
     * antd paints a link Button in the accent, and in this panel that put a
     * blue phrase opposite a blue heading with a blue-tinted rail above both
     * — *"ჯობია ისევ შავი იყოს ეგ cta."* The accent on this band is spent on
     * the one thing it is for, which is saying which step is live. A way
     * somewhere is text and an arrow; it does not need a colour to be found,
     * because it is the only thing on its side of the row.
     */
    action: { ...styles.actionBox, color: token.colorText },
    /** Under the pointer it takes the accent — the one moment a link in this
     *  panel is allowed to be blue, because then it is answering a gesture
     *  rather than competing for attention. */
    actionHover: { ...styles.actionBox, color: token.colorPrimary },

    /**
     * The drawer's own line — the product's ink at 500, which is exactly what
     * the other collapsible in this product uses for its own line ("How late
     * fees and overdue accounts work" on /payments). *"შეგიძლია გააშავო
     * ტექსტი ჩამოსადროპის, როგორც აქ გაქვს."*
     *
     * It was 13 in the quiet token, which made the one thing on this card a
     * reader can open the quietest text on it.
     */
    historyLabel: { fontWeight: 500, color: token.colorText },
  } satisfies Record<string, CSSProperties>;
};
