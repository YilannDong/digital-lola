/*
 * Pixll — pet-kit: the "genome → art" engine.
 *
 * A pet is described by a tiny JSON "DNA" object. This module turns that DNA
 * into a layered, front-facing SVG built from simple procedural shapes — so
 * every part (ears, eyes, muzzle, tail, accessory) is swappable and every
 * colour is recolourable. This is the Uchinoko-Maker-style customization core:
 * the same DNA that drives the live builder preview also drives the desktop
 * pet, and (later) the web customizer + cloud sync.
 *
 * DNA schema (all fields optional; defaults below):
 *   {
 *     species:   "dog" | "cat" | "bunny",
 *     coat:      "#e8a05c",   // main fur colour
 *     patch:     "#fff3e2",   // belly / muzzle / blaze colour
 *     ears:      "perky" | "folded" | "floppy",
 *     eyes:      "round" | "sleepy" | "sparkle",
 *     muzzle:    "short" | "long",
 *     tail:      "curl" | "fluffy" | "stub",
 *     accessory: "none" | "collar" | "scarf" | "bow",
 *     accent:    "#f2a65a",   // accessory colour
 *     blush:     true
 *   }
 *
 * There is NO build step — plain shared module for both browser and Node.
 */
(function (root) {
  "use strict";

  // ---- option catalogues (the "parts bin" the customizer reads from) -------
  const OPTIONS = {
    species: ["dog", "cat", "bunny"],
    ears: ["perky", "folded", "floppy"],
    eyes: ["round", "sleepy", "sparkle"],
    muzzle: ["short", "long"],
    tail: ["curl", "fluffy", "stub"],
    accessory: ["none", "collar", "scarf", "bow"],
  };

  const COAT_PALETTE = [
    { name: "Corgi", coat: "#e8a05c", patch: "#fff3e2" },
    { name: "Cream", coat: "#f0d9b8", patch: "#fffaf2" },
    { name: "Charcoal", coat: "#6b6560", patch: "#e7e0d7" },
    { name: "Cocoa", coat: "#8a5a3b", patch: "#f3e4d3" },
    { name: "Rosé", coat: "#e0a3a0", patch: "#fff0ee" },
    { name: "Mint", coat: "#8fc6ac", patch: "#f0fbf5" },
    { name: "Slate", coat: "#8aa0c0", patch: "#eef3fb" },
    { name: "Ink", coat: "#3f3a44", patch: "#d9d3de" },
  ];

  const ACCENT_PALETTE = ["#f2a65a", "#e06f6f", "#6fa8e0", "#7bc47f", "#b98fe0", "#f4c542"];

  function defaults() {
    return {
      species: "dog",
      coat: "#e8a05c",
      patch: "#fff3e2",
      ears: "perky",
      eyes: "round",
      muzzle: "short",
      tail: "curl",
      accessory: "collar",
      accent: "#f2a65a",
      blush: true,
    };
  }

  function normalize(dna) {
    return Object.assign(defaults(), dna || {});
  }

  // ---- colour helpers ------------------------------------------------------
  function clamp(n) { return Math.max(0, Math.min(255, n)); }
  function hexToRgb(hex) {
    const h = String(hex || "#000000").replace("#", "");
    const s = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
  }
  function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map((n) => clamp(Math.round(n)).toString(16).padStart(2, "0")).join("");
  }
  // shade < 0 darkens, > 0 lightens (fraction toward black/white)
  function shade(hex, amt) {
    const [r, g, b] = hexToRgb(hex);
    if (amt < 0) {
      const k = 1 + amt;
      return rgbToHex(r * k, g * k, b * k);
    }
    return rgbToHex(r + (255 - r) * amt, g + (255 - g) * amt, b + (255 - b) * amt);
  }

  // ---- part builders -------------------------------------------------------
  // Canvas is a 200 x 210 viewBox, pet centred on x = 100.

  function earsSVG(dna, c) {
    const dark = shade(c, -0.18);
    const inner = dna.species === "cat" ? shade(dna.patch, -0.04) : shade(c, 0.32);
    if (dna.species === "bunny") {
      // tall upright ears
      return `
        <g>
          <ellipse cx="80" cy="26" rx="12" ry="34" fill="${c}" transform="rotate(-8 80 26)"/>
          <ellipse cx="120" cy="26" rx="12" ry="34" fill="${c}" transform="rotate(8 120 26)"/>
          <ellipse cx="80" cy="30" rx="6" ry="24" fill="${inner}" transform="rotate(-8 80 30)"/>
          <ellipse cx="120" cy="30" rx="6" ry="24" fill="${inner}" transform="rotate(8 120 30)"/>
        </g>`;
    }
    if (dna.species === "cat" || dna.ears === "perky") {
      // upright triangles
      return `
        <g>
          <path d="M62 60 L58 20 L92 46 Z" fill="${c}"/>
          <path d="M138 60 L142 20 L108 46 Z" fill="${c}"/>
          <path d="M66 54 L64 32 L84 47 Z" fill="${inner}"/>
          <path d="M134 54 L136 32 L116 47 Z" fill="${inner}"/>
        </g>`;
    }
    if (dna.ears === "folded") {
      // small folded-over flaps
      return `
        <g>
          <path d="M60 46 q-14 -6 -18 10 q10 10 22 4 Z" fill="${dark}"/>
          <path d="M140 46 q14 -6 18 10 q-10 10 -22 4 Z" fill="${dark}"/>
        </g>`;
    }
    // floppy — long hanging ears
    return `
      <g>
        <path d="M64 52 q-26 2 -24 40 q2 20 22 16 q6 -30 8 -52 Z" fill="${dark}"/>
        <path d="M136 52 q26 2 24 40 q-2 20 -22 16 q-6 -30 -8 -52 Z" fill="${dark}"/>
      </g>`;
  }

  function tailSVG(dna, c) {
    const dark = shade(c, -0.12);
    if (dna.tail === "fluffy") {
      return `<ellipse cx="150" cy="150" rx="20" ry="24" fill="${dark}"/>`;
    }
    if (dna.tail === "stub") {
      return `<circle cx="146" cy="156" r="11" fill="${dark}"/>`;
    }
    // curl
    return `<path d="M140 150 q34 -6 30 -34 q-2 -16 -18 -14 q14 4 12 18 q-2 18 -26 18 Z" fill="${dark}"/>`;
  }

  function headSVG(dna, c) {
    // rounded head
    return `<ellipse cx="100" cy="74" rx="50" ry="46" fill="${c}"/>`;
  }

  function bodySVG(dna, c) {
    const patch = dna.patch;
    return `
      <g>
        <path d="M62 118 q-6 44 12 66 q26 14 52 0 q18 -22 12 -66 Z" fill="${c}"/>
        <ellipse cx="100" cy="164" rx="22" ry="30" fill="${patch}"/>
        <ellipse cx="78" cy="190" rx="13" ry="10" fill="${shade(c, 0.05)}"/>
        <ellipse cx="122" cy="190" rx="13" ry="10" fill="${shade(c, 0.05)}"/>
      </g>`;
  }

  function muzzleSVG(dna) {
    const p = dna.patch;
    const noseDark = shade(dna.coat, -0.55);
    const long = dna.muzzle === "long";
    const my = long ? 96 : 90;
    const mrx = long ? 24 : 27;
    const mry = long ? 22 : 17;
    // blaze up the forehead (classic corgi/uchinoko marking)
    const blaze = `<path d="M100 40 q-9 24 -3 46 q3 6 6 0 q6 -22 -3 -46 Z" fill="${p}" opacity="0.9"/>`;
    return `
      <g>
        ${blaze}
        <ellipse cx="100" cy="${my}" rx="${mrx}" ry="${mry}" fill="${p}"/>
        <ellipse cx="100" cy="${my - 8}" rx="7" ry="5" fill="${noseDark}"/>
        <path d="M100 ${my - 3} q-7 12 -14 4" fill="none" stroke="${noseDark}" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M100 ${my - 3} q7 12 14 4" fill="none" stroke="${noseDark}" stroke-width="2.4" stroke-linecap="round"/>
      </g>`;
  }

  function eyesSVG(dna) {
    const dark = "#3a3230";
    const catchlight = "#ffffff";
    const lx = 82, rx = 118, ey = 72;
    if (dna.eyes === "sleepy") {
      return `
        <g stroke="${dark}" stroke-width="3.4" stroke-linecap="round" fill="none">
          <path d="M${lx - 8} ${ey} q8 7 16 0"/>
          <path d="M${rx - 8} ${ey} q8 7 16 0"/>
        </g>`;
    }
    if (dna.eyes === "sparkle") {
      return `
        <g fill="${dark}">
          <circle cx="${lx}" cy="${ey}" r="8"/>
          <circle cx="${rx}" cy="${ey}" r="8"/>
          <circle cx="${lx + 3}" cy="${ey - 3}" r="2.6" fill="${catchlight}"/>
          <circle cx="${rx + 3}" cy="${ey - 3}" r="2.6" fill="${catchlight}"/>
          <circle cx="${lx - 2.5}" cy="${ey + 2.5}" r="1.3" fill="${catchlight}"/>
          <circle cx="${rx - 2.5}" cy="${ey + 2.5}" r="1.3" fill="${catchlight}"/>
        </g>`;
    }
    // round
    return `
      <g fill="${dark}">
        <circle cx="${lx}" cy="${ey}" r="7"/>
        <circle cx="${rx}" cy="${ey}" r="7"/>
        <circle cx="${lx + 2.5}" cy="${ey - 2.5}" r="2.2" fill="${catchlight}"/>
        <circle cx="${rx + 2.5}" cy="${ey - 2.5}" r="2.2" fill="${catchlight}"/>
      </g>`;
  }

  function blushSVG(dna) {
    if (!dna.blush) return "";
    return `
      <g fill="#f6a5a5" opacity="0.55">
        <ellipse cx="66" cy="86" rx="8" ry="5"/>
        <ellipse cx="134" cy="86" rx="8" ry="5"/>
      </g>`;
  }

  function accessorySVG(dna) {
    const a = dna.accent;
    const dark = shade(a, -0.2);
    if (dna.accessory === "collar") {
      return `
        <g>
          <path d="M70 116 q30 16 60 0" fill="none" stroke="${a}" stroke-width="8" stroke-linecap="round"/>
          <circle cx="100" cy="123" r="5" fill="${shade(a, 0.4)}" stroke="${dark}" stroke-width="1.5"/>
        </g>`;
    }
    if (dna.accessory === "scarf") {
      return `
        <g>
          <path d="M66 112 q34 22 68 0 l-6 14 q-28 16 -56 0 Z" fill="${a}"/>
          <path d="M108 120 l18 30 l-12 4 l-12 -28 Z" fill="${dark}"/>
        </g>`;
    }
    if (dna.accessory === "bow") {
      return `
        <g transform="translate(100 118)">
          <path d="M0 0 L-18 -10 L-18 10 Z" fill="${a}"/>
          <path d="M0 0 L18 -10 L18 10 Z" fill="${a}"/>
          <circle cx="0" cy="0" r="5" fill="${dark}"/>
        </g>`;
    }
    return "";
  }

  // ---- compose -------------------------------------------------------------
  function renderSVG(dna, opts) {
    const d = normalize(dna);
    const c = d.coat;
    const options = opts || {};
    const cls = options.className ? ` class="${options.className}"` : "";
    // z-order: tail → body → ears → head → face → accessory
    return `<svg${cls} viewBox="0 0 200 210" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
  ${tailSVG(d, c)}
  ${bodySVG(d, c)}
  ${accessorySVG(d)}
  ${earsSVG(d, c)}
  ${headSVG(d, c)}
  ${muzzleSVG(d)}
  ${eyesSVG(d)}
  ${blushSVG(d)}
</svg>`;
  }

  const api = {
    renderSVG,
    normalize,
    defaults,
    OPTIONS,
    COAT_PALETTE,
    ACCENT_PALETTE,
    shade,
  };

  root.PixllKit = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
