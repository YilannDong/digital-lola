<div align="center">

<img src="docs/lola.png" alt="Lola the corgi" width="440" />

# 🐶 Pixll — meet Lola

### the little corgi who lives in the corner of your screen

*Not a game. Not a chatbot. Just calm company while you work —*
*and a gentle nudge when it's getting late.* 🌙

<br/>

![Electron](https://img.shields.io/badge/Electron-2B2E3A?logo=electron&logoColor=9FEAF9)
![Platform](https://img.shields.io/badge/macOS-000000?logo=apple&logoColor=white)
![No build step](https://img.shields.io/badge/build%20step-none-brightgreen)
![License: MIT](https://img.shields.io/badge/License-MIT-f4d64e)

</div>

---

## 👋 Say hi to Lola

Lola is a **frameless, transparent, always-on-top** desktop pet. She sits wherever you leave her, breathes softly, and reacts when you say hello. No windows, no clutter — just a friend in the corner.

<div align="center">
<img src="docs/lola.png" alt="Lola" width="240" />
</div>

## ✨ What she does

| | |
|---|---|
| 🖼️ **Floats on your desktop** | Transparent, borderless, always on top — only Lola shows, nothing else. |
| 🖱️ **Drag her anywhere** | Move her to your favorite corner — she remembers the spot next time. |
| 👋 **Click to say hi** | A little bounce and a warm one-liner. |
| 🌙 **Gentle reminders** | Low-key nudges to sip water, stretch, and wind down late at night — never a naggy system popup. |
| 🐶 **One-click menu-bar toggle** | Tuck her away with the **×**, bring her back from the **🐶** in your menu bar (or the Dock icon). |

## 🚀 Get Lola running

You'll need [Node.js](https://nodejs.org/) (LTS). Then:

```bash
git clone https://github.com/YilannDong/digital-lola.git
cd digital-lola
npm install     # grabs Electron
npm start       # 🐶 Lola appears!
```

On first launch, name her and hit **"Bring to desktop."** After that she comes right back every time — and lives quietly in your menu bar.

## 🎨 Build your own pet

Open the builder and **design a pet from parts** — the Uchinoko-Maker way. Pick the animal, coat colour, ears, eyes, muzzle, tail and an accessory, and the preview updates live. Hit **Bring to desktop** and *your* pet moves in.

Every pet is just a tiny **"DNA"** object:

```js
{ species: "dog", coat: "#e8a05c", patch: "#fff3e2",
  ears: "perky", eyes: "round", muzzle: "short",
  tail: "curl", accessory: "collar", accent: "#f2a65a", blush: true }
```

The parametric engine (`shared/pet-kit.js`) turns that DNA into a layered SVG — so parts swap and colours recolour with zero new art. Add an option in the engine and it shows up in the builder automatically. This is the foundation the customization platform is built on (see [`docs/ROADMAP.md`](docs/ROADMAP.md)).

> 💛 Prefer the original hand-drawn corgi? Leave the DNA empty and Lola shows up as the fallback.

## 🧩 Under the hood

Plain HTML/CSS/JS in Electron — **no framework, no build step.**

```
src/
├─ main.js            windows · menu-bar tray · saving · reminders
├─ preload.js         safe IPC bridge
├─ renderer/
│  ├─ pet.*           the floating pet: drag · click · bubble · close
│  └─ builder.*       the live pet customizer (parts + colours)
└─ shared/
   ├─ pet-kit.js      ⭐ parametric engine: pet DNA → layered SVG
   ├─ pet-render.js   render seam: DNA → pet-kit, else legacy Lola
   ├─ lola.js         Lola's original artwork (fallback SVG)
   ├─ lola-fill.js    white backing that fills gaps in the trace
   └─ messages.js     the gentle things she says
```

## 💛 License

[MIT](LICENSE) © 2026 Yilan Dong — go make your own desktop friend.

<div align="center">
<br/>
<sub>Built with Electron · a tiny bit of magic · and one very good dog.</sub>
</div>
