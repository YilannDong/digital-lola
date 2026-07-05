"use strict";
// One-off: read the user's lola.svg and bake it into src/shared/lola.js as a
// browser+node module, so the app ships the exact artwork with no external dep.
const fs = require("fs");
const path = require("path");

const SRC = "/Users/yilandong/Downloads/lola.svg";
const OUT = path.join(__dirname, "..", "src", "shared", "lola.js");

let svg = fs.readFileSync(SRC, "utf8");
svg = svg.replace(/<\?xml[^>]*\?>/, "").replace(/<!--[\s\S]*?-->/g, "").trim();
svg = svg.replace(/<svg /, '<svg class="pixll-svg" preserveAspectRatio="xMidYMid meet" ');

const out = `/*
 * Pixll — the character "Lola", the user's own source SVG embedded verbatim.
 * This is the exact artwork the user provided (a VTracer vector). Do not hand-
 * edit; regenerate with: node tools/embed-lola.cjs
 */
(function (root) {
  var SVG = ${JSON.stringify(svg)};
  root.PixllLola = { svg: SVG };
  if (typeof module !== "undefined" && module.exports) module.exports = root.PixllLola;
})(typeof window !== "undefined" ? window : globalThis);
`;

fs.writeFileSync(OUT, out, "utf8");
console.log("wrote", OUT, "(" + Math.round(out.length / 1024) + " KB)");
