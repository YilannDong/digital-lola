/*
 * Pixll — pet renderer (the single seam every surface renders through).
 *
 * Two kinds of pet can be drawn:
 *   1. A CUSTOM pet — described by a "DNA" object (pet.dna) and drawn by the
 *      parametric pet-kit engine. This is the customizable path the platform
 *      is built on (builder → desktop → later, web + cloud sync).
 *   2. LEGACY Lola — the original hand-embedded VTracer SVG (lola.js). Kept as
 *      the fallback so existing installs with no DNA still show the corgi.
 *
 * renderSVG(petConfig) picks the path from the config it's handed.
 */
(function (root) {
  const Lola = root.PixllLola || (typeof require !== "undefined" ? require("./lola.js") : null);
  const Fill = root.PixllLolaFill || (typeof require !== "undefined" ? require("./lola-fill.js") : null);
  const Kit = root.PixllKit || (typeof require !== "undefined" ? require("./pet-kit.js") : null);

  function renderLola() {
    if (!Lola) return "";
    let svg = Lola.svg;
    if (Fill && Fill.dataUrl) {
      const backing = `<image x="0" y="0" width="${Fill.w}" height="${Fill.h}" preserveAspectRatio="none" href="${Fill.dataUrl}"/>`;
      svg = svg.replace(/(<svg[^>]*>)/, `$1${backing}`);
    }
    return svg;
  }

  // petConfig may be the whole pet object ({ name, dna }) or a bare DNA object.
  function renderSVG(petConfig) {
    const cfg = petConfig || {};
    const dna = cfg.dna || (cfg.species || cfg.coat ? cfg : null);
    if (dna && Kit) return Kit.renderSVG(dna);
    return renderLola();
  }

  const api = { renderSVG, renderLola };
  root.PixllPet = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
