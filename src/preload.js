"use strict";

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("pixll", {
  // config
  getConfig: () => ipcRenderer.invoke("config:get"),
  saveConfig: (pet) => ipcRenderer.send("config:save", pet),
  saveSettings: (settings) => ipcRenderer.send("settings:save", settings),
  bringToDesktop: (pet) => ipcRenderer.send("pet:bring", pet),

  // pet window control
  getPetBounds: () => ipcRenderer.invoke("pet:getBounds"),
  setPetPos: (x, y) => ipcRenderer.send("pet:setPos", x, y),
  savePetPos: (x, y) => ipcRenderer.send("pet:savePos", x, y),
  showPetMenu: () => ipcRenderer.send("pet:menu"),

  // app
  openBuilder: () => ipcRenderer.send("builder:open"),
  hidePet: () => ipcRenderer.send("pet:hide"),
  quit: () => ipcRenderer.send("app:quit"),

  // events pushed from main
  onPetUpdate: (cb) => ipcRenderer.on("pet:update", (_e, pet) => cb(pet)),
  onSettingsUpdate: (cb) => ipcRenderer.on("settings:update", (_e, s) => cb(s)),
});
