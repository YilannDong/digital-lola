"use strict";
// Capture the SMIL tail-wag mid-animation at live size (150px) AND large
// (500px) on dark bg — confirms the pivot is correct at small scale.
const { app, BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs");
require("../src/shared/lola.js");
require("../src/shared/lola-fill.js");
const wag = require("../src/shared/pet-render.js").renderSVG({ anim: "wag" });

app.disableHardwareAcceleration();
app.whenReady().then(async () => {
  const win = new BrowserWindow({ width: 720, height: 460, show: false, webPreferences: { offscreen: true } });
  const page = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    body{margin:0;background:#1f5c34;display:flex;align-items:flex-start}
    .small{width:150px;padding:12px}
    .big{width:500px;padding:12px}
  </style></head><body>
    <div class="small">${wag}</div>
    <div class="big">${wag}</div>
  </body></html>`;
  await win.loadURL("data:text/html;charset=utf-8," + encodeURIComponent(page));
  await new Promise((r) => setTimeout(r, 340)); // ~mid first DOWN-swing (-deg)
  const img = await win.webContents.capturePage();
  fs.writeFileSync(path.join(__dirname, "anim.png"), img.toPNG());
  console.log("wrote tools/anim.png (mid-wag @150px + 500px)");
  app.quit();
});
