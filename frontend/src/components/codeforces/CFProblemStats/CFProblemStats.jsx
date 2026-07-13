import React, { useMemo } from "react";
import { getRatingColor } from "../cfColors";
import "./CFProblemStats.css";

const BUCKET_STEP = 200;

export default function CFProblemStats({ submissions = [] }) {
  const buckets = useMemo(() => {
    const solved = new Map();
    for (const s of submissions) {
      if (s.verdict !== "OK") continue;
      const p = s.problem;
      if (!p) continue;
      const key = `${p.contestId}-${p.index}`;
      if (!solved.has(key)) solved.set(key, p);
    }

    const counts = {};
    for (const p of solved.values()) {
      if (!p.rating) continue;
      const bucket = Math.floor(p.rating / BUCKET_STEP) * BUCKET_STEP;
      counts[bucket] = (counts[bucket] || 0) + 1;
    }

    const entries = Object.entries(counts)
      .map(([rating, count]) => ({ rating: Number(rating), count }))
      .sort((a, b) => a.rating - b.rating);

    const maxCount = Math.max(1, ...entries.map((e) => e.count));
    const totalSolved = solved.size;
    const unrated = totalSolved - entries.reduce((s, e) => s + e.count, 0);

    return { entries, maxCount, totalSolved, unrated };
  }, [submissions]);

  return (
    <div className="cfp2-card">
      <div className="cfp2-header">
        <h3 className="cfp2-title">Problems by Rating</h3>
        <span className="cfp2-total">{buckets.totalSolved} solved</span>
      </div>

      {buckets.entries.length === 0 ? (
        <p className="cfp2-empty">No solved problems with a rating yet.</p>
      ) : (
        <div className="cfp2-bars">
          {buckets.entries.map((e) => (
            <div className="cfp2-row" key={e.rating}>
              <span className="cfp2-row-label" style={{ color: getRatingColor(e.rating) }}>
                {e.rating}
              </span>
              <div className="cfp2-bar-track">
                <div
                  className="cfp2-bar-fill"
                  style={{
                    width: `${(e.count / buckets.maxCount) * 100}%`,
                    background: getRatingColor(e.rating),
                  }}
                />
              </div>
              <span className="cfp2-row-count">{e.count}</span>
            </div>
          ))}
          {buckets.unrated > 0 && (
            <div className="cfp2-row">
              <span className="cfp2-row-label cfp2-row-label-muted">Unrated</span>
              <div className="cfp2-bar-track">
                <div
                  className="cfp2-bar-fill"
                  style={{
                    width: `${(buckets.unrated / buckets.maxCount) * 100}%`,
                    background: "var(--text-muted)",
                  }}
                />
              </div>
              <span className="cfp2-row-count">{buckets.unrated}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}