"use strict";
// Capture the real builder.html offscreen to verify the UI renders.
const { app, BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs");

app.disableHardwareAcceleration();
app.whenReady().then(async () => {
  const win = new BrowserWindow({ width: 980, height: 660, show: false, webPreferences: { offscreen: true } });
  await win.loadFile(path.join(__dirname, "..", "src", "renderer", "builder.html"));
  await new Promise((r) => setTimeout(r, 800));
  const img = await win.webContents.capturePage();
  fs.writeFileSync(path.join(__dirname, "builder.png"), img.toPNG());
  console.log("wrote tools/builder.png");
  app.quit();
});
