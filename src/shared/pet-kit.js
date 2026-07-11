/*
 * Pixll — pet-kit: the "genome → art" engine (soft / fluffy style).
 *
 * A pet is described by a tiny JSON "DNA" object. This module turns that DNA
 * into a layered SVG built from procedural shapes with SOFT SHADING — radial
 * gradients for volume, scalloped "fur" outlines, and big glossy eyes — aiming
 * for the plush, cuddly Uchinoko-Maker look while staying pure code (no image
 * assets, no build step). Every part is swappable and every colour recolourable.
 *
 * DNA schema (all optional; defaults below):
 *   species  : "dog" | "cat" | "bunny"
 *   coat     : "#e8a05c"   main fur colour
 *   patch    : "#fff3e2"   belly / muzzle / blaze colour
 *   ears     : "perky" | "folded" | "floppy"
 *   eyes     : "round" | "sleepy" | "sparkle"
 *   muzzle   : "short" | "long"
 *   tail     : "curl" | "fluffy" | "stub"
 *   accessory: "none" | "collar" | "scarf" | "bow"
 *   accent   : "#f2a65a"   accessory colour
 *   blush    : true
 */
(function (root) {
  "use strict";

  const OPTIONS = {
    species: ["dog", "cat", "bunny"],
    ears: ["perky", "folded", "floppy"],
    eyes: ["round", "sleepy", "sparkle"],
    muzzle: ["short", "long"],
    tail: ["curl", "fluffy", "stub"],
    accessory: ["none", "collar", "scarf", "bow"],
  };

  const COAT_PALETTE = [
    { name: "Corgi", coat: "#efa863", patch: "#fff6ea" },
    { name: "Cream", coat: "#f2ddbe", patch: "#fffbf4" },
    { name: "Ash", coat: "#8f8880", patch: "#efe9e1" },
    { name: "Cocoa", coat: "#9a6644", patch: "#f6e8d8" },
    { name: "Rosé", coat: "#e6aead", patch: "#fff2f0" },
    { name: "Mint", coat: "#9bd0b8", patch: "#f2fcf6" },
    { name: "Sky", coat: "#9db6d6", patch: "#f0f5fc" },
    { name: "Ink", coat: "#4a444f", patch: "#ddd7e0" },
  ];

  const ACCENT_PALETTE = ["#f2a65a", "#e77b7b", "#6fa8e0", "#7bc47f", "#b98fe0", "#f4c542"];

  function defaults() {
    return {
      species: "dog",
      coat: "#efa863",
      patch: "#fff6ea",
      ears: "perky",
      eyes: "round",
      muzzle: "short",
      tail: "curl",
      accessory: "collar",
      accent: "#f2a65a",
      blush: true,
    };
  }

  function normalize(dna) { return Object.assign(defaults(), dna || {}); }

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
  function shade(hex, amt) {
    const [r, g, b] = hexToRgb(hex);
    if (amt < 0) { const k = 1 + amt; return rgbToHex(r * k, g * k, b * k); }
    return rgbToHex(r + (255 - r) * amt, g + (255 - g) * amt, b + (255 - b) * amt);
  }

  // ---- fluffy shape helper -------------------------------------------------
  // A closed scalloped "cloud" path — the fur silhouette. Deterministic so the
  // pet never shimmers between renders.
  function fluff(cx, cy, rx, ry, bumps, amp) {
    let d = "";
    const step = (Math.PI * 2) / bumps;
    for (let i = 0; i < bumps; i++) {
      const a0 = i * step, a1 = (i + 1) * step, mid = (a0 + a1) / 2;
      const x0 = cx + Math.cos(a0) * rx, y0 = cy + Math.sin(a0) * ry;
      const x1 = cx + Math.cos(a1) * rx, y1 = cy + Math.sin(a1) * ry;
      const px = cx + Math.cos(mid) * (rx + amp), py = cy + Math.sin(mid) * (ry + amp);
      d += (i === 0 ? `M${x0.toFixed(1)} ${y0.toFixed(1)}` : "") + ` Q${px.toFixed(1)} ${py.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
    }
    return d + "Z";
  }

  // unique gradient ids per render (so multiple pets on one page don't collide)
  let uid = 0;

  // ---- parts ---------------------------------------------------------------
  function earsSVG(dna, g) {
    const c = `url(#${g}-coat)`;
    const inner = dna.species === "cat" ? shade(dna.patch, -0.02) : shade(dna.coat, 0.3);
    const edge = shade(dna.coat, -0.16);
    if (dna.species === "bunny") {
      return `
        <g>
          <path d="${fluff(80, 24, 12, 32, 9, 2)}" fill="${c}" transform="rotate(-9 80 40)"/>
          <path d="${fluff(120, 24, 12, 32, 9, 2)}" fill="${c}" transform="rotate(9 120 40)"/>
          <ellipse cx="80" cy="30" rx="6" ry="22" fill="${inner}" transform="rotate(-9 80 40)"/>
          <ellipse cx="120" cy="30" rx="6" ry="22" fill="${inner}" transform="rotate(9 120 40)"/>
        </g>`;
    }
    if (dna.species === "cat" || dna.ears === "perky") {
      return `
        <g>
          <path d="M58 62 Q54 22 92 48 Q80 60 58 62 Z" fill="${c}"/>
          <path d="M142 62 Q146 22 108 48 Q120 60 142 62 Z" fill="${c}"/>
          <path d="M66 55 Q64 34 84 49 Q76 55 66 55 Z" fill="${inner}"/>
          <path d="M134 55 Q136 34 116 49 Q124 55 134 55 Z" fill="${inner}"/>
        </g>`;
    }
    if (dna.ears === "folded") {
      return `
        <g>
          <path d="${fluff(52, 52, 15, 13, 7, 2)}" fill="${edge}"/>
          <path d="${fluff(148, 52, 15, 13, 7, 2)}" fill="${edge}"/>
        </g>`;
    }
    // floppy — long fluffy hanging ears
    return `
      <g>
        <path d="${fluff(58, 96, 17, 34, 9, 2.5)}" fill="${edge}"/>
        <path d="${fluff(142, 96, 17, 34, 9, 2.5)}" fill="${edge}"/>
      </g>`;
  }

  function tailSVG(dna, g) {
    const c = `url(#${g}-coat)`;
    if (dna.tail === "fluffy") return `<path d="${fluff(152, 150, 18, 22, 9, 3)}" fill="${c}"/>`;
    if (dna.tail === "stub") return `<path d="${fluff(148, 156, 11, 11, 7, 2)}" fill="${c}"/>`;
    return `<path d="M138 150 q36 -4 32 -34 q-3 -18 -20 -14 q15 5 13 19 q-3 20 -28 19 Z" fill="${c}"/>`;
  }

  function bodySVG(dna, g) {
    const c = `url(#${g}-coat)`;
    const patch = `url(#${g}-patch)`;
    const foot = shade(dna.coat, -0.06);
    return `
      <g>
        <path d="${fluff(100, 158, 44, 40, 13, 3)}" fill="${c}"/>
        <path d="${fluff(100, 168, 22, 26, 10, 2)}" fill="${patch}"/>
        <ellipse cx="78" cy="192" rx="13" ry="10" fill="${foot}"/>
        <ellipse cx="122" cy="192" rx="13" ry="10" fill="${foot}"/>
      </g>`;
  }

  function headSVG(dna, g) {
    // soft ambient shadow where the head sits on the body, then the fluffy head
    return `
      <ellipse cx="100" cy="120" rx="40" ry="14" fill="#000" opacity="0.06"/>
      <path d="${fluff(100, 76, 50, 47, 15, 3)}" fill="url(#${g}-coat)"/>`;
  }

  function muzzleSVG(dna, g) {
    const patch = `url(#${g}-patch)`;
    const nose = shade(dna.coat, -0.5);
    const long = dna.muzzle === "long";
    const my = long ? 100 : 94;
    const mrx = long ? 25 : 28, mry = long ? 22 : 18;
    const ny = my - 10;
    const blaze = `<path d="M100 42 Q90 66 96 92 Q100 98 104 92 Q110 66 100 42 Z" fill="${patch}" opacity="0.95"/>`;
    return `
      <g>
        ${blaze}
        <path d="${fluff(100, my, mrx, mry, 11, 2)}" fill="${patch}"/>
        <path d="M${100 - 7} ${ny} Q100 ${ny - 4} ${100 + 7} ${ny} Q100 ${ny + 8} ${100 - 7} ${ny} Z" fill="${nose}"/>
        <ellipse cx="98" cy="${ny - 1.5}" rx="2.4" ry="1.5" fill="#fff" opacity="0.5"/>
        <path d="M100 ${ny + 6} q-8 11 -15 3" fill="none" stroke="${nose}" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M100 ${ny + 6} q8 11 15 3" fill="none" stroke="${nose}" stroke-width="2.4" stroke-linecap="round"/>
      </g>`;
  }

  function eyeGlossy(cx, cy, g) {
    return `
      <ellipse cx="${cx}" cy="${cy}" rx="9.5" ry="12" fill="url(#${g}-eye)"/>
      <ellipse cx="${cx - 3}" cy="${cy - 4.5}" rx="3.4" ry="4.4" fill="#fff" opacity="0.95"/>
      <circle cx="${cx + 3.4}" cy="${cy + 3.4}" r="1.9" fill="#fff" opacity="0.85"/>`;
  }

  function eyesSVG(dna, g) {
    const dark = "#3a2c26";
    const lx = 81, rx = 119, ey = 74;
    if (dna.eyes === "sleepy") {
      return `
        <g stroke="${dark}" stroke-width="3.6" stroke-linecap="round" fill="none">
          <path d="M${lx - 9} ${ey} q9 8 18 0"/>
          <path d="M${rx - 9} ${ey} q9 8 18 0"/>
        </g>
        <g fill="#f6a5a5" opacity="0.5"><ellipse cx="${lx}" cy="${ey + 8}" rx="6" ry="3.4"/><ellipse cx="${rx}" cy="${ey + 8}" rx="6" ry="3.4"/></g>`;
    }
    if (dna.eyes === "sparkle") {
      return `
        ${eyeGlossy(lx, ey, g)}
        ${eyeGlossy(rx, ey, g)}
        <g fill="#fff" opacity="0.9">
          <circle cx="${lx - 1}" cy="${ey + 6}" r="1.2"/>
          <circle cx="${rx - 1}" cy="${ey + 6}" r="1.2"/>
        </g>`;
    }
    return `${eyeGlossy(lx, ey, g)}${eyeGlossy(rx, ey, g)}`;
  }

  function blushSVG(dna) {
    if (!dna.blush) return "";
    return `<g fill="#f79aa0" opacity="0.5"><ellipse cx="64" cy="90" rx="9" ry="5.5"/><ellipse cx="136" cy="90" rx="9" ry="5.5"/></g>`;
  }

  function accessorySVG(dna) {
    const a = dna.accent, dark = shade(a, -0.2), lite = shade(a, 0.4);
    if (dna.accessory === "collar") {
      return `
        <g>
          <path d="M68 118 Q100 138 132 118" fill="none" stroke="${a}" stroke-width="9" stroke-linecap="round"/>
          <circle cx="100" cy="128" r="5.5" fill="${lite}" stroke="${dark}" stroke-width="1.5"/>
        </g>`;
    }
    if (dna.accessory === "scarf") {
      return `
        <g>
          <path d="M64 114 Q100 140 136 114 L129 130 Q100 150 71 130 Z" fill="${a}"/>
          <path d="M110 124 L128 156 L114 160 L104 130 Z" fill="${dark}"/>
        </g>`;
    }
    if (dna.accessory === "bow") {
      return `
        <g transform="translate(100 122)">
          <path d="M0 0 Q-20 -12 -20 0 Q-20 12 0 0 Z" fill="${a}"/>
          <path d="M0 0 Q20 -12 20 0 Q20 12 0 0 Z" fill="${a}"/>
          <circle cx="0" cy="0" r="5.5" fill="${dark}"/>
        </g>`;
    }
    return "";
  }

  // ---- compose -------------------------------------------------------------
  function renderSVG(dna, opts) {
    const d = normalize(dna);
    const g = `p${uid++}`;
    const options = opts || {};
    const cls = options.className ? ` class="${options.className}"` : "";
    const coat = d.coat, patch = d.patch;
    const defs = `<defs>
      <radialGradient id="${g}-coat" cx="42%" cy="28%" r="82%">
        <stop offset="0%" stop-color="${shade(coat, 0.22)}"/>
        <stop offset="58%" stop-color="${coat}"/>
        <stop offset="100%" stop-color="${shade(coat, -0.13)}"/>
      </radialGradient>
      <radialGradient id="${g}-patch" cx="50%" cy="30%" r="80%">
        <stop offset="0%" stop-color="${shade(patch, 0.12)}"/>
        <stop offset="100%" stop-color="${patch}"/>
      </radialGradient>
      <radialGradient id="${g}-eye" cx="46%" cy="32%" r="72%">
        <stop offset="0%" stop-color="#7a5540"/>
        <stop offset="100%" stop-color="#2a1d16"/>
      </radialGradient>
    </defs>`;
    // z-order: tail → body → accessory → ears → head → face
    return `<svg${cls} viewBox="0 0 200 210" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
  ${defs}
  ${tailSVG(d, g)}
  ${bodySVG(d, g)}
  ${accessorySVG(d)}
  ${earsSVG(d, g)}
  ${headSVG(d, g)}
  ${muzzleSVG(d, g)}
  ${eyesSVG(d, g)}
  ${blushSVG(d)}
</svg>`;
  }

  const api = { renderSVG, normalize, defaults, OPTIONS, COAT_PALETTE, ACCENT_PALETTE, shade };
  root.PixllKit = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
