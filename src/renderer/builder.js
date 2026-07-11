"use strict";

/*
 * Builder — the live pet customizer (the Uchinoko-Maker-style step).
 *
 * It reads the parts catalogue straight from pet-kit (OPTIONS / palettes), so
 * adding a new ear style or coat colour in the engine automatically shows up
 * here — no UI wiring per part. Every change re-renders the preview and pushes
 * the DNA to the desktop pet live.
 */

const R = window.PixllPet;
const K = window.PixllKit;

// Working state: name + DNA genome.
let cfg = { name: "Pixll", dna: K.defaults() };

const preview = document.getElementById("preview");
const nameInput = document.getElementById("petName");
const panel = document.getElementById("panel");

// Pretty labels for raw option keys.
const LABELS = {
  species: "Animal",
  ears: "Ears",
  eyes: "Eyes",
  muzzle: "Muzzle",
  tail: "Tail",
  accessory: "Accessory",
};
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function renderPreview() {
  preview.innerHTML = R.renderSVG(cfg);
}

// Persist + push live to the desktop pet.
function commit() {
  window.pixll.saveConfig(cfg);
}

// A "pill" group for a categorical part (ears, eyes, tail, …).
function pillGroup(key) {
  const values = K.OPTIONS[key];
  const wrap = document.createElement("div");
  wrap.className = "group";
  wrap.innerHTML = `<h3>${LABELS[key] || cap(key)}</h3>`;
  const row = document.createElement("div");
  row.className = "pills";
  values.forEach((val) => {
    const b = document.createElement("button");
    b.className = "pill" + (cfg.dna[key] === val ? " selected" : "");
    b.textContent = cap(val);
    b.addEventListener("click", () => {
      cfg.dna[key] = val;
      row.querySelectorAll(".pill").forEach((p) => p.classList.remove("selected"));
      b.classList.add("selected");
      renderPreview();
      commit();
    });
    row.appendChild(b);
  });
  wrap.appendChild(row);
  return wrap;
}

// Coat palette: each chip sets coat + patch together.
function coatGroup() {
  const wrap = document.createElement("div");
  wrap.className = "group";
  wrap.innerHTML = `<h3>Coat</h3>`;
  const row = document.createElement("div");
  row.className = "palettes";
  K.COAT_PALETTE.forEach((p) => {
    const chip = document.createElement("button");
    const on = cfg.dna.coat === p.coat && cfg.dna.patch === p.patch;
    chip.className = "palette" + (on ? " selected" : "");
    chip.title = p.name;
    chip.innerHTML = `<span style="background:${p.coat}"></span><span style="background:${p.patch}"></span>`;
    chip.addEventListener("click", () => {
      cfg.dna.coat = p.coat;
      cfg.dna.patch = p.patch;
      row.querySelectorAll(".palette").forEach((c) => c.classList.remove("selected"));
      chip.classList.add("selected");
      syncColorInputs();
      renderPreview();
      commit();
    });
    row.appendChild(chip);
  });
  wrap.appendChild(row);

  // fine-tune colour pickers
  const fine = document.createElement("div");
  fine.className = "colors";
  fine.innerHTML = `
    <label>Fur <input type="color" id="coatColor" value="${cfg.dna.coat}"></label>
    <label>Belly <input type="color" id="patchColor" value="${cfg.dna.patch}"></label>`;
  wrap.appendChild(fine);
  return wrap;
}

// Accent (accessory colour) dots.
function accentGroup() {
  const wrap = document.createElement("div");
  wrap.className = "group";
  wrap.innerHTML = `<h3>Accessory colour</h3>`;
  const row = document.createElement("div");
  row.className = "dots";
  K.ACCENT_PALETTE.forEach((col) => {
    const dot = document.createElement("button");
    dot.className = "dot" + (cfg.dna.accent === col ? " selected" : "");
    dot.style.background = col;
    dot.addEventListener("click", () => {
      cfg.dna.accent = col;
      row.querySelectorAll(".dot").forEach((d) => d.classList.remove("selected"));
      dot.classList.add("selected");
      renderPreview();
      commit();
    });
    row.appendChild(dot);
  });
  wrap.appendChild(row);
  return wrap;
}

// Blush toggle.
function blushGroup() {
  const wrap = document.createElement("div");
  wrap.className = "group";
  const b = document.createElement("button");
  b.className = "pill toggle" + (cfg.dna.blush ? " selected" : "");
  b.textContent = cfg.dna.blush ? "Rosy cheeks: on" : "Rosy cheeks: off";
  b.addEventListener("click", () => {
    cfg.dna.blush = !cfg.dna.blush;
    b.classList.toggle("selected", cfg.dna.blush);
    b.textContent = cfg.dna.blush ? "Rosy cheeks: on" : "Rosy cheeks: off";
    renderPreview();
    commit();
  });
  wrap.appendChild(b);
  return wrap;
}

// Keep the fine-tune colour pickers in sync when a palette is chosen.
function syncColorInputs() {
  const c = document.getElementById("coatColor");
  const p = document.getElementById("patchColor");
  if (c) c.value = cfg.dna.coat;
  if (p) p.value = cfg.dna.patch;
}

function buildPanel() {
  panel.innerHTML = "";
  panel.appendChild(pillGroup("species"));
  panel.appendChild(coatGroup());
  panel.appendChild(pillGroup("ears"));
  panel.appendChild(pillGroup("eyes"));
  panel.appendChild(pillGroup("muzzle"));
  panel.appendChild(pillGroup("tail"));
  panel.appendChild(pillGroup("accessory"));
  panel.appendChild(accentGroup());
  panel.appendChild(blushGroup());

  // live colour pickers (delegated after DOM exists)
  panel.querySelector("#coatColor").addEventListener("input", (e) => {
    cfg.dna.coat = e.target.value;
    clearPaletteSelection();
    renderPreview();
    commit();
  });
  panel.querySelector("#patchColor").addEventListener("input", (e) => {
    cfg.dna.patch = e.target.value;
    clearPaletteSelection();
    renderPreview();
    commit();
  });
}

function clearPaletteSelection() {
  panel.querySelectorAll(".palette").forEach((c) => c.classList.remove("selected"));
}

// ---- name + actions -------------------------------------------------------
nameInput.addEventListener("input", () => {
  cfg.name = nameInput.value.trim() || "Pixll";
  commit();
});

document.getElementById("bring").addEventListener("click", () => {
  cfg.name = nameInput.value.trim() || "Pixll";
  window.pixll.bringToDesktop(cfg);
});

document.getElementById("randomize").addEventListener("click", () => {
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const coat = pick(K.COAT_PALETTE);
  cfg.dna = {
    species: pick(K.OPTIONS.species),
    coat: coat.coat,
    patch: coat.patch,
    ears: pick(K.OPTIONS.ears),
    eyes: pick(K.OPTIONS.eyes),
    muzzle: pick(K.OPTIONS.muzzle),
    tail: pick(K.OPTIONS.tail),
    accessory: pick(K.OPTIONS.accessory),
    accent: pick(K.ACCENT_PALETTE),
    blush: Math.random() > 0.3,
  };
  buildPanel();
  renderPreview();
  commit();
});

// ---- init -----------------------------------------------------------------
(async function init() {
  try {
    const store = await window.pixll.getConfig();
    if (store && store.pet) {
      if (store.pet.name) {
        cfg.name = store.pet.name;
        nameInput.value = cfg.name === "Pixll" ? "" : cfg.name;
      }
      if (store.pet.dna) cfg.dna = K.normalize(store.pet.dna);
    }
  } catch (_e) { /* defaults */ }
  buildPanel();
  renderPreview();
})();
