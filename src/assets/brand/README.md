# Card network marks — drop the official files here

These are **licensed trademarks**. They are not drawn by us and they are not
in the repo, because the networks distribute them through their own brand
centres under terms OPA has to accept. Download them there and save them **in
this folder** with the exact filenames below; nothing else in the codebase
changes.

They live in `src/` rather than `public/` on purpose. `CardBrandMark` picks
them up with `import.meta.glob`, which is resolved when the app is BUILT — so
a file that is not here is simply not referenced, and the card falls straight
through to its fallback. Served from `public/` the same miss becomes a request
for a file that is not there, and a dev server that answers every unknown path
with the app's own HTML hands the card a broken-image icon instead.

| Save as | Which asset | Where it appears |
|---|---|---|
| `visa-on-dark.svg` | Visa **reversed / white** wordmark | the navy and graphite card faces |
| `visa-on-light.svg` | Visa **blue** wordmark | the pale card face |
| `mastercard.svg` | Mastercard **symbol**, full colour | every card face |

Sources: Visa Brand Center and Mastercard Brand Center. Take the **SVG**, not a
PNG — the mark is drawn at 20px on the card and at whatever size a future
screen needs it.

Mastercard is one file because the full-colour symbol is legible on a light
and a dark ground alike. Visa is two because the wordmark is lettering: the
blue mark disappears on the navy card, and the reversed one disappears on the
pale one.

**Until a file is here, `CardBrandMark` falls back to what it draws itself,
without making a request for it** —
the Mastercard symbol as authored geometry, and the Visa name set in the
card's own type as a visible stand-in. Nothing breaks, and it is obvious on
screen which cards are still waiting for artwork.
