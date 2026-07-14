"use strict";
// Builds the Pixll pricing / "bring her home" mockup page, embedding real pets
// rendered by the pet-kit engine. Outputs a self-contained HTML file.
const fs = require("fs");
const path = require("path");
const K = require("../src/shared/pet-kit.js");

const heroPet = K.renderSVG({}); // default corgi Lola
const petCat = K.renderSVG({ species: "cat", coat: "#9db6d6", patch: "#f0f5fc", accent: "#e77b7b", eyes: "sparkle" });
const petBunny = K.renderSVG({ species: "bunny", coat: "#e6aead", patch: "#fff2f0", accent: "#b98fe0", tail: "fluffy" });
const petMint = K.renderSVG({ coat: "#9bd0b8", patch: "#f2fcf6", accent: "#7bc47f", ears: "floppy", eyes: "sleepy" });

const out = process.argv[2] || path.join(__dirname, "pricing.html");

const html = `<title>Pixll — bring your pet home</title>
<style>
  :root {
    --paper: #f7efe2; --paper-2: #fbf4e9;
    --card: #fffdf8; --ink: #3a3026; --ink-soft: #8b7d6c;
    --ink-faint: #b3a692; --line: #ece0cd;
    --amber: #df8f36; --amber-deep: #b06818; --amber-wash: #fbeed6;
    --blush: #e58c92; --mint: #74b98f; --sky: #6f97c6;
    --shadow-lg: 0 22px 50px rgba(150, 110, 55, 0.16);
    --shadow: 0 10px 26px rgba(150, 110, 55, 0.12);
    --shadow-sm: 0 4px 12px rgba(150, 110, 55, 0.10);
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --paper: #17130d; --paper-2: #1c1710;
      --card: #221c14; --ink: #f2ead9; --ink-soft: #b3a591; --ink-faint: #7d7160;
      --line: #352c1f;
      --amber: #ecac57; --amber-deep: #f3c98d; --amber-wash: #2f2412;
      --blush: #e29aa0; --mint: #86c7a0; --sky: #8cafd8;
      --shadow-lg: 0 22px 50px rgba(0,0,0,0.5); --shadow: 0 10px 26px rgba(0,0,0,0.42);
      --shadow-sm: 0 4px 12px rgba(0,0,0,0.36);
    }
  }
  :root[data-theme="light"] {
    --paper: #f7efe2; --paper-2: #fbf4e9; --card: #fffdf8; --ink: #3a3026;
    --ink-soft: #8b7d6c; --ink-faint: #b3a692; --line: #ece0cd;
    --amber: #df8f36; --amber-deep: #b06818; --amber-wash: #fbeed6;
    --blush: #e58c92; --mint: #74b98f; --sky: #6f97c6;
    --shadow-lg: 0 22px 50px rgba(150,110,55,0.16); --shadow: 0 10px 26px rgba(150,110,55,0.12);
    --shadow-sm: 0 4px 12px rgba(150,110,55,0.10);
  }
  :root[data-theme="dark"] {
    --paper: #17130d; --paper-2: #1c1710; --card: #221c14; --ink: #f2ead9;
    --ink-soft: #b3a591; --ink-faint: #7d7160; --line: #352c1f;
    --amber: #ecac57; --amber-deep: #f3c98d; --amber-wash: #2f2412;
    --blush: #e29aa0; --mint: #86c7a0; --sky: #8cafd8;
    --shadow-lg: 0 22px 50px rgba(0,0,0,0.5); --shadow: 0 10px 26px rgba(0,0,0,0.42);
    --shadow-sm: 0 4px 12px rgba(0,0,0,0.36);
  }

  * { box-sizing: border-box; }
  body {
    margin: 0; background: var(--paper); color: var(--ink);
    font-family: "SF Pro Rounded", ui-rounded, "Segoe UI", system-ui, -apple-system, sans-serif;
    line-height: 1.5; -webkit-font-smoothing: antialiased;
  }
  .wrap { max-width: 1080px; margin: 0 auto; padding: 0 clamp(16px, 4vw, 36px); }

  /* nav */
  nav { display: flex; align-items: center; justify-content: space-between; padding: 22px 0; }
  .brand { font-size: 22px; font-weight: 800; letter-spacing: -0.01em; }
  .brand .dot { color: var(--amber); }
  nav .tag { font-size: 13px; color: var(--ink-soft); font-weight: 600; }

  /* hero */
  .hero { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 24px; align-items: center;
    padding: clamp(24px, 5vw, 56px) 0 clamp(12px, 3vw, 28px); }
  .hero h1 { font-size: clamp(34px, 5.4vw, 58px); line-height: 1.02; letter-spacing: -0.025em;
    font-weight: 800; margin: 0 0 16px; text-wrap: balance; }
  .hero h1 .amber { color: var(--amber); }
  .hero p.sub { font-size: clamp(15px, 2vw, 18px); color: var(--ink-soft); margin: 0 0 26px; max-width: 42ch; }
  .cta-row { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
  .btn { font: inherit; font-weight: 700; border: none; border-radius: 14px; cursor: pointer;
    padding: 14px 22px; font-size: 15.5px; transition: transform .08s ease, box-shadow .2s ease; }
  .btn-primary { background: var(--amber); color: #fff; box-shadow: 0 8px 20px rgba(223,143,54,.42); }
  :root[data-theme="dark"] .btn-primary { color: #201400; }
  @media (prefers-color-scheme: dark) { .btn-primary { color: #201400; } }
  :root[data-theme="light"] .btn-primary { color: #fff; }
  .btn-primary:hover { transform: translateY(-2px); }
  .btn-ghost { background: transparent; color: var(--amber-deep); box-shadow: inset 0 0 0 2px var(--line); }
  .btn-ghost:hover { background: var(--card); }
  .hero .reassure { margin-top: 18px; font-size: 13px; color: var(--ink-faint); display: flex; gap: 16px; flex-wrap: wrap; }
  .hero .reassure span { display: inline-flex; align-items: center; gap: 6px; }

  /* hero pet stage */
  .stage { position: relative; display: grid; place-items: center; min-height: 320px; }
  .stage .platform { position: absolute; bottom: 34px; width: 210px; height: 30px; border-radius: 50%;
    background: radial-gradient(ellipse at center, rgba(120,90,50,.18), transparent 70%); }
  .stage .pet { width: min(300px, 74%); animation: float 4s ease-in-out infinite; filter: drop-shadow(0 14px 16px rgba(150,110,60,.22)); }
  .stage .pet svg { width: 100%; height: auto; display: block; }
  .stage .bubble { position: absolute; top: 20px; left: 50%; transform: translateX(-20%);
    background: var(--card); border: 1.5px solid var(--line); color: var(--ink);
    font-size: 13px; font-weight: 700; padding: 8px 13px; border-radius: 14px 14px 14px 4px; box-shadow: var(--shadow-sm); }
  @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }

  /* section heading */
  .sec-head { text-align: center; margin: clamp(30px,6vw,60px) 0 26px; }
  .sec-head .eyebrow { font-size: 12px; letter-spacing: .16em; text-transform: uppercase; font-weight: 800; color: var(--amber-deep); }
  .sec-head h2 { font-size: clamp(26px, 4vw, 38px); font-weight: 800; letter-spacing: -0.02em; margin: 8px 0 0; text-wrap: balance; }
  .sec-head p { color: var(--ink-soft); margin: 10px auto 0; max-width: 48ch; }

  /* pricing */
  .tiers { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; align-items: start; }
  .tier { background: var(--card); border: 1.5px solid var(--line); border-radius: 22px; padding: 26px 24px;
    display: flex; flex-direction: column; gap: 16px; box-shadow: var(--shadow-sm); position: relative; }
  .tier.featured { border-color: var(--amber); box-shadow: var(--shadow-lg); transform: translateY(-6px); }
  .tier .badge { position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
    background: var(--amber); color: #fff; font-size: 11px; font-weight: 800; letter-spacing: .06em;
    text-transform: uppercase; padding: 5px 12px; border-radius: 999px; white-space: nowrap; }
  :root[data-theme="dark"] .tier .badge { color: #201400; }
  @media (prefers-color-scheme: dark) { .tier .badge { color: #201400; } }
  :root[data-theme="light"] .tier .badge { color: #fff; }
  .tier .tname { font-size: 15px; font-weight: 800; letter-spacing: .02em; color: var(--ink); }
  .tier .price { display: flex; align-items: baseline; gap: 6px; }
  .tier .price .amt { font-size: 40px; font-weight: 800; letter-spacing: -0.02em; }
  .tier .price .per { font-size: 13px; color: var(--ink-faint); font-weight: 600; }
  .tier .blurb { font-size: 13.5px; color: var(--ink-soft); margin-top: -6px; }
  .tier ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
  .tier li { display: flex; gap: 9px; font-size: 14px; color: var(--ink); align-items: flex-start; }
  .tier li .ic { color: var(--amber); font-weight: 800; flex: none; width: 15px; }
  .tier li.off { color: var(--ink-faint); }
  .tier li.off .ic { color: var(--ink-faint); }
  .tier .btn { width: 100%; text-align: center; margin-top: auto; }
  .tier .btn-soft { background: var(--amber-wash); color: var(--amber-deep); }
  .tier .btn-soft:hover { transform: translateY(-2px); }

  /* how it works */
  .steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
  .step { background: var(--card); border: 1.5px solid var(--line); border-radius: 20px; padding: 22px; text-align: center; box-shadow: var(--shadow-sm); }
  .step .n { width: 30px; height: 30px; margin: 0 auto 12px; border-radius: 50%; background: var(--amber-wash);
    color: var(--amber-deep); font-weight: 800; display: grid; place-items: center; font-size: 14px; }
  .step .mini { height: 96px; display: grid; place-items: center; margin-bottom: 6px; }
  .step .mini svg { height: 96px; width: auto; }
  .step h3 { margin: 6px 0 6px; font-size: 16px; font-weight: 800; }
  .step p { margin: 0; font-size: 13.5px; color: var(--ink-soft); }

  footer { text-align: center; color: var(--ink-faint); font-size: 13px; padding: 46px 0 40px; }
  footer .heart { color: var(--blush); }

  @media (max-width: 860px) {
    .hero { grid-template-columns: 1fr; }
    .stage { order: -1; min-height: 260px; }
    .tiers { grid-template-columns: 1fr; }
    .tier.featured { transform: none; }
    .steps { grid-template-columns: 1fr; }
  }
  @media (prefers-reduced-motion: reduce) { .stage .pet { animation: none; } }
</style>

<div class="wrap">
  <nav>
    <div class="brand">🐶 Pixll<span class="dot">.</span></div>
    <div class="tag">a little friend for your desktop</div>
  </nav>

  <section class="hero">
    <div>
      <h1>You designed her.<br>Now <span class="amber">bring her home.</span></h1>
      <p class="sub">Meet your pet right here in the browser — free. When you're ready, bring her out of the tab and onto your desktop, where she'll keep you company all day.</p>
      <div class="cta-row">
        <button class="btn btn-primary">Bring her to my desktop&nbsp;→</button>
        <button class="btn btn-ghost">Keep designing — it's free</button>
      </div>
      <div class="reassure">
        <span>✓ one-time payment</span>
        <span>✓ macOS &amp; Windows</span>
        <span>✓ she's yours forever</span>
      </div>
    </div>
    <div class="stage">
      <div class="bubble">hi! 🌼</div>
      <div class="platform"></div>
      <div class="pet">${heroPet}</div>
    </div>
  </section>

  <div class="sec-head">
    <div class="eyebrow">Simple pricing</div>
    <h2>Design free. Adopt once.</h2>
    <p>No subscriptions. Design as many pets as you like in the browser — pay only when you want one to live on your desktop.</p>
  </div>

  <section class="tiers">
    <div class="tier">
      <div class="tname">🎨 Browser Studio</div>
      <div class="price"><span class="amt">Free</span></div>
      <div class="blurb">Design her, watch her come to life, share the link.</div>
      <ul>
        <li><span class="ic">✓</span><span>Build a pet from parts</span></li>
        <li><span class="ic">✓</span><span>Live preview in your browser</span></li>
        <li><span class="ic">✓</span><span>Share a link to your pet</span></li>
        <li class="off"><span class="ic">✕</span><span>Lives only inside the browser</span></li>
      </ul>
      <button class="btn btn-soft">Start designing</button>
    </div>

    <div class="tier featured">
      <div class="badge">Most loved 💛</div>
      <div class="tname">🏡 Adopt</div>
      <div class="price"><span class="amt">$9</span><span class="per">one-time</span></div>
      <div class="blurb">Bring your pet out of the browser and onto your desktop.</div>
      <ul>
        <li><span class="ic">✓</span><span>Everything in Browser Studio</span></li>
        <li><span class="ic">✓</span><span><strong>Desktop companion</strong> — floats on your screen</span></li>
        <li><span class="ic">✓</span><span>Tap to play · gentle reminders</span></li>
        <li><span class="ic">✓</span><span>Starter accessories &amp; colors</span></li>
      </ul>
      <button class="btn btn-primary">Bring her to my desktop&nbsp;→</button>
    </div>

    <div class="tier">
      <div class="tname">✨ Premium</div>
      <div class="price"><span class="amt">$19</span><span class="per">one-time</span></div>
      <div class="blurb">Turn your <em>real</em> pet's photo into their desktop twin.</div>
      <ul>
        <li><span class="ic">✓</span><span>Everything in Adopt</span></li>
        <li><span class="ic">✓</span><span><strong>Upload a photo → AI makes your pet</strong></span></li>
        <li><span class="ic">✓</span><span>Premium outfits &amp; accessory packs</span></li>
        <li><span class="ic">✓</span><span>Multiple pets</span></li>
      </ul>
      <button class="btn btn-soft">Go Premium</button>
    </div>
  </section>

  <div class="sec-head">
    <div class="eyebrow">How she comes home</div>
    <h2>Three little steps</h2>
  </div>

  <section class="steps">
    <div class="step">
      <div class="n">1</div>
      <div class="mini">${petCat}</div>
      <h3>Design</h3>
      <p>Make your pet in the browser — pick the parts, colors, and a little accessory. Free.</p>
    </div>
    <div class="step">
      <div class="n">2</div>
      <div class="mini">${petMint}</div>
      <h3>Adopt</h3>
      <p>Love her? One tap unlocks the desktop companion and your download.</p>
    </div>
    <div class="step">
      <div class="n">3</div>
      <div class="mini">${petBunny}</div>
      <h3>She's home</h3>
      <p>She hops out of the tab and onto your desktop — always in your corner.</p>
    </div>
  </section>

  <footer>
    Made with a tiny bit of magic and one very good dog. <span class="heart">♥</span><br>
    Pixll · Tool 01 of 100 · Vibe Coding
  </footer>
</div>`;

fs.writeFileSync(out, html);
console.log("wrote " + out);
