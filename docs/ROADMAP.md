# Pixll — Product Roadmap

**Vision:** a paid platform where anyone designs *their own* pet (à la
[Uchinoko Maker](https://uchinoko-maker.jp/?lang=en-US)) and that pet then
**lives on their desktop** — and eventually syncs across every device they own.

The whole system revolves around one small portable object, the **pet DNA**:

```json
{
  "species": "dog",
  "coat": "#e8a05c",
  "patch": "#fff3e2",
  "ears": "perky",
  "eyes": "round",
  "muzzle": "short",
  "tail": "curl",
  "accessory": "collar",
  "accent": "#f2a65a",
  "blush": true
}
```

The same DNA drives the builder preview, the desktop pet, and (later) the web
customizer and cloud sync. Get the DNA right and everything else is plumbing.

---

## The four layers

| Layer | What it is | Status |
|---|---|---|
| **1. Customizer** | Design a pet from swappable parts → outputs DNA | ✅ In-app builder shipped; web version pending |
| **2. Accounts + payment** | Sign in, pay to adopt / unlock premium parts | ⬜ Not started |
| **3. Desktop companion** | Electron app renders the user's DNA, cross-platform | ✅ Renders DNA; needs login + Win/Linux builds |
| **4. Sync glue** | Same pet on any machine; store purchases update it | ⬜ Not started |

---

## Phase 0 — Parametric foundation ✅ (done)

The unlock: pets are no longer a single hardcoded SVG.

- `shared/pet-kit.js` — the **genome → art** engine. Renders a layered,
  recolourable SVG from a DNA object. Parts: species, ears, eyes, muzzle,
  tail, accessory; colours: coat, belly, accent; toggle: blush.
- `shared/pet-render.js` — render seam: DNA → pet-kit, empty → legacy Lola.
- `renderer/builder.*` — **live customizer** reading the parts catalogue
  straight from the engine. Change a part → preview + desktop pet update live.
- DNA persists in the user-data store and rides through to the pet window.

> Why this first: no customization, monetization, or "gacha accessory" model is
> possible until the art is parts-based. Everything below depends on it.

## Phase 1 — Customizer MVP (web)

Take the in-app builder to the browser as the top-of-funnel — **zero install**,
anyone can play.

- [ ] Port `pet-kit.js` + builder to a standalone web page (it's already
      framework-free and browser-safe, so this is mostly layout).
- [ ] "Copy pet code" — encode the DNA (e.g. base64 / short slug).
- [ ] Desktop app gains a **"Paste pet code"** screen to import that DNA.
- [ ] Expand the parts bin: more breeds, patterns, outfits, seasonal items.

## Phase 2 — Commerce

- [ ] Accounts (email / OAuth) + a tiny backend that stores each user's DNA.
- [ ] **Stripe Checkout**. Recommended launch model: **one-time "adopt"**
      (unlock desktop download + keep your pet) **+ premium accessory packs**.
- [ ] Free to *design*, pay to *adopt* — the design step is the hook.
- [ ] Signed, notarized builds for **macOS + Windows + Linux**
      ("lives on other desktops").

## Phase 3 — Sync + depth

- [ ] Cloud sync: log in on any machine → your pet appears.
- [ ] Store purchases (outfits, animations) push to the live desktop pet.
- [ ] Per-part animation (the layered rig makes tail-wags / ear-flicks real).
- [ ] Seasonal drops, multiple pets, share links.

---

## Monetization options

| Model | How it works | Notes |
|---|---|---|
| **One-time adopt** | Pay once to unlock the desktop pet | Simplest launch; recommended first |
| **Freemium parts** | Free base pet, pay for premium breeds/outfits | Recurring revenue, most "collectible" |
| **Subscription** | Monthly for sync + seasonal content | Highest LTV, hardest to justify early |

**Recommended:** launch with *one-time adopt + a few premium accessory packs*,
add subscription only once there's a steady stream of new content.

---

## Notes / decisions still open

- **Art scale:** the procedural style keeps every new part cheap. A hand-drawn
  / illustrated style would look richer but makes each new part expensive —
  decide before expanding the parts bin.
- **"Recreate my real pet" vs "design a cute pet":** Uchinoko Maker leans on
  *matching your actual pet*. Deeper part granularity (face shape, markings,
  proportions) moves toward that; the current set leans "design a cute one."
- **Photo → pet:** a future "upload a photo, we suggest a starting DNA" step
  (ML-assisted) would be the strongest hook but is a larger build.
