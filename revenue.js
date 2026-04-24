// ─── revenue.js ─── Milestone 2: Peak/Off-Peak Revenue Engine ───────────────

const FARES = {
  peak: {
    min: 1.7, // Child Zip Oyster (capped estimate)
    max: 5.25, // Adult Peak Zone 1–2 contactless
    label: "Peak",
  },
  offPeak: {
    min: 1.7, // Child Zip Oyster
    max: 3.4, // Adult Off-Peak Zone 1–2
    label: "Off-Peak",
  },
};

/**
 * isPeak()
 * Returns true if the current time falls within a peak-period fare window.
 * Peak: Mon–Fri 06:30–09:30 and 16:00–19:00
 * Everything else (weekends, late nights, shoulders) = Off-Peak
 */
function isPeak() {
  const now = new Date();
  const day = now.getDay(); // 0 = Sun, 6 = Sat
  const h = now.getHours();
  const m = now.getMinutes();
  const mins = h * 60 + m; // total minutes since midnight — clean comparison

  const isWeekday = day >= 1 && day <= 5;
  if (!isWeekday) return false;

  const amPeakStart = 6 * 60 + 30; // 06:30
  const amPeakEnd = 9 * 60 + 30; // 09:30
  const pmPeakStart = 16 * 60; // 16:00
  const pmPeakEnd = 19 * 60; // 19:00

  return (
    (mins >= amPeakStart && mins < amPeakEnd) ||
    (mins >= pmPeakStart && mins < pmPeakEnd)
  );
}

/**
 * getCurrentFares()
 * Returns the correct fare band object based on current time.
 * Always call this at the moment of logging — not at shift start.
 */
function getCurrentFares() {
  return isPeak() ? FARES.peak : FARES.offPeak;
}

// ─── Quick sanity test (remove before production) ───────────────────────────
// console.log("isPeak:", isPeak(), "| Fares:", getCurrentFares());
