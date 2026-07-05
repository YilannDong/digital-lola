/*
 * Pixll — the things your pet says.
 * All lines are short, warm, low-key. Nothing like a system notification.
 */
(function (root) {
  // Tap-to-talk: general one-liners, mixed with time-aware ones at runtime.
  const TAP = [
    "hi 🌱",
    "you're doing okay.",
    "just hanging out here.",
    "take a breath?",
    "i'm glad you're here.",
    "little breaks are nice.",
    "you've got this.",
    "nothing to do, just vibing.",
    "psst… stretch your shoulders.",
    "one thing at a time.",
    "don't forget to blink.",
    "cozy.",
  ];

  const MORNING = [
    "morning ☀️",
    "slow start is fine.",
    "did you have water yet?",
    "new day, no rush.",
  ];
  const AFTERNOON = [
    "afternoon dip? me too.",
    "maybe a little stretch.",
    "still here with you.",
    "halfway there.",
  ];
  const EVENING = [
    "evening 🌆",
    "winding down soon?",
    "you did enough today.",
    "soft evening to you.",
  ];
  const NIGHT = [
    "it's getting late 🌙",
    "maybe start winding down?",
    "screens off soon? your eyes will thank you.",
    "rest is productive too.",
    "i'll be here tomorrow — go rest 💤",
  ];

  // Gentle reminders that surface on a timer.
  const REMINDERS = [
    "sip some water 💧",
    "roll your shoulders back 🙆",
    "look at something far away for a sec 👀",
    "quick stretch? 🌿",
    "unclench your jaw 🙂",
    "stand up and wiggle 🦖",
  ];

  function bucket(hour) {
    if (hour >= 5 && hour < 12) return "morning";
    if (hour >= 12 && hour < 17) return "afternoon";
    if (hour >= 17 && hour < 22) return "evening";
    return "night";
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Tap line: 60% general, 40% time-flavored.
  function tapLine(date) {
    const h = (date || new Date()).getHours();
    const timed = { morning: MORNING, afternoon: AFTERNOON, evening: EVENING, night: NIGHT }[bucket(h)];
    return Math.random() < 0.4 ? pick(timed) : pick(TAP);
  }

  // Reminder line: during night hours, bias toward the wind-down nudge.
  function reminderLine(date) {
    const h = (date || new Date()).getHours();
    if (bucket(h) === "night" && Math.random() < 0.6) return pick(NIGHT);
    return pick(REMINDERS);
  }

  const api = { tapLine, reminderLine, bucket, pick };
  root.PixllMessages = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
