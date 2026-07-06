"use strict";
// Render a clean hero image of Lola for the README -> docs/lola.png
const { app, BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs");
require("../src/shared/lola.js");
require("../src/shared/lola-fill.js");
const svg = require("../src/shared/pet-render.js").renderSVG();

app.disableHardwareAcceleration();
app.whenReady().then(async () => {
  const W = 720, H = 620;
  const win = new BrowserWindow({ width: W, height: H, show: false, webPreferences: { offscreen: true } });
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    html,body{margin:0}
    .bg{width:${W}px;height:${H}px;display:flex;align-items:center;justify-content:center;
        background:radial-gradient(120% 120% at 50% 30%, #fef6ea 0%, #f7e6d2 70%, #f0dcc2 100%)}
    .card{width:560px;filter:drop-shadow(0 18px 24px rgba(150,110,60,.22))}
    .card svg{width:100%;height:auto;display:block}
  </style></head><body><div class="bg"><div class="card">${svg}</div></div></body></html>`;
  await win.loadURL("data:text/html;charset=utf-8," + encodeURIComponent(html));
  await new Promise((r) => setTimeout(r, 500));
  const img = await win.webContents.capturePage();
  const dir = path.join(__dirname, "..", "docs");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "lola.png"), img.toPNG());
  console.log("wrote docs/lola.png");
  app.quit();
});
