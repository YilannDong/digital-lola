"use strict";
// Verify the on-desktop pet layout: real pet.css, real Lola art, at the real
// window size (180x165), with the close button + a bubble forced visible.
const { app, BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs");

const svg = require("../src/shared/lola.js").svg;
const css = fs.readFileSync(path.join(__dirname, "..", "src", "renderer", "pet.css"), "utf8");

app.disableHardwareAcceleration();
app.whenReady().then(async () => {
  const win = new BrowserWindow({ width: 180, height: 205, show: false, webPreferences: { offscreen: true } });
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    html,body{background:
      linear-gradient(45deg,#dcdcdc 25%,transparent 25%),
      linear-gradient(-45deg,#dcdcdc 25%,transparent 25%),
      linear-gradient(45deg,transparent 75%,#dcdcdc 75%),
      linear-gradient(-45deg,transparent 75%,#dcdcdc 75%);
      background-size:20px 20px;background-position:0 0,0 10px,10px -10px,-10px 0;background-color:#f6f6f6 !important}
    ${css}
    .close-btn{opacity:1 !important}
    .bubble{opacity:1 !important;transform:translateX(-50%) translateY(0) scale(1) !important}
  </style></head><body>
    <div class="stage">
      <button class="close-btn" title="Put away">×</button>
      <div class="bubble">it's getting late 🌙</div>
      <div class="pet">${svg}</div>
    </div>
  </body></html>`;
  await win.loadURL("data:text/html;charset=utf-8," + encodeURIComponent(html));
  await new Promise((r) => setTimeout(r, 500));
  const img = await win.webContents.capturePage();
  fs.writeFileSync(path.join(__dirname, "pet-layout.png"), img.toPNG());
  console.log("wrote tools/pet-layout.png");
  app.quit();
});
