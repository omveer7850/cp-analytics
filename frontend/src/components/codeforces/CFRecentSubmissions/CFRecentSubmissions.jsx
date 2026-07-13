import React, { useMemo } from "react";
import { getRatingColor, timeAgo, verdictLabel, verdictColor } from "../cfColors";
import "./CFRecentSubmissions.css";

export default function CFRecentSubmissions({ submissions = [] }) {
  const recent = useMemo(
    () =>
      [...submissions]
        .sort((a, b) => b.creationTimeSeconds - a.creationTimeSeconds)
        .slice(0, 15),
    [submissions]
  );

  return (
    <div className="cfr-card">
      <div className="cfr-header">
        <h3 className="cfr-title">Recent Submissions</h3>
        <span className="cfr-total">{submissions.length} total</span>
      </div>

      {recent.length === 0 ? (
        <p className="cfr-empty">No submissions found.</p>
      ) : (
        <div className="cfr-list">
          {recent.map((s) => (
            <div className="cfr-row" key={s.id}>
              <div className="cfr-row-main">
                <span className="cfr-problem-name">
                  {s.problem?.index}. {s.problem?.name}
                </span>
                <div className="cfr-row-meta">
                  {s.problem?.rating && (
                    <span
                      className="cfr-rating-chip"
                      style={{ color: getRatingColor(s.problem.rating) }}
                    >
                      {s.problem.rating}
                    </span>
                  )}
                  <span className="cfr-lang">{s.programmingLanguage}</span>
                  <span className="cfr-time">{timeAgo(s.creationTimeSeconds)}</span>
                </div>
              </div>
              <span
                className="cfr-verdict"
                style={{
                  color: verdictColor(s.verdict),
                  background:
                    verdictColor(s.verdict) === "#16a34a"
                      ? "rgba(22,163,74,0.12)"
                      : "rgba(239,68,68,0.1)",
                }}
              >
                {verdictLabel(s.verdict)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}