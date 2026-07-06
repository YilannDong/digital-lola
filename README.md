<div align="center">

# 🐶 Pixll — Lola, your desktop companion

<img src="docs/lola.png" alt="Lola the corgi" width="420" />

**A quiet little friend who rests in the corner of your screen — keeping you company, and gently nudging you when it's getting late.**

</div>

---

Pixll is a tiny [Electron](https://www.electronjs.org/) desktop pet. The character, **Lola**, is a frameless, transparent, always-on-top window that sits wherever you leave her. She isn't a game or a busy animation — she's calm company that reacts when you say hello.

## Features

- 🖼️ **Transparent, frameless, always-on-top** — Lola floats over your desktop with no window chrome.
- 🖱️ **Drag to move & she remembers** — put her anywhere; she returns to that spot next time.
- 👋 **Click to say hi** — a gentle bounce and a warm one-line message.
- 🌙 **Gentle reminders** — occasional low-key nudges (water, stretch, and a wind-down reminder late at night). Never naggy, never a system popup.
- 🐶 **Menu-bar control** — a one-click icon in the macOS menu bar to show/hide her; clicking the Dock icon brings her back too.
- ✖️ **Put her away anytime** — the × on the pet (or right-click → Put away) tucks her into the menu bar; she's one click from returning.

## Screenshots

| On your desktop | The menu-bar & controls |
| --- | --- |
| <img src="docs/lola.png" width="320" /> | Left-click the **🐶** in the menu bar to show/hide Lola. Right-click for Rename, reminders on/off, and Quit. |

## Run it

Requires [Node.js](https://nodejs.org/) (LTS). From the project root:

```bash
npm install      # installs Electron
npm start        # launches Pixll
```

On first launch you'll see a small "Bring to desktop" screen — name her and send her to the corner. After that she comes straight back each time.

## How it's built

Everything is plain HTML/CSS/JS in the Electron renderer — no build step, no framework.

```
src/
  main.js              Electron main: windows, tray, persistence, reminders
  preload.js           safe IPC bridge (contextBridge)
  renderer/
    builder.html/.js/.css   the "name her & place her" screen
    pet.html/.js/.css       the floating pet: drag, click, bubble, close
  shared/
    lola.js            Lola's artwork (an SVG), embedded verbatim
    lola-fill.js       a white backing that fills enclosed gaps in the trace
    pet-render.js       composes the artwork for rendering
    messages.js         the gentle one-liners she says
tools/                 offscreen render/proofing scripts (Electron headless)
docs/                  images for this README
```

The pet is drawn from a single SVG, rendered with a **transparent background** so nothing but Lola shows on your desktop.

## Swap in your own character

Lola is just an SVG. To use a different character:

1. Drop your artwork at `~/Downloads/lola.svg`.
2. Regenerate the embedded asset and hole-fill backing:
   ```bash
   node tools/embed-lola.cjs   # bakes the SVG into src/shared/lola.js
   node tools/make-fill.cjs    # fills any enclosed transparent gaps
   ```

A **layered** SVG (parts as separate groups) also opens the door to richer per-part animation.

## License

[MIT](LICENSE) © 2026 Yilan Dong
