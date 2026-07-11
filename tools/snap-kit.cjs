"use strict";
// Render a grid of pet-kit variants to tools/kit.png to eyeball the art.
const { app, BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs");
const K = require("../src/shared/pet-kit.js");

const variants = [
  { label: "default", dna: {} },
  { label: "cat/sleepy/scarf", dna: { species: "cat", eyes: "sleepy", accessory: "scarf", coat: "#8aa0c0", patch: "#eef3fb", accent: "#e06f6f" } },
  { label: "bunny/sparkle/bow", dna: { species: "bunny", eyes: "sparkle", accessory: "bow", coat: "#e0a3a0", patch: "#fff0ee", accent: "#b98fe0", tail: "fluffy" } },
  { label: "floppy/cocoa/long", dna: { ears: "floppy", coat: "#8a5a3b", patch: "#f3e4d3", muzzle: "long", tail: "fluffy", accessory: "none" } },
  { label: "folded/ink/stub", dna: { ears: "folded", coat: "#3f3a44", patch: "#d9d3de", tail: "stub", eyes: "sparkle", accessory: "collar", accent: "#f4c542" } },
  { label: "mint/perky", dna: { coat: "#8fc6ac", patch: "#f0fbf5", accent: "#7bc47f" } },
];

app.disableHardwareAcceleration();
app.whenReady().then(async () => {
  const win = new BrowserWindow({ width: 720, height: 520, show: false, webPreferences: { offscreen: true } });
  const cells = variants.map((v) => `
    <div class="cell">
      <div class="art">${K.renderSVG(v.dna)}</div>
      <div class="lbl">${v.label}</div>
    </div>`).join("");
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    body{margin:0;background:#fbf6ef;font-family:system-ui}
    .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:12px}
    .cell{background:#fff;border-radius:12px;padding:6px;text-align:center;box-shadow:0 4px 10px rgba(0,0,0,.06)}
    .art svg{width:150px;height:auto}
    .lbl{font-size:11px;color:#8a7f74;margin-top:2px}
  </style></head><body><div class="grid">${cells}</div></body></html>`;
  await win.loadURL("data:text/html;charset=utf-8," + encodeURIComponent(html));
  await new Promise((r) => setTimeout(r, 500));
  const img = await win.webContents.capturePage();
  fs.writeFileSync(path.join(__dirname, "kit.png"), img.toPNG());
  console.log("wrote tools/kit.png");
  app.quit();
});
