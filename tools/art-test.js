"use strict";
// Proof harness renders the COMPOSED pet (Lola + white hole-fill backing).
require("../src/shared/lola.js");
require("../src/shared/lola-fill.js");
module.exports = require("../src/shared/pet-render.js").renderSVG();
