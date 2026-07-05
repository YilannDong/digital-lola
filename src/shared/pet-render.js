/*
 * Pixll — pet renderer.
 * Character is "Lola" (lola.js), the user's exact source SVG embedded verbatim.
 * lola-fill.js paints a white backing under the art to fill the trace's enclosed
 * holes (front legs). The tail-wag was removed — a flat un-grouped bitmap trace
 * can't cleanly detach the tail (see memory for the full recipe if a LAYERED
 * source SVG ever becomes available). renderSVG() returns the static art.
 *
 * Background is transparent.
 */
(function (root) {
  const Lola = root.PixllLola || (typeof require !== "undefined" ? require("./lola.js") : null);
  const Fill = root.PixllLolaFill || (typeof require !== "undefined" ? require("./lola-fill.js") : null);

  function renderSVG(_config) {
    if (!Lola) return "";
    let svg = Lola.svg;
    if (Fill && Fill.dataUrl) {
      const backing = `<image x="0" y="0" width="${Fill.w}" height="${Fill.h}" preserveAspectRatio="none" href="${Fill.dataUrl}"/>`;
      svg = svg.replace(/(<svg[^>]*>)/, `$1${backing}`);
    }
    return svg;
  }

  const api = { renderSVG };
  root.PixllPet = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
