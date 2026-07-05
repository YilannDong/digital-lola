"use strict";
// Render one big pet SVG (tools/art-test.js -> svg string) to tools/one.png
const { app, BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs");
const svg = require("./art-test.js");

app.disableHardwareAcceleration();
app.whenReady().then(async () => {
  const win = new BrowserWindow({ width: 480, height: 440, show: false, webPreferences: { offscreen: true } });
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    body{margin:0;background:
      linear-gradient(45deg,#dcdcdc 25%,transparent 25%),
      linear-gradient(-45deg,#dcdcdc 25%,transparent 25%),
      linear-gradient(45deg,transparent 75%,#dcdcdc 75%),
      linear-gradient(-45deg,transparent 75%,#dcdcdc 75%);
      background-size:24px 24px;background-position:0 0,0 12px,12px -12px,-12px 0;background-color:#f6f6f6}
    .wrap{padding:10px}.wrap svg{width:440px;height:auto;display:block}
  </style></head><body><div class="wrap">${svg}</div></body></html>`;
  await win.loadURL("data:text/html;charset=utf-8," + encodeURIComponent(html));
  await new Promise((r) => setTimeout(r, 500));
  const img = await win.webContents.capturePage();
  fs.writeFileSync(path.join(__dirname, "one.png"), img.toPNG());
  console.log("wrote tools/one.png");
  app.quit();
});
