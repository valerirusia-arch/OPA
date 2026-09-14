// src/theme/tokens.ts
//
// DESIGNER-OWNED. The single source of visual truth.
//
// This is the ONLY file in the project allowed to contain raw hex — ESLint
// errors on a hex literal anywhere else in presentation (see
// eslint.presentation.js, rule 3). Everything else reads these values back
// through `theme.useToken()`.
//
// KEY DECISION — one primary colour, not a near-black one.
// antd derives every hover, active and selected surface from `colorPrimary`
// (colorPrimaryBg, controlItemBgHover, optionActiveBg, itemHoverBg...). A
// near-black primary therefore turns every hover into a heavy grey slab. With a
// real brand colour the same derivations come out as light, calm tints — which
// is exactly the behaviour we want.

import { theme, type ThemeConfig } from "antd";

/** Brand values. Raw hex is legal HERE and nowhere else. */
export const brand = {
  /** Primary: filled actions, links, focus rings, selection. */
  primary: "#2456E6",
  primaryHover: "#1B45C4",
  /**
   * THE LOGO'S OWN BLUE, and deliberately NOT the primary.
   *
   * The designer asked the mark to sit a shade softer than the product's
   * working blue — *"ოდნავ მსუბუქად იჯდეს"* — so the wordmark reads as a brand
   * mark rather than one more primary-coloured control in the chrome. A
   * periwinkle, lighter and less saturated than `primary`; the letters darken
   * where they overlap by multiplying, so this is the FLAT colour and the
   * intersections derive from it.
   */
  logo: "#5468E8",
  /**
   * THE STATUS DONUT'S OWN PALETTE.
   *
   * The semantic success/error/warning read as clashing at arc size — a hard
   * green next to a hard red next to a gold — and the fill grey came out too
   * dark. This is a softer, more even set: the same meanings (approved,
   * declined, in review, pending) at a gentler, more harmonious saturation,
   * and a genuinely light grey for the rest.
   */
  donutApproved: "#4FAE86",
  donutDeclined: "#E2796E",
  donutReview: "#E4AC55",
  donutPending: "#E6E9EF",
  /** The primary at ~45% over white — a blue outline that hints, not shouts. */
  primarySoft: "#9CB3F4",
  primaryActive: "#1739A6",


  /**
   * THE SUCCESS GREEN, from the designer's own swatch: #008000.
   *
   * It has been #12A150 and then #0E7C3E, both of them antd-derived greens
   * darkened by hand until the pale tags passed AA. This one is given, and it
   * happens to pass without help: measured 5.14:1 on white and 4.55:1 on the
   * soft fill below, against the 4.5:1 that 12px text asks for.
   *
   * It is a pure green — no blue in it at all — which is why `successSoft`
   * was re-derived with it rather than kept. The old tint leaned cyan, and a
   * cyan-leaning ground under a pure-green word is the one place a hue
   * mismatch shows.
   */
  success: "#008000",
  /**
   * The success green at ~10% over white, computed from THIS green.
   *
   * #EAF4EA rather than a flat 10% mix: the exact 10% tint measured 4.46:1
   * for the word on it, four hundredths under AA, and two steps lighter
   * clears it at 4.55:1 without being visibly paler.
   */
  successSoft: "#EAF4EA",
  danger: "#D6353F",
  warning: "#D97706",

  /**
   * The avatar's tint. The one warm colour in the product, and it earns its
   * place: a person is not a piece of the interface, so their initials do not
   * wear the interface's blue.
   *
   * NOTE: white initials on this tint read at about 2.1:1, under the 3:1 WCAG
   * asks of large text. It is the tone the design calls for, so it stays —
   * flagged here rather than silently darkened. `avatarInk` below is the way
   * out if it ever has to pass: same hue, deep enough to read at 5:1.
   */
  avatarTint: "#E8A08B",
  /** The readable alternative for the initials, if the white ever has to go. */
  avatarInk: "#7A3418",

  /** Neutrals — very slightly cool, so they sit under the blue. */
  white: "#FFFFFF",
  /**
   * The page ground, everywhere.
   *
   * It was #F5F7FA — cool, but leaning blue-green next to the brand's own
   * blue. The designer picked the reference: the same value of grey carried a
   * step round the wheel, so the ground shares the accent's hue instead of
   * arguing with it. White cards read slightly warmer against it and the blue
   * of a primary button sits in the same family as the surface behind it.
   */
  layout: "#F4F5FA",
  /**
   * The soft fill behind inputs, the Segmented track — every "recessed"
   * surface. It is `ink` at 4%, which is exactly what antd derives for a
   * filled Input, so the switcher and the fields below it read as one
   * material instead of two greys.
   */
  surfaceSubtle: "rgba(20, 26, 37, 0.04)",
  border: "#E4E8EF",
  /**
   * THE QUIETEST RECESS IN THE PRODUCT.
   *
   * For a panel inside a card that has to separate without becoming a second
   * card. It was the page ground (#F4F5FA) and the designer wanted it lighter
   * and less blue — *"უფრო მონაცრისფროსკენ წაიყვანე, ძაან ღიასკენ."*
   *
   * Neutral ink at 2.5% rather than a mixed hex, so it is the same grey
   * whatever surface it lands on and it stays honest in dark mode. On white
   * that resolves to about #F9F9FA: a shade lighter than the page ground and
   * with the blue taken out of it, which is what stops a tinted block inside
   * a white card from reading as a coloured panel.
   */
  panelSubtle: "rgba(20, 26, 37, 0.025)",
  /**
   * The same edge, one step firmer — for a card that is under the pointer.
   *
   * A navigation tile has to acknowledge a hover, and the two obvious ways
   * were both rejected on this dashboard: lifting it to `shadowCard` made the
   * band heave, and washing it with the page's lightest fill turned a white
   * card grey. What is left is the quietest change there is — the card stays
   * exactly where it is and exactly the colour it is, and its own outline
   * comes forward. `#D6DBE6` is `border` darkened just enough to be seen
   * beside an untouched neighbour and not enough to be read as a state.
   */
  borderHover: "#D6DBE6",
  /**
   * The outline on a white button. The same grey that reads as a quiet rule
   * between rows reads as a heavy box once it closes around a small white
   * shape, so the button gets a lighter one. Still visible — the button has
   * no fill to define it — just not the thing you notice first.
   */
  borderSoft: "#EDF0F5",
  ink: "#141A25",
  /**
   * Quiet text: placeholders, `Typography type="secondary"`, the small
   * uppercase labels above a value.
   *
   * IT WAS 45% AND THAT FAILED WCAG AA. Measured in the browser rather than
   * assumed: `ink` at 45% over white is **2.89:1**, against the 4.5:1 AA asks
   * of body and placeholder text. The comment that used to sit here claimed
   * 45% "clears WCAG AA against the field's fill"; it did not, and the claim
   * was never measured.
   *
   * 62% is the first step that clears 4.5:1 on BOTH grounds this text appears
   * on — 4.90:1 on a white card, 4.78:1 on the layout grey. 58% clears white
   * and fails the grey, which is the trap: half the product's secondary text
   * sits on `layout`, not on white. Against `ink` at 88% for primary text it
   * is still an unmistakable step down, which is the whole job.
   */
  quiet: "rgba(20, 26, 37, 0.62)",

  /**
   * Faint graph-paper rule for hero backgrounds.
   *
   * Weak enough that it reads as texture rather than as a table: the eye
   * should register that the page has a surface, not start counting cells.
   */
  gridLine: "rgba(20, 26, 37, 0.032)",


  /**
   * The top bar's own ground: white, but not opaque.
   *
   * The bar is pinned over the page, so at full opacity it is a lid — content
   * meets it and simply stops. Let some of it through and blur what shows,
   * and the page reads as continuing underneath, which is what it does.
   */
  headerVeil: "rgba(255, 255, 255, 0.72)",

  /** The auth pages' side panel — depth from colour, no image. */
  panelGradient:
    "radial-gradient(130% 110% at 100% 0%, #3C6BF5 0%, #2456E6 42%, #16307F 100%)",
  panelGlow:
    "radial-gradient(55% 55% at 22% 88%, rgba(255,255,255,0.20), transparent 70%)",


  /**
   * The profile cover.
   *
   * Four soft washes of colour bleeding into a pale ground — light, warm on
   * one side and cool on the other, with nothing in it sharp enough to compete
   * with the name sitting under it. The peach is the avatar's own tint, so the
   * two read as one idea rather than two decisions.
   *
   * Built from gradients rather than an image: it scales to any width, costs
   * no request, and cannot arrive late — a cover that pops in after the page
   * has drawn is worse than no cover at all.
   */
  cover: [
    "radial-gradient(58% 120% at 12% 8%, rgba(124,158,255,0.40) 0%, rgba(124,158,255,0) 62%)",
    "radial-gradient(46% 105% at 74% 4%, rgba(232,160,139,0.38) 0%, rgba(232,160,139,0) 60%)",
    "radial-gradient(52% 120% at 92% 88%, rgba(178,152,255,0.34) 0%, rgba(178,152,255,0) 62%)",
    "radial-gradient(60% 130% at 44% 108%, rgba(150,214,208,0.34) 0%, rgba(150,214,208,0) 60%)",
    "#F6F8FE",
  ].join(", "),

  /**
   * THE CARD, in three finishes.
   *
   * There are two different cards in this product and they are not variants
   * of each other: OPA ISSUES the virtual card, restricted to one USCIS
   * filing fee and spent by us on the borrower's behalf, and the borrower
   * BRINGS the debit card the loan is repaid from. Money goes opposite ways
   * through them.
   *
   * They spent a while looking identical — same navy finish, and the mock
   * even gave them the same four digits — which is the one thing a reader
   * must not conclude. The FINISH is what tells them apart now: flat graphite
   * is OPA's, the navy gradient is the borrower's own.
   *
   * `cardLight` is the pale finish the pair was first drawn in. It is kept
   * because it is drawn and it works, and it is one prop away.
   *
   * ALL THREE ARE SOLID FILLS. Gradients went first from the card OPA issues
   * and then from the borrower's, for the same reason both times: a gradient
   * is a drawing of a card in light, and the moment two cards both have one
   * they become two versions of that drawing. A flat fill is not a picture of
   * an object, which happens to be honest about a card the product only ever
   * holds a token for. No brand marks and no hologram either — a convincing
   * replica would suggest OPA holds the card.
   */
  /**
   * The borrower's own card. Solid, and it used to be a three-stop ramp under
   * a corner bloom.
   *
   * The gradient was doing an impression of a physical card catching light,
   * and once the card OPA issues went flat the impression was the only thing
   * keeping the two apart — which put the whole distinction on a lighting
   * effect rather than on what the cards are. Flat against flat, the reader
   * compares the two facts that matter: a different colour and different
   * digits.
   *
   * #222E52 is the ramp's own middle stop, so the card keeps exactly the
   * navy it has always read as; what goes is the theatre around it. White
   * clears 13.3:1 on it and white at 68% clears 6.9:1.
   */
  cardDark: "#222E52",
  /** The pale finish the pair was first drawn in, flattened with them so the
   *  product has one rule for a card face rather than two. Nothing uses it. */
  cardLight: "#EEF3FF",
  /**
   * OPA's own card: flat graphite.
   *
   * Three references got here. Two gradients were wrong in the same way — a
   * deep emerald built on the navy's own construction (*"არ ვარგა"*) and a
   * mint-to-silver ramp with a bloom (*"ის საშინელებაა"*) — because a
   * gradient in another hue is a RECOLOUR of the borrower's card, not a
   * different object. A flat mint answered that and the finish stuck; the
   * colour then moved to the designer's last reference, a soft black.
   *
   * FLAT IS THE POINT, and it survives every colour: one fill edge to edge,
   * no sheen, no ramp. It went flat first and the navy followed, so the rule
   * now holds for every card in the product.
   *
   * Not black, and not neutral either. #2E3441 is a soft graphite with a
   * trace of the product's blue in it, so it belongs to the same family as
   * the navy card without being a lighter copy of it — and with both flat,
   * the two are told apart by colour and by the digits on them, which are the
   * two things about them that are actually true.
   *
   * White ink, like the navy: 12.5:1 for the number, 6.6:1 for the small
   * print at 68%.
   */
  cardGraphite: "#2E3441",
  /**
   * THE CARD NETWORKS' OWN COLOURS.
   *
   * Not OPA's palette and not up to OPA — a network mark is drawn in the
   * network's colours or it is not that mark. They live here because this is
   * the only file allowed a hex, and they are the only values in it that the
   * theme may never restyle.
   */
  mcRed: "#EB001B",
  mcAmber: "#F79E1B",
  /** Where the two circles cross. It is its own colour in the real mark, not
   *  a blend mode, so it is drawn as one. */
  mcOverlap: "#FF5F00",

  /** The status pill on either dark finish, graphite or navy: the card's own
   *  material, not a white sticker on it. */
  cardDarkPill: "rgba(255, 255, 255, 0.14)",
  /** Ink on a dark finish. White, and white at 68% for the small print —
   *  measured on both fills: 13.3:1 / 6.9:1 on the navy, 12.5:1 / 6.6:1 on
   *  the graphite. */
  cardDarkInk: "#FFFFFF",
  cardDarkQuiet: "rgba(255, 255, 255, 0.68)",
  /** The hairline that keeps a light card from dissolving into a white page. */
  cardLightEdge: "rgba(20, 26, 37, 0.08)",
  cardDarkEdge: "rgba(255, 255, 255, 0.10)",

  /**
   * A payment card's face.
   *
   * The same four washes as `cover`, re-aimed for a shape 300px wide instead
   * of a banner: the blue reads across the top left where the issuer's name
   * sits, the peach and violet meet at the bottom right behind the expiry, and
   * the whole thing resolves to the same pale ground. Two cards on two pages
   * (the virtual card OPA issues, the debit card the borrower repays with) are
   * one object to the reader, so they wear one material.
   *
   * PALE ON PURPOSE. The face carries the masked number, an issuer label and
   * an expiry in ink, so the ground has to stay light enough for `colorText`
   * to sit on it — the ink measures better than 12:1 on every part of this.
   * A saturated card would have to invert all of them, and the page's one
   * saturated surface is not the card.
   */
  cardFace: [
    "radial-gradient(90% 150% at 6% 4%, rgba(124,158,255,0.40) 0%, rgba(124,158,255,0) 62%)",
    "radial-gradient(70% 130% at 96% 12%, rgba(232,160,139,0.30) 0%, rgba(232,160,139,0) 58%)",
    "radial-gradient(85% 150% at 92% 98%, rgba(178,152,255,0.32) 0%, rgba(178,152,255,0) 60%)",
    "radial-gradient(95% 160% at 24% 106%, rgba(150,214,208,0.30) 0%, rgba(150,214,208,0) 58%)",
    "#F6F8FE",
  ].join(", "),

  /** Soft elevation — the wireframes had none; hi-fi needs a little. */
  shadowCard: "0 1px 2px rgba(20,26,37,0.04), 0 10px 28px -14px rgba(20,26,37,0.18)",
  /**
   * `shadowCard`'s first layer on its own: a card at rest.
   *
   * One hairline of contact shadow, no cast. It is what separates a card that
   * is an object sitting on the page from one that is a rectangle drawn on
   * it, and it is small enough that a row of four adds no weight. Lifting to
   * the full `shadowCard` is then a real change of state rather than a new
   * effect appearing from nowhere.
   */
  shadowRest: "0 1px 2px rgba(20,26,37,0.04)",
  shadowNone: "none",
} as const;

export const tokens: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: brand.primary,
    colorLink: brand.primary,
    colorInfo: brand.primary,
    colorSuccess: brand.success,
    colorSuccessBg: brand.successSoft,
    colorError: brand.danger,
    colorWarning: brand.warning,

    colorTextBase: brand.ink,
    colorTextPlaceholder: brand.quiet,
    /**
     * `Typography type="secondary"` reads THIS, not `colorTextSecondary`.
     *
     * antd aliases `colorTextDescription` to `colorTextTertiary` (45%), so
     * every `type="secondary"` line in the product was rendering at 2.89:1 —
     * card descriptions, meta lines, table notes, hints. Set explicitly so it
     * cannot drift back with an antd default.
     */
    colorTextDescription: brand.quiet,
    /**
     * The small uppercase labels above a value read this directly through
     * `token.colorTextTertiary` (the record grids, the metric cards, the
     * balance figure). Same failure, same fix, same value — so the two kinds
     * of quiet text stay one colour instead of two near-misses.
     */
    colorTextTertiary: brand.quiet,
    colorBgLayout: brand.layout,
    colorBorder: brand.border,
    colorBorderSecondary: brand.border,

    borderRadius: 10,
    borderRadiusLG: 14,
    // Body copy is 14px everywhere. fontSizeLG is pinned to 14 as well so that
    // size="large" controls stay roomy without also inflating their text.
    fontSize: 14,
    fontSizeLG: 14,
    lineHeight: 1.6,
    // Inputs, buttons and the segmented control are all 48px tall. Pinning LG to
    // the same value keeps size="large" from making anything taller again.
    controlHeight: 48,
    controlHeightLG: 48,
    wireframe: false,

    boxShadowTertiary: brand.shadowCard,
  },
  components: {
    Button: {
      defaultBorderColor: brand.borderSoft,
      /**
       * A white button's hover turns its label blue — that reads clearly. The
       * OUTLINE at full strength is what made it heavy: a 1px ring in the
       * brand colour draws a hard box around a shape that had none. The label
       * carries the state; the border only has to follow it, so it hovers in
       * a paled blue and only reaches full strength on the press.
       */
      defaultHoverColor: brand.primary,
      defaultHoverBorderColor: brand.primarySoft,
      defaultActiveColor: brand.primaryActive,
      defaultActiveBorderColor: brand.primary,
      colorPrimaryHover: brand.primaryHover,
      colorPrimaryActive: brand.primaryActive,
      primaryShadow: brand.shadowNone,
      defaultShadow: brand.shadowNone,
      dangerShadow: brand.shadowNone,
      fontWeight: 500,
    },
    // No heavy slab on hover — the moving thumb already shows the selection.
    Segmented: {
      // Matches the filled inputs exactly; see brand.surfaceSubtle.
      trackBg: brand.surfaceSubtle,
      itemSelectedBg: brand.white,
      itemHoverBg: "transparent",
      itemActiveBg: "transparent",
      // THE HEIGHT OF THE FIELDS, not one storey above them. It used to stand
      // at 56 — taller than the 48px inputs on the theory that "which form am
      // I looking at" outranks a field inside one — and that is exactly what
      // made it read as a heavy grey slab over the form. At 48 it sits in the
      // same rhythm as the controls under it: quieter, and still unmistakably
      // the switch. *"ცოტა უფრო ლამაზად ... ახლა თითქოს ამძიმებს ui-ის."*
      controlHeight: 48,
      controlHeightLG: 48,
      trackPadding: 3,
      // CONCENTRIC CORNERS. The track rounds at 14 (borderRadiusLG) and the
      // thumb inside it has to round at 14 − the 3px padding = 11, or the inner
      // corner reads tighter than the outer and the two do not nest. *"გარე
      // უფრო მომრგვალებულია ... რომ თანაბრად იჯდნენ."*
      borderRadiusLG: 14,
      borderRadius: 11,
      // A VERY LIGHT STROKE on the white thumb — an inset hairline in the
      // product's own border grey, so the pill has an edge of its own against
      // the pale track without a drop shadow's weight. *"ამ თეთრს ძალიან
      // მსუბუქი სტროუკიც გაუკეთე."*
      boxShadowTertiary: `inset 0 0 0 1px ${brand.border}`,
    },
    // colorErrorText is what antd paints the typed value with in an error
    // state. Red text on a red border is shouting; the message already says it.
    // antd's filled fields turn white when focused, which on a white page
    // reads as the field disappearing. Keeping the fill and letting the blue
    // border carry the focus state is clearer.
    Input: { colorErrorText: brand.ink, activeBg: brand.surfaceSubtle },
    // colorErrorText keeps the value the user typed readable: antd turns it red
    // in an errored field, which reads as "this text is the error".
    Select: { optionSelectedFontWeight: 500, colorErrorText: brand.ink },
    DatePicker: { activeBg: brand.surfaceSubtle, colorErrorText: brand.ink },
    // The rail is a list of destinations, not a set of buttons: 48px rows with
    // 8px between them turn eight links into a scroll. Tighter rows read as
    // one list you can take in at a glance.
    // margin 8 + padding 8 puts the icons 16px from the rail's edge, and keeps
    // the hover shape inset from it rather than running edge to edge.
    Menu: {
      itemHeight: 40,
      itemMarginBlock: 2,
      itemMarginInline: 8,
      itemPaddingInline: 8,
    },
    Card: {
      /**
       * A SECTION HEADING HAS TO OUTRANK BODY TEXT, and it stopped doing so.
       *
       * antd draws a Card's head title at `fontSizeLG`, and this theme pins
       * fontSizeLG to 14 on purpose — so that `size="large"` inputs and
       * buttons stay roomy without inflating their labels. The side effect
       * went unnoticed: every card head came out at 14px, the same size as
       * the table text and the body copy beneath it, so a page of cards had
       * no heading level at all. That is what "the hierarchy is nowhere" was
       * pointing at.
       *
       * Fixing it here rather than by unpinning fontSizeLG keeps the control
       * sizes exactly as they are and gives the heading its step back.
       */
      headerFontSize: 16,
      boxShadowTertiary: brand.shadowCard,
    },
    // The tab bar is the header of the card it sits in, so it gets a header's
    // air. Padding on the ITEM rather than the bar, so the active underline
    // moves down with the label instead of drifting away from it.
    //
    // 14, NOT 18. Measured on /payments: the label's box ran 640→698 for two
    // words, which put the active underline 16px below the text it belongs to
    // — the indicator reading as a line near the tab rather than as the tab's
    // own. *"ზემოთ დიდი სფეისია, ის ლურჯი სტროუკზე უნდა იჯდეს."* At 14 the
    // bar is 50px tall, still a header's air, and the underline is close
    // enough to the word to be read as part of it.
    Tabs: { horizontalItemPadding: "14px 0" },
    // The header band fills the card's corner instead of rounding inside it:
    // the card already clips to its own radius, so a second radius on the
    // header only leaves a pale sliver in the corner.
    // The row's HEIGHT is pinned instead (see shared/ui/tableColumns.ts), so
    // that a row of plain text and a row carrying a 48px control are the same
    // height. This padding only has to be smaller than that.
    Table: { headerBorderRadius: 0, cellPaddingBlock: 12 },
    Modal: {
      borderRadiusLG: 16,
      /**
       * THE CLOSE BUTTON WAS FIGHTING THE DIALOG'S OWN CORNER.
       *
       * antd sizes a Modal's close button from `controlHeight` and derives its
       * inset as `(headerHeight - controlHeight) / 2`. This theme pins
       * controlHeight to 48 so that inputs and buttons stay roomy — which gave
       * the close button a **48x48** hover fill parked **4px** from the top and
       * right edges, inside a corner whose radius is 16. A square hover box
       * 4px inside a 16px curve cuts across it, which is exactly what it
       * looked like on hover.
       *
       * 32 is the size of an icon button rather than a text field, and it
       * makes the derived inset 12px — clear of the curve. `borderRadiusSM`
       * is what antd rounds that fill with, and a CIRCLE can never disagree
       * with a rounded corner however close it sits to one.
       *
       * Scoped to Modal, so no form control anywhere changes size.
       */
      controlHeight: 32,
      borderRadiusSM: 999,
    },
  },
};

/**
 * Same tokens, light or dark algorithm. The DevBar's theme switch flips this so
 * a designer can verify tokens in both modes without touching this file.
 *
 * A SECOND PRIMARY WAS THREADED THROUGH HERE FOR A WHILE — a deeper royal
 * blue on trial against the committed one, switchable from the dev bar. The
 * designer has seen it on the real screens and said no, so the candidate, its
 * derived hover/active/soft shades and the switch are all gone. The reason it
 * was worth building is worth keeping: `colorPrimary` is never only the
 * button — antd derives every hover fill, selected row, focus ring, Segmented
 * thumb and filled Tag from it — so the next candidate should be judged the
 * same way rather than from a swatch.
 */
export const getTheme = (isDark: boolean): ThemeConfig => ({
  ...tokens,
  algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
  token: {
    ...tokens.token,
    // Let the dark algorithm own surfaces, borders and text.
    ...(isDark
      ? {
          colorTextBase: undefined,
          colorBgLayout: undefined,
          colorBorder: undefined,
          colorBorderSecondary: undefined,
        }
      : null),
  },
  components: isDark
    ? {
        ...tokens.components,
        Segmented: { itemHoverBg: "transparent", itemActiveBg: "transparent", trackPadding: 4 },
      }
    : tokens.components,
});
