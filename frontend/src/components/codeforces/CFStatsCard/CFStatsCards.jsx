import React, { useMemo } from "react";
import "./CFStatsCards.css";

export default function CFStatsCards({ user, ratingHistoryCount = 0, submissions = [] }) {
  const { solved, totalSubs, acRate } = useMemo(() => {
    const seen = new Set();
    let ac = 0;
    for (const s of submissions) {
      if (s.verdict === "OK") {
        const key = `${s.problem?.contestId}-${s.problem?.index}`;
        if (!seen.has(key)) {
          seen.add(key);
          ac++;
        }
      }
    }
    const total = submissions.length;
    return {
      solved: seen.size,
      totalSubs: total,
      acRate: total ? Math.round((ac / total) * 100) : 0,
    };
  }, [submissions]);

  const cards = [
    { label: "Current Rating", value: user?.rating ?? "—", color: "#2563eb" },
    { label: "Max Rating", value: user?.maxRating ?? "—", color: "#7c3aed" },
    { label: "Problems Solved", value: solved, color: "#16a34a" },
    { label: "Total Submissions", value: totalSubs, color: "#ea580c" },
    { label: "Contests Given", value: ratingHistoryCount, color: "#db2777" },
    { label: "Acceptance Rate", value: `${acRate}%`, color: "#0891b2" },
  ];

  return (
    <div className="cfs-grid">
      {cards.map((c) => (
        <div className="cfs-card" key={c.label}>
          <span className="cfs-dot" style={{ background: c.color }} />
          <span className="cfs-value" style={{ color: c.color }}>
            {c.value}
          </span>
          <span className="cfs-label">{c.label}</span>
        </div>
      ))}
    </div>
  );
}