"use strict";

// The floating desktop pet: render, drag, tap-to-talk, gentle reminders.

const R = window.PixllPet;
const M = window.PixllMessages;

const petEl = document.getElementById("pet");
const bubbleEl = document.getElementById("bubble");
const closeBtn = document.getElementById("closeBtn");

// Put the pet away anytime — hides her (re-open from the 🐶 menu-bar icon).
// stopPropagation so it isn't read as a drag/tap.
closeBtn.addEventListener("mousedown", (e) => e.stopPropagation());
closeBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  window.pixll.hidePet();
});

let cfg = { name: "Pixll" };
let settings = { remindersEnabled: true, reminderIntervalMin: 45 };

// Render the plain (pixel-perfect) art.
function render() {
  petEl.innerHTML = R.renderSVG();
}

// ---- speech bubble --------------------------------------------------------
let bubbleTimer = null;
function say(text) {
  bubbleEl.textContent = text;
  bubbleEl.classList.add("show");
  clearTimeout(bubbleTimer);
  bubbleTimer = setTimeout(() => bubbleEl.classList.remove("show"), 3800);
}

// ---- tap vs drag ----------------------------------------------------------
// Frameless transparent window: we move it ourselves so we can tell a click
// (talk) apart from a drag (reposition).
let dragging = false;
let moved = false;
let winStart = null; // {x, y} window position at mousedown
let mouseStart = null; // {x, y} screen coords at mousedown

document.body.addEventListener("mousedown", async (e) => {
  if (e.button !== 0) return; // left only
  dragging = true;
  moved = false;
  mouseStart = { x: e.screenX, y: e.screenY };
  const b = await window.pixll.getPetBounds();
  winStart = { x: b.x, y: b.y };
});

window.addEventListener("mousemove", (e) => {
  if (!dragging || !winStart) return;
  const dx = e.screenX - mouseStart.x;
  const dy = e.screenY - mouseStart.y;
  if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
  if (moved) window.pixll.setPetPos(winStart.x + dx, winStart.y + dy);
});

window.addEventListener("mouseup", (e) => {
  if (!dragging) return;
  dragging = false;
  if (moved && winStart) {
    const dx = e.screenX - mouseStart.x;
    const dy = e.screenY - mouseStart.y;
    window.pixll.savePetPos(winStart.x + dx, winStart.y + dy);
  } else {
    // a tap → a gentle bounce + say a line
    petEl.classList.remove("poke");
    void petEl.offsetWidth; // restart the animation
    petEl.classList.add("poke");
    say(M.tapLine());
  }
});

// right-click → native context menu (edit / reminders / quit)
window.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  window.pixll.showPetMenu();
});

// ---- gentle reminders -----------------------------------------------------
let reminderTimer = null;
function scheduleReminder() {
  clearTimeout(reminderTimer);
  if (!settings.remindersEnabled) return;
  const mins = Math.max(5, settings.reminderIntervalMin || 45);
  // jitter ±25% so it never feels mechanical
  const base = mins * 60 * 1000;
  const jitter = base * (Math.random() * 0.5 - 0.25);
  reminderTimer = setTimeout(() => {
    if (settings.remindersEnabled) say(M.reminderLine());
    scheduleReminder();
  }, base + jitter);
}

// ---- live updates from builder / menu -------------------------------------
window.pixll.onPetUpdate((pet) => {
  cfg = Object.assign(cfg, pet || {});
  render();
});
window.pixll.onSettingsUpdate((s) => {
  settings = Object.assign(settings, s || {});
  scheduleReminder();
});

// ---- init -----------------------------------------------------------------
(async function init() {
  try {
    const store = await window.pixll.getConfig();
    if (store) {
      if (store.pet) cfg = Object.assign(cfg, store.pet);
      if (store.settings) settings = Object.assign(settings, store.settings);
    }
  } catch (_e) { /* defaults */ }
  render();
  scheduleReminder();
  // a soft hello shortly after appearing
  setTimeout(() => say(M.pick(["hi! i'm here 🌱", "brought me out! 💛", "hello 🌼"])), 700);
})();
