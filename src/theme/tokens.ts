// src/theme/tokens.ts
//
// DESIGNER-OWNED. The single source of visual truth.
//
// This is the ONLY file in the project allowed to contain raw hex — ESLint
// errors on a hex literal anywhere else in presentation. Everything else reads
// these values back through `theme.useToken()`.
//
// REBRANDED to One Percent for America (onepercentforamerica.org). The palette,
// the neutrals and the type were extracted from the live site so the product
// reads as the same brand as the marketing pages:
//   · TEAL is the identity — the logo, the serif headings, the section grounds.
//     It is `colorPrimary`, so every derived hover, selected row, focus ring,
//     tab and link comes out as a calm teal tint.
//   · A burnt ORANGE is the call-to-action on every button on the site, so the
//     product's primary button wears it (and only it), while the rest of the
//     chrome stays teal — the same division the site keeps.
//   · Warm near-black and warm greys carry the text, on a warm off-white ground.
//   · A serif leads the headings and a geometric sans the body, mirroring the
//     site's Noe Display / Gotham pairing (closest web substitutes, loaded in
//     index.html).

import { theme, type ThemeConfig } from "antd";

/** Brand values. Raw hex is legal HERE and nowhere else. */
export const brand = {
  /**
   * PRIMARY — the site's TEAL.
   *
   * antd derives every hover, active and selected surface from `colorPrimary`
   * (colorPrimaryBg, controlItemBgHover, optionActiveBg, itemHoverBg…). With
   * the brand teal here the whole product's chrome tints teal, calm and on
   * brand, the way the site's identity does.
   */
  primary: "#146580",
  primaryHover: "#0F5468",
  primaryActive: "#0B4053",
  /** Teal at ~45% over white — an outline that hints, not shouts. */
  primarySoft: "#9BC1CD",
  /**
   * THE LIGHT INTERACTIVE TINT — a very light blue the designer chose (#EDF4FB)
   * for every selected/hover surface.
   *
   * antd derives those grounds from `colorPrimary`, and a deep teal derives a
   * muddy, heavy grey-teal slab — *"ეს ძაან მძიმეა... უფრო მსუბუქი ფერი გვინდა,
   * EDF4FB."* Overriding the tint tokens to this clean, light family makes the
   * selected menu row, the table hover and the select options light and
   * aesthetic, and lightens the illustration disc grounds with them.
   */
  tint: "#EDF4FB",
  tintHover: "#F4F8FC",
  tintStrong: "#DDEBF7",
  /**
   * THE LOGO'S DEEP TEAL, and the heading colour. The site sets its H1 at
   * #125A71; headings in the product take a shade deeper for contrast.
   */
  logo: "#125A71",
  heading: "#0E4457",
  /** The bright cyan the site runs across its highlight bands. */
  cyan: "#3EC9D2",

  /**
   * THE CALL-TO-ACTION — the site's burnt orange.
   *
   * Every button on the site is this colour, so the product's PRIMARY BUTTON
   * wears it — overridden at the component level, because `colorPrimary` stays
   * teal for the rest of the chrome. Teal identity, orange CTA: the site's own
   * division.
   */
  orange: "#B85C23",
  orangeHover: "#A5501C",
  orangeActive: "#8C4216",
  orangeSoft: "#F1E0D3",

  /**
   * THE STATUS DONUT'S PALETTE — one hue stepped strong → pale, teal now, so
   * the ring stays calm and on brand. The legend says which arc is which.
   * Ordered darkest → lightest.
   */
  donutApproved: "#0E4457",
  donutDeclined: "#146580",
  donutReview: "#5FA0B4",
  donutPending: "#C4DCE4",

  /**
   * Semantic states, kept legible and harmonised with the warm palette.
   * WARNING is a gold held clear of the orange CTA, so a warning and a primary
   * action never read as the same colour.
   */
  success: "#2E7D57",
  /**
   * THE SAME GREEN, A SHADE LIGHTER — for the illustrations' badges only.
   *
   * `success` carries WORDS: "Approved", "Funded", "Passed", at 12 and 14px on
   * white and on `successSoft`. It is as light as it can go and still be read,
   * so it cannot follow the designer's note about the badge on the submitted
   * mark being heavy — *"ზედმეტად მუქი მწვანე, ოდნავ სულ ოდნავ გააღავე."*
   *
   * An illustration's disc carries no text: a white tick on it needs contrast
   * the other way round, and there is room to spare. So the marks get their
   * own step, lifted just enough to stop the badge reading as a full stop in
   * the middle of a soft drawing, and the semantic green is left where the
   * type needs it.
   */
  successMark: "#3E9370",
  successSoft: "#E7F1EC",
  /**
   * The green pressed. One button in the product wears green — "Done", on the
   * repaid application — and antd needs three values to theme a solid button
   * properly: the fill, a lighter hover and a darker active. `success` is the
   * fill, `successMark` the hover, and this is the one step down that was
   * missing.
   */
  successActive: "#235F41",
  danger: "#C0392B",
  warning: "#C08A2E",

  /**
   * The avatar's tint — the one warm human colour, and it already belongs to
   * the site's warm family. A person is not a piece of the interface, so their
   * initials do not wear the interface's teal.
   */
  avatarTint: "#E8A08B",
  avatarInk: "#7A3418",

  /** Neutrals — WARM, taken from the site: a warm near-black, warm greys, and a
   *  warm off-white ground, so white cards sit warm against it. */
  white: "#FFFFFF",
  layout: "#F6F4F1",
  /** The soft fill behind inputs and the Segmented track — warm ink at 4%, so a
   *  filled field and the switcher read as one material. */
  surfaceSubtle: "rgba(38, 36, 35, 0.04)",
  border: "#E5E0DA",
  /**
   * THE HAIRLINE — every stroke that only has to SEPARATE, not contain: the
   * card border and its header rule, the sidebar and top-bar edges, the tables,
   * and the dividers between rows. It was the same `border` as a real outline,
   * which read too dark and heavy once it was drawn on every card head, every
   * rail and every separator at once — *"ეს სტროუკები ზედმეტად მძიმე და მუქია,
   * შემასუბუქე ყველგან."* A step lighter than `border`, it lets those strokes
   * whisper the division instead of ruling it.
   */
  hairline: "#EFEBE6",
  /** Separators proper — a shade lighter still, warm ink at 6%. */
  hairlineSoft: "rgba(38, 36, 35, 0.06)",
  /** The quietest recess — a panel inside a card. Warm ink at 2.5%. */
  panelSubtle: "rgba(38, 36, 35, 0.025)",
  /** A card under the pointer: `border` a step firmer. */
  borderHover: "#D8D1C9",
  /** The outline on a white button — lighter, so it does not box the shape. */
  borderSoft: "#EFEBE6",
  ink: "#262423",
  /**
   * Quiet text: placeholders, `type="secondary"`, the small uppercase labels.
   * Warm ink at 66% — measured 4.6:1 on white, which clears AA for body and
   * placeholder text.
   */
  quiet: "rgba(38, 36, 35, 0.66)",
  /** The top bar's own ground: white, not opaque, so the page reads as
   *  continuing under it. */
  headerVeil: "rgba(255, 255, 255, 0.72)",

  /** The auth pages' side panel — teal depth, no image. */
  panelGradient:
    "radial-gradient(130% 110% at 100% 0%, #1C7C97 0%, #146580 42%, #0A3547 100%)",
  panelGlow:
    "radial-gradient(55% 55% at 22% 88%, rgba(255,255,255,0.20), transparent 70%)",

  /**
   * The profile cover — teal and warm washes bleeding into a pale ground. The
   * peach is the avatar's own tint, so the two read as one idea.
   */
  /*
    LIGHTER AGAIN — *"ეს ნამეტანი მუქია უკან, ოდნავ უფრო ღია ფერები მინდა."*
    Every alpha comes down about a third. These were mixed when the wash sat
    behind a page with cards all over it; behind ONE card on an otherwise
    empty screen the same strengths read as weather rather than as light.
  */
  cover: [
    "radial-gradient(58% 120% at 12% 8%, rgba(30,124,151,0.13) 0%, rgba(30,124,151,0) 62%)",
    "radial-gradient(46% 105% at 74% 4%, rgba(232,160,139,0.13) 0%, rgba(232,160,139,0) 60%)",
    "radial-gradient(52% 120% at 92% 88%, rgba(62,201,210,0.11) 0%, rgba(62,201,210,0) 62%)",
    "radial-gradient(60% 130% at 44% 108%, rgba(184,92,35,0.07) 0%, rgba(184,92,35,0) 60%)",
    "#FAF8F6",
  ].join(", "),


  /**
   * THE CARDS, in their finishes.
   *
   * OPA ISSUES the virtual card and the borrower BRINGS their debit card; they
   * must not look alike. The finish tells them apart, and it is named after
   * whose card it is rather than after its colour, because the colour is the
   * part that changes.
   *
   * `cardOpa` IS THE BRAND TEAL — `primary`, the same value the logo, the
   * headings and every selected surface wear. OPA's own card is the one object
   * in the product that should read as OPA on sight, so it takes the identity
   * colour at full strength rather than a darkened cousin of it: *"მინდა რომ ეს
   * ქარდი ბრენდის მსგავსი გავაკეთოთ."* White ink measures 6.3:1 on it.
   *
   * `cardBorrower` stays the warm graphite — a neutral material, so the card
   * the borrower brought does not wear OPA's colour.
   *
   * Both are FLAT SOLID FILLS. A gradient is a drawing of a card in light, and
   * two of them become two versions of one drawing.
   */
  /**
   * OPA'S VIRTUAL CARD.
   *
   * A REVERSAL, RECORDED. Every card face in this product was a single flat
   * fill, on the rule that a gradient is a drawing of a card in light and two
   * of them become two versions of one drawing. The designer has taken that
   * back for OPA's own card with a reference in hand — a deep colour at the
   * top falling away into near-black at the foot, the way an issued card is
   * actually printed. It applies to THIS card only: the borrower's own stays
   * the flat graphite, so the two are still opposite objects.
   *
   * A second, graphite finish and a picker to switch between them were built
   * and then cut — *"ეს 2 ვარიანტის ფერი ამოიღე, აღარ გვინდა."* One card, one
   * finish.
   *
   * The sheen is a single soft highlight, not a second hue — it is what stops
   * a long ramp reading as a printing error.
   */
  /**
   * ONE SMOOTH RAMP, AND NOTHING LAID OVER IT.
   *
   * A soft radial highlight used to sit on top of this, meant as the sheen the
   * reference card has. It landed across the middle-right, where the blue is
   * already handing over to the black, and read as a pale patch lifted out of
   * the dark — a printing fault rather than light: *"შავი ფერი, რაღაცები
   * ამოწეულია."* A gloss painted onto a flat ramp needs the geometry the
   * reference gets from being a photograph of a curved object; without it, it
   * is just a lighter area.
   *
   * So the face is one linear ramp with enough stops to stay smooth all the
   * way down: brand blue at the top corner, through the deep blues, into a
   * near-black at the foot.
   *
   * AND THE FOOT IS NOT BLACK — the brand's other colour bleeds into it.
   * *"შავის ნაცვლად ოდნავ შეაპარე ბლარში ნარინჯისფერი."* A soft bloom of the
   * CTA orange sits in the bottom corner, under the type and well spread, so
   * the card carries both of the brand's colours without ever stating the
   * second one: where the blue runs out, what is left is warm rather than
   * neutral. The darkest stops are warmed to meet it, so the bloom lands on a
   * ground that is already leaning that way instead of on a cold grey.
   */
  /*
    BRIGHTER, AND BLUER ALL THE WAY DOWN — 2026-09-20.

    The ramp above ran brand blue into a warmed near-black, which is how an
    issued card is printed but is not what the designer sent: an iridescent
    face, light and luminous, several hues sliding into one another. *"ოდნავ
    მეტი ლურჯი რომ გაურიო და მაგ სიკაშკაშის იყოს."*

    So the black is gone and the ramp stays blue end to end, opening about two
    stops, with three washes over it — cyan into the top left, a warm peach
    across the top right, and the CTA orange along the foot where it already
    was. Together they read as one iridescent surface rather than as four
    coloured patches, because none of them is strong enough to be named.

    THE FOOT STAYS THE DEEPEST PART, and that is doing work rather than
    taste: everything printed on this card is white, and all of it sits in
    the lower half — the number, the name, the expiry. A face that is bright
    where the type is would be a card nobody can read. The top is where the
    light goes, and the only thing up there is the mark, which now sits on a
    white tile of its own and no longer needs the ground to be dark.
  */
  cardSkin: [
    /* The CTA orange along the foot, in two blooms so the warmth runs the
       whole hem rather than sitting in one corner — *"ეს ნარინჯისფერი ლოგოს
       მხრიდანაც უქენი."* The right one leads, the left answers it quieter.
       Both centres sit just inside the card: pushed to 106% most of each
       bloom fell off the bottom edge and only its faintest tail showed. */
    "radial-gradient(84% 70% at 84% 102%, rgba(184,92,35,0.58) 0%," +
      " rgba(184,92,35,0.26) 44%, rgba(184,92,35,0) 78%)",
    "radial-gradient(70% 62% at 8% 100%, rgba(184,92,35,0.42) 0%," +
      " rgba(184,92,35,0.18) 46%, rgba(184,92,35,0) 80%)",
    /* ONE HUE, TOP TO BOTTOM.
       There were three over this ramp — cyan into the top left, a warm peach
       across the top right, the orange at the foot — and together they made
       the face read as a swatch rather than as a card: *"აქ ბევრი ფერია ხომ
       ხედავ."* The washes are gone; the orange at the foot is the only second
       colour left, which is the brand's own pair and nothing more.

       AND THE HUE IS THE DESIGNER'S OWN SWATCH, #30647D, sampled from the
       chip they sent. It is a true blue no longer: at H 199°, S 45%, L 34%
       it is the BRAND TEAL family, four degrees off `primary` (#146580) and
       a good deal quieter — so the card now belongs to the same colour as
       the product's chrome instead of sitting beside it in a blue of its
       own. The six stops are that one swatch at six lightnesses, 54% down to
       16%, with the swatch itself sitting at 42% where the face is widest.

       THE FOOT STAYS THE DEEPEST PART, which is doing work rather than
       taste: everything printed on this card is white and all of it sits in
       the lower half. */
    "linear-gradient(158deg, #569CBE 0%, #4085A6 20%, #30647D 42%," +
      " #275164 62%, #1E3F4E 80%, #17303C 100%)",
  ].join(", "),
  cardOpa: "#146580",
  /** The pale finish the pair was first drawn in; nothing uses it. */
  cardLight: "#E7F1F4",
  cardBorrower: "#2E2B2A",

  /**
   * THE CARD NETWORKS' OWN COLOURS — not OPA's to restyle. A network mark is
   * drawn in the network's colours or it is not that mark.
   */
  mcRed: "#EB001B",
  mcAmber: "#F79E1B",
  mcOverlap: "#FF5F00",

  /**
   * THE MATERIAL OF EVERYTHING PRINTED ON THE CARD — the state pill and the
   * tile the mark sits on. Translucent WHITE, so both read as light let
   * through the card rather than as stickers placed on it.
   *
   * It has been both ways. White at 14% failed when the skin still had a
   * bright cyan corner: the pill sat top right, where the face was lightest,
   * and white text on it measured about 2.5:1. A translucent dark fixed that
   * and cost the mark — a dark disc inside a dark tile, with the white flame
   * that is the point of the drawing sitting on a ground nearly its own
   * value. *"ნოთ იუზდ და ეს ლოგოც უკან მსგავსი გამჭვირვალობა ჰქონდეთ, ოღონდ
   * იყოს თეთრისკენ."*
   *
   * White works now because the skin changed under it: one teal-blue ramp,
   * no bright corner, and both things sit in its lower half. 20% over the
   * ramp's 62% stop composites to about #527483, where white text measures
   * 4.9:1 — clear of AA — and the mark's dark disc and white flame both have
   * a mid ground to read against.
   */
  cardDarkPill: "rgba(255, 255, 255, 0.20)",
  cardDarkInk: "#FFFFFF",
  cardDarkQuiet: "rgba(255, 255, 255, 0.68)",
  cardLightEdge: "rgba(38, 36, 35, 0.08)",

  /** A payment card's face — the same warm/teal washes on a pale ground. */
  cardFace: [
    "radial-gradient(90% 150% at 6% 4%, rgba(30,124,151,0.34) 0%, rgba(30,124,151,0) 62%)",
    "radial-gradient(70% 130% at 96% 12%, rgba(232,160,139,0.28) 0%, rgba(232,160,139,0) 58%)",
    "radial-gradient(85% 150% at 92% 98%, rgba(62,201,210,0.30) 0%, rgba(62,201,210,0) 60%)",
    "radial-gradient(95% 160% at 24% 106%, rgba(184,92,35,0.18) 0%, rgba(184,92,35,0) 58%)",
    "#F6F3F0",
  ].join(", "),

  /** Soft elevation. */
  shadowCard: "0 1px 2px rgba(38,36,35,0.05), 0 10px 28px -14px rgba(38,36,35,0.20)",
  shadowRest: "0 1px 2px rgba(38,36,35,0.05)",
  shadowNone: "none",

  /**
   * TYPOGRAPHY. The site pairs Noe Display (a high-contrast serif) on headings
   * with Gotham (a geometric sans) on body. Neither is free to embed, so the
   * product uses the closest web substitutes — a high-contrast serif for
   * headings, a clean geometric sans for everything else — loaded in
   * index.html, where the serif is also bound to the heading classes.
   */
  fontSans: `"Montserrat", "Helvetica Neue", Arial, sans-serif`,
  fontSerif: `"Playfair Display", Georgia, "Times New Roman", serif`,
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

    // The site's geometric sans, everywhere but the headings — those take the
    // serif through a rule in index.html bound to antd's heading classes.
    fontFamily: brand.fontSans,

    colorTextBase: brand.ink,
    /**
     * HEADINGS ARE TEAL, like the site's. antd draws every Typography.Title and
     * every card / modal / drawer head title in `colorTextHeading`; the site
     * sets its headings in the brand teal, so the product does too. Body text
     * stays the warm near-black `colorTextBase`; data figures stay ink as well.
     */
    colorTextHeading: brand.heading,
    colorTextPlaceholder: brand.quiet,
    /**
     * `Typography type="secondary"` reads THIS, not `colorTextSecondary`.
     * Set explicitly so the quiet text cannot drift back to antd's failing 45%.
     */
    colorTextDescription: brand.quiet,
    /** The small uppercase labels above a value read this. Same value, so the
     *  two kinds of quiet text stay one colour. */
    colorTextTertiary: brand.quiet,
    colorBgLayout: brand.layout,
    // A real outline (inputs, the segmented track) keeps `border`; every
    // separating stroke drops to the lighter hairline so the chrome stops
    // ruling the page. See brand.hairline.
    colorBorder: brand.border,
    colorBorderSecondary: brand.hairline,
    /** Dividers and the strokes antd draws from `colorSplit` — lighter still. */
    colorSplit: brand.hairlineSoft,

    /**
     * THE SELECTED / HOVER GROUNDS — the designer's light cyan, not antd's
     * teal-derived slab. `colorPrimaryBg` is the selected tint (selected rows,
     * checked options, the primary-tinted surfaces); `controlItemBg*` are the
     * hover/active grounds of Select options and the like. Set here once so the
     * whole product's selection reads light and clean. See brand.tint.
     */
    colorPrimaryBg: brand.tint,
    colorPrimaryBgHover: brand.tintStrong,
    /**
     * The "processing" tint — a `Tag color="processing"` ("Your move") and every
     * other info-toned fill. antd derives it from the teal `colorInfo` as a
     * heavy grey-blue slab; pinned to the light family so those chips read as
     * light as the selected rows do. *"ეს ფერის ტონი ამოცვალე... EDF4FB."*
     */
    colorInfoBg: brand.tint,
    controlItemBgHover: brand.tintHover,
    controlItemBgActive: brand.tint,
    controlItemBgActiveHover: brand.tintStrong,

    borderRadius: 10,
    borderRadiusLG: 14,
    // Body copy is 14px everywhere. fontSizeLG is pinned to 14 as well so that
    // size="large" controls stay roomy without also inflating their text.
    fontSize: 14,
    fontSizeLG: 14,
    lineHeight: 1.6,
    // Inputs, buttons and the segmented control are all 48px tall.
    controlHeight: 48,
    controlHeightLG: 48,
    wireframe: false,

    boxShadowTertiary: brand.shadowCard,
  },
  components: {
    Button: {
      /**
       * THE PRIMARY BUTTON IS THE SITE'S ORANGE CTA — and only the button.
       * `colorPrimary` stays teal for the rest of the chrome; the Button
       * overrides it here so its filled variant wears the burnt orange every
       * button on the site does, with its own derived hover/active.
       */
      colorPrimary: brand.orange,
      colorPrimaryHover: brand.orangeHover,
      colorPrimaryActive: brand.orangeActive,

      defaultBorderColor: brand.borderSoft,
      /**
       * A white button's hover turns its label the brand teal — the label
       * carries the state, the border only follows it, so it hovers in a paled
       * teal and reaches full strength on the press.
       */
      defaultHoverColor: brand.primary,
      defaultHoverBorderColor: brand.primarySoft,
      defaultActiveColor: brand.primaryActive,
      defaultActiveBorderColor: brand.primary,
      primaryShadow: brand.shadowNone,
      defaultShadow: brand.shadowNone,
      dangerShadow: brand.shadowNone,
      fontWeight: 500,
      /**
       * A DISABLED BUTTON STAYS IN THE CTA'S WARM FAMILY, not antd's cool grey.
       * A disabled Continue that turns blue-grey reads as a different control;
       * a pale orange keeps it recognisably the same button, just not yet
       * ready. *"ყავისფერის დისებლი გააკეთე."*
       */
      borderColorDisabled: brand.orangeSoft,
      colorBgContainerDisabled: brand.orangeSoft,
      colorTextDisabled: "#B08A6B",
    },
    // No heavy slab on hover — the moving thumb already shows the selection.
    Segmented: {
      trackBg: brand.surfaceSubtle,
      itemSelectedBg: brand.white,
      itemHoverBg: "transparent",
      itemActiveBg: "transparent",
      controlHeight: 48,
      controlHeightLG: 48,
      trackPadding: 3,
      // Concentric corners: track 14, thumb 14 − 3 padding = 11.
      borderRadiusLG: 14,
      borderRadius: 11,
      // A very light stroke on the white thumb.
      boxShadowTertiary: `inset 0 0 0 1px ${brand.border}`,
    },
    // Keep the value the user typed readable in an error state, and keep the
    // filled fill on focus (antd turns it white, which reads as disappearing).
    Input: { colorErrorText: brand.ink, activeBg: brand.surfaceSubtle },
    Select: { optionSelectedFontWeight: 500, colorErrorText: brand.ink },
    DatePicker: { activeBg: brand.surfaceSubtle, colorErrorText: brand.ink },
    // The rail is a list of destinations: 40px rows, 2px between them.
    Menu: {
      itemHeight: 40,
      itemMarginBlock: 2,
      itemMarginInline: 8,
      itemPaddingInline: 8,
      // Light cyan, not the heavy teal-derived slab — see brand.tint. The
      // selected label stays teal and reads clearly on it.
      itemSelectedBg: brand.tint,
      itemActiveBg: brand.tint,
      itemHoverBg: brand.tintHover,
      itemSelectedColor: brand.primary,
    },
    Card: {
      // A section heading has to outrank body text; fontSizeLG is pinned to 14,
      // so the head is set explicitly at 16.
      headerFontSize: 16,
      boxShadowTertiary: brand.shadowCard,
    },
    Tabs: { horizontalItemPadding: "14px 0" },
    /**
     * SMALLER PAGINATION. antd sizes pagination items from `controlHeight`,
     * which this theme pins to 48 for roomy inputs and buttons — so the page
     * numbers came out as big 48px tiles. Pinned back to antd's own 32 (and the
     * small variant to 24), so the pager reads as a pager and not a row of
     * buttons. *"უფრო პატარა პაგინაციები."*
     */
    Pagination: { itemSize: 32, itemSizeSM: 24 },
    Table: {
      headerBorderRadius: 0,
      cellPaddingBlock: 12,
      // The row hover was a heavy grey; the light cyan reads as a highlight,
      // not a slab. Selected rows take the same family a step firmer.
      rowHoverBg: brand.tintHover,
      rowSelectedBg: brand.tint,
      rowSelectedHoverBg: brand.tintStrong,
    },
    Modal: {
      borderRadiusLG: 16,
      // A 32px close button clears the 16px corner; a circle never disagrees
      // with a rounded corner.
      controlHeight: 32,
      borderRadiusSM: 999,
    },
  },
};

/**
 * Same tokens, light or dark algorithm. The DevBar's theme switch flips this so
 * a designer can verify tokens in both modes without touching this file.
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
