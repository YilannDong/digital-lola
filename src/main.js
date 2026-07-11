"use strict";

const { app, BrowserWindow, ipcMain, Menu, Tray, nativeImage, screen } = require("electron");
const path = require("path");
const fs = require("fs");

// --------------------------------------------------------------------------
// Persistence — one tiny JSON file in the OS user-data dir.
// --------------------------------------------------------------------------
let CONFIG_PATH = null; // set once app is ready (needs app.getPath)

function defaultStore() {
  return {
    onboarded: false,
    // pet.dna is the customizable "genome" (see shared/pet-kit.js). null = the
    // legacy Lola artwork; any DNA object switches to the parametric pet.
    pet: { name: "Pixll", dna: null },
    petPosition: null, // {x, y} of the pet window; null = bottom-right corner
    settings: { remindersEnabled: true, reminderIntervalMin: 45 },
  };
}

function loadStore() {
  try {
    const raw = fs.readFileSync(CONFIG_PATH, "utf8");
    const parsed = JSON.parse(raw);
    const base = defaultStore();
    return {
      onboarded: !!parsed.onboarded,
      pet: Object.assign(base.pet, parsed.pet || {}),
      petPosition: parsed.petPosition || null,
      settings: Object.assign(base.settings, parsed.settings || {}),
    };
  } catch (_e) {
    return defaultStore();
  }
}

function saveStore(store) {
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(store, null, 2), "utf8");
  } catch (e) {
    console.error("Pixll: failed to save config", e);
  }
}

let store = null;

// --------------------------------------------------------------------------
// Windows
// --------------------------------------------------------------------------
let builderWin = null;
let petWin = null;
let tray = null;

// Half the previous on-screen size. The window is wider than the pet (bubble
// room) and taller than the pet (the speech bubble sits fully above the dog).
// The pet itself is ~145px (was ~290px).
const PET_W = 180;
const PET_H = 205;

function createBuilderWindow() {
  if (builderWin && !builderWin.isDestroyed()) {
    builderWin.focus();
    return;
  }
  builderWin = new BrowserWindow({
    width: 900,
    height: 640,
    minWidth: 760,
    minHeight: 560,
    title: "Pixll",
    backgroundColor: "#fbf6ef",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  builderWin.loadFile(path.join(__dirname, "renderer", "builder.html"));
  builderWin.on("closed", () => {
    builderWin = null;
  });
}

function defaultPetPosition() {
  const { workArea } = screen.getPrimaryDisplay();
  return {
    x: workArea.x + workArea.width - PET_W - 24,
    y: workArea.y + workArea.height - PET_H - 24,
  };
}

function createPetWindow() {
  if (petWin && !petWin.isDestroyed()) {
    petWin.show();
    petWin.focus();
    return;
  }
  const pos = store.petPosition || defaultPetPosition();
  petWin = new BrowserWindow({
    width: PET_W,
    height: PET_H,
    x: pos.x,
    y: pos.y,
    frame: false,
    transparent: true,
    resizable: false,
    hasShadow: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    fullscreenable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  petWin.setAlwaysOnTop(true, "floating");
  petWin.loadFile(path.join(__dirname, "renderer", "pet.html"));
  petWin.on("closed", () => {
    petWin = null;
    updateTray();
  });
  petWin.on("show", updateTray);
  petWin.on("hide", updateTray);
}

// --------------------------------------------------------------------------
// Show / hide the pet (used by the tray, the × button, and the menu)
// --------------------------------------------------------------------------
function petIsVisible() {
  return !!(petWin && !petWin.isDestroyed() && petWin.isVisible());
}
function showPet() {
  if (petWin && !petWin.isDestroyed()) {
    petWin.show();
  } else {
    createPetWindow();
  }
  if (!store.onboarded) { store.onboarded = true; saveStore(store); }
  updateTray();
}
function hidePet() {
  if (petWin && !petWin.isDestroyed()) petWin.hide();
  updateTray();
}
function togglePet() {
  if (petIsVisible()) hidePet();
  else showPet();
}

// --------------------------------------------------------------------------
// Menu-bar (tray) — the easy way to show / hide / quit
// --------------------------------------------------------------------------
function trayTemplate() {
  const name = (store.pet && store.pet.name) || "Pixll";
  return Menu.buildFromTemplate([
    { label: petIsVisible() ? `Hide ${name}` : `Show ${name}`, click: () => togglePet() },
    { label: "Rename…", click: () => createBuilderWindow() },
    {
      label: "Gentle reminders",
      type: "checkbox",
      checked: store.settings.remindersEnabled,
      click: (item) => {
        store.settings.remindersEnabled = item.checked;
        saveStore(store);
        if (petWin && !petWin.isDestroyed()) petWin.webContents.send("settings:update", store.settings);
      },
    },
    { type: "separator" },
    { label: "Quit Pixll", click: () => app.quit() },
  ]);
}
function updateTray() {
  if (!tray || tray.isDestroyed()) return;
  tray.setToolTip(petIsVisible() ? "Pixll — click to hide Lola" : "Pixll — click to bring Lola back");
}
function createTray() {
  tray = new Tray(nativeImage.createEmpty());
  tray.setTitle(" 🐶"); // menu-bar label (macOS)
  updateTray();
  // Left-click the menu-bar icon: instantly show/hide her. Right-click: menu.
  tray.on("click", () => togglePet());
  tray.on("right-click", () => tray.popUpContextMenu(trayTemplate()));
}

// --------------------------------------------------------------------------
// Context menu (right-click the pet)
// --------------------------------------------------------------------------
function showPetMenu() {
  const menu = Menu.buildFromTemplate([
    {
      label: "Rename…",
      click: () => createBuilderWindow(),
    },
    {
      label: "Gentle reminders",
      type: "checkbox",
      checked: store.settings.remindersEnabled,
      click: (item) => {
        store.settings.remindersEnabled = item.checked;
        saveStore(store);
        if (petWin && !petWin.isDestroyed()) petWin.webContents.send("settings:update", store.settings);
      },
    },
    { type: "separator" },
    { label: "Put away (find me in the menu bar 🐶)", click: () => hidePet() },
    { label: "Quit Pixll", click: () => app.quit() },
  ]);
  menu.popup({ window: petWin });
}

// --------------------------------------------------------------------------
// IPC
// --------------------------------------------------------------------------
ipcMain.handle("config:get", () => store);

ipcMain.handle("pet:getBounds", () => {
  if (petWin && !petWin.isDestroyed()) return petWin.getBounds();
  return { x: 0, y: 0, width: PET_W, height: PET_H };
});

ipcMain.on("config:save", (_e, pet) => {
  store.pet = Object.assign(store.pet, pet || {});
  saveStore(store);
  if (petWin && !petWin.isDestroyed()) petWin.webContents.send("pet:update", store.pet);
});

ipcMain.on("settings:save", (_e, settings) => {
  store.settings = Object.assign(store.settings, settings || {});
  saveStore(store);
  if (petWin && !petWin.isDestroyed()) petWin.webContents.send("settings:update", store.settings);
});

ipcMain.on("pet:bring", (_e, pet) => {
  if (pet) store.pet = Object.assign(store.pet, pet);
  store.onboarded = true;
  saveStore(store);
  showPet();
  if (builderWin && !builderWin.isDestroyed()) builderWin.hide();
});

ipcMain.on("pet:hide", () => hidePet());

ipcMain.on("pet:setPos", (_e, x, y) => {
  if (petWin && !petWin.isDestroyed()) petWin.setPosition(Math.round(x), Math.round(y));
});

ipcMain.on("pet:savePos", (_e, x, y) => {
  store.petPosition = { x: Math.round(x), y: Math.round(y) };
  saveStore(store);
});

ipcMain.on("pet:menu", () => showPetMenu());

ipcMain.on("builder:open", () => createBuilderWindow());

ipcMain.on("app:quit", () => app.quit());

// --------------------------------------------------------------------------
// Lifecycle
// --------------------------------------------------------------------------
app.whenReady().then(() => {
  CONFIG_PATH = path.join(app.getPath("userData"), "pixll-config.json");
  store = loadStore();

  createTray();

  if (store.onboarded) {
    createPetWindow();
  } else {
    createBuilderWindow();
  }
  updateTray();

  // Clicking the Dock icon brings Lola back too.
  app.on("activate", () => {
    if (store.onboarded) showPet();
    else createBuilderWindow();
  });
});

// The tray keeps Pixll alive in the menu bar even when the pet is hidden or the
// builder is closed — so the user can bring her back anytime. Never auto-quit.
app.on("window-all-closed", () => {
  /* stay resident in the menu bar; quit only via the tray's "Quit Pixll" */
});
