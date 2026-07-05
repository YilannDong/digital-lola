"use strict";
// Render Lola over dark bg at 1:1 (viewBox units = px) with a coordinate grid,
// to locate transparent holes precisely. Optionally overlay a candidate patch
// module (tools/patch-test.js exporting an SVG fragment string) UNDER the art.
const { app, BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs");
require("../src/shared/lola.js");
require("../src/shared/lola-fill.js");
let svg = require("../src/shared/pet-render.js").renderSVG();

// grid lines + labels every 100 units, over a 1000x849 viewBox
let grid = "";
for (let x = 0; x <= 1000; x += 100) {
  grid += `<line x1="${x}" y1="0" x2="${x}" y2="849" stroke="rgba(255,255,255,.35)" stroke-width="1"/><text x="${x + 2}" y="14" fill="#fff" font-size="13">${x}</text>`;
}
for (let y = 0; y <= 849; y += 100) {
  grid += `<line x1="0" y1="${y}" x2="1000" y2="${y}" stroke="rgba(255,255,255,.35)" stroke-width="1"/><text x="2" y="${y + 14}" fill="#fff" font-size="13">${y}</text>`;
}

app.disableHardwareAcceleration();
app.whenReady().then(async () => {
  const win = new BrowserWindow({ width: 1020, height: 872, show: false, webPreferences: { offscreen: true } });
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    body{margin:0;background:#1f5c34}
    .stack{position:relative;width:1000px;height:849px}
    .stack svg{position:absolute;top:0;left:0;width:1000px;height:849px}
  </style></head><body><div class="stack">${svg}
    <svg viewBox="0 0 1000 849" xmlns="http://www.w3.org/2000/svg">${grid}</svg>
  </div></body></html>`;
  await win.loadURL("data:text/html;charset=utf-8," + encodeURIComponent(html));
  await new Promise((r) => setTimeout(r, 500));
  const img = await win.webContents.capturePage();
  fs.writeFileSync(path.join(__dirname, "holes.png"), img.toPNG());
  console.log("wrote tools/holes.png" + (patch ? " (with patch)" : ""));
  app.quit();
});
