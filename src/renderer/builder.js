"use strict";

// Builder screen — the character is fixed (Lola), so this is just: show her,
// name her, and send her to the desktop.

const R = window.PixllPet;

let cfg = { name: "Pixll" };

const preview = document.getElementById("preview");
const nameInput = document.getElementById("petName");

function renderPreview() {
  preview.innerHTML = R.renderSVG(cfg);
}

nameInput.addEventListener("input", () => {
  cfg.name = nameInput.value.trim() || "Pixll";
  window.pixll.saveConfig(cfg);
});

document.getElementById("bring").addEventListener("click", () => {
  cfg.name = nameInput.value.trim() || "Pixll";
  window.pixll.bringToDesktop(cfg);
});

(async function init() {
  try {
    const store = await window.pixll.getConfig();
    if (store && store.pet && store.pet.name) {
      cfg.name = store.pet.name;
      nameInput.value = cfg.name === "Pixll" ? "" : cfg.name;
    }
  } catch (_e) { /* defaults */ }
  renderPreview();
})();
