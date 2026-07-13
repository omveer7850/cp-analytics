// Shared helpers used across every Codeforces component.
// Keeping this in one place means every card, badge and dot
// uses exactly the same colour for a given rating.

export function getRatingColor(rating) {
  if (rating == null) return "#767676";
  if (rating < 1200) return "#767676";
  if (rating < 1400) return "#008000";
  if (rating < 1600) return "#03a89e";
  if (rating < 1900) return "#0000ff";
  if (rating < 2100) return "#aa00aa";
  if (rating < 2400) return "#ff8c00";
  return "#ff0000";
}

export function getRatingBg(rating) {
  if (rating == null) return "rgba(118,118,118,0.12)";
  if (rating < 1200) return "rgba(118,118,118,0.12)";
  if (rating < 1400) return "rgba(0,128,0,0.12)";
  if (rating < 1600) return "rgba(3,168,158,0.12)";
  if (rating < 1900) return "rgba(0,0,255,0.10)";
  if (rating < 2100) return "rgba(170,0,170,0.12)";
  if (rating < 2400) return "rgba(255,140,0,0.14)";
  return "rgba(255,0,0,0.12)";
}

export function formatDate(seconds) {
  if (!seconds) return "—";
  return new Date(seconds * 1000).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function timeAgo(seconds) {
  if (!seconds) return "—";
  const diff = Date.now() / 1000 - seconds;
  const mins = Math.floor(diff / 60);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export function verdictLabel(verdict) {
  const map = {
    OK: "Accepted",
    WRONG_ANSWER: "Wrong Answer",
    TIME_LIMIT_EXCEEDED: "TLE",
    MEMORY_LIMIT_EXCEEDED: "MLE",
    RUNTIME_ERROR: "Runtime Error",
    COMPILATION_ERROR: "Compile Error",
    CHALLENGED: "Hacked",
    SKIPPED: "Skipped",
    TESTING: "Testing",
    PARTIAL: "Partial",
  };
  return map[verdict] || (verdict || "Unknown").replace(/_/g, " ");
}

export function verdictColor(verdict) {
  if (verdict === "OK") return "#16a34a";
  if (verdict === "TESTING" || verdict === "PARTIAL") return "#d97706";
  return "#ef4444";
}