---
name: reel-script
description: Write a 60-second vertical reel script + film notes for a "Building 100 Tools with Vibe Coding" episode. Use when the user finishes a tool and wants the launch reel scripted in the series' shot-by-shot format (Hook → Setup → Spark → Build → Payoff → CTA), with mute-first burned-in captions, teleprompter voiceover, three A/B hooks, and a caption + hashtags for the post. Triggers on "reel", "reel script", "video script", "script this tool", "make the reel", "film notes".
---

# Reel Script — Building 100 Tools with Vibe Coding

Produce the launch reel for one tool in the series. Output is warm, personal, and
designer-led — the emotion sells the tool; the tech rides along in plain words.
The gold-standard worked example is Tool 01 (Meta-Lola) in `story/script.md`.

## 1. Gather inputs (ask only for what's missing)

- **Tool number & name** (e.g. `02 · <name>`).
- **What it does** — in one plain sentence a non-engineer gets.
- **The personal spark** — why the user built it; the human hook. This is the most
  important input. If there isn't one, find the closest real motivation.
- **How it was built** — the honest process (what they directed, what the AI did).
  Never invent steps; mirror what actually happened.
- **Footage available** — screenshots / screen recordings, so shot notes are real.

If the spark or the build process is unclear, ask before writing — the story must be true.

## 2. Structure — six beats, 60 seconds, ~150 words of VO

Keep these timings (they sum to 0:60). Adjust ±2s only if a beat needs it.

| Beat | Time | Job |
|------|------|-----|
| 🎣 **Hook** | 0:00–0:03 | Stop the scroll. A surprising real→product cut or a bold claim. |
| **Setup** | 0:03–0:11 | The itch — why this tool needed to exist, personally. |
| **Spark** | 0:11–0:22 | The insight / where the idea came from. |
| ⚙️ **Build** | 0:22–0:40 | How it was made — "I directed, the AI wrote the code," in plain words. |
| 🥹 **Payoff** | 0:40–0:52 | The result in use + an honest, likable human line. |
| 📣 **CTA** | 0:52–0:60 | "Tool N of 100 · Vibe Coding · follow the series." |

**Word budget:** ~150 words of VO total (≈160 wpm). Count it; trim to fit 60s.

## 3. Voice & tone

- First person, warm, casual. Lead with feeling, not features.
- One plain-language line explains the whole tech ("it's a recipe of parts").
- Keep a self-aware, human beat in the Payoff — it disarms and it's memorable.
- Never jargon-dump. A little real terminology (glossed) signals competence for
  recruiters/clients; too much loses everyone.
- The **Build** beat should show the user *directing* the AI — that's the series' whole
  premise and what makes it aspirational.

## 4. Output — two deliverables

### A) `script.md`
1. A **shot-by-shot table**: `Time | Shot / Visual | On-screen text | Voiceover`.
2. A **teleprompter block** — VO only, clean, for recording.
3. **Three alternate hooks** to A/B (swap the 0–3s line). Recommend the one that best
   front-loads the "vibe coding" promise.

### B) `film-notes.md`
- **B-roll / screen-rec checklist** (tickable) grounded in the actual footage.
- **Editing recipe:** 9:16, burned-in captions, cut every 2–3s in the Build, soft
  kawaii lo-fi music, a small "pop" SFX on the key interaction.
- **Series end-card:** reuse the fixed 2-sec "Tool N / 100 · Vibe Coding" card.
- **Caption + hashtags** for the post.
- **Thumbnail idea:** keep one repeatable composition across episodes; only the pet/tool
  and number change.

Save both into that tool's `story/` folder.

## 5. Fixed principles (every episode)

- **The hook is ~80% of reach.** Spend the most effort here; always give 3 to test.
- **Captions always on / burned in** — most viewers are muted; the on-screen lines must
  carry the story silently.
- **Pace:** cuts every 2–3s through the Build so it never feels like a lecture.
- **Series consistency:** same end-card, same thumbnail composition, same voice — that
  repetition is what makes it read as a *show*, not scattered clips.
