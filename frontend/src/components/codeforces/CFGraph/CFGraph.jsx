import React, { useMemo, useState } from "react";
import { getRatingColor, formatDate } from "../cfColors";
import "./CFGraph.css";

const RANGE_OPTIONS = [10, 25, 50, "All"];

export default function CFGraph({ ratingHistory = [] }) {
  const [range, setRange] = useState(25);

  const peak = useMemo(
    () => ratingHistory.reduce((m, c) => Math.max(m, c.newRating), 0),
    [ratingHistory]
  );
  const current = ratingHistory.length
    ? ratingHistory[ratingHistory.length - 1].newRating
    : null;

  const shown =
    range === "All" ? ratingHistory : ratingHistory.slice(-range);

  if (!ratingHistory.length) {
    return (
      <div className="cfg-card">
        <div className="cfg-header">
          <h3 className="cfg-title">Rating History</h3>
        </div>
        <p className="cfg-empty">No rated contests yet.</p>
      </div>
    );
  }

  // ---- chart geometry ----
  const W = 1000;
  const H = 320;
  const PAD_L = 56;
  const PAD_R = 24;
  const PAD_T = 20;
  const PAD_B = 36;

  const values = shown.map((d) => d.newRating);
  const minV = Math.min(...values) - 100;
  const maxV = Math.max(...values) + 100;

  const xFor = (i) =>
    shown.length === 1
      ? (W - PAD_L - PAD_R) / 2 + PAD_L
      : PAD_L + (i * (W - PAD_L - PAD_R)) / (shown.length - 1);
  const yFor = (v) =>
    PAD_T + (H - PAD_T - PAD_B) * (1 - (v - minV) / (maxV - minV));

  const linePath = shown
    .map((d, i) => `${i === 0 ? "M" : "L"} ${xFor(i)} ${yFor(d.newRating)}`)
    .join(" ");

  const gridLines = 5;
  const gridStep = (maxV - minV) / gridLines;

  const xLabelEvery = Math.max(1, Math.ceil(shown.length / 7));

  return (
    <div className="cfg-card">
      <div className="cfg-header">
        <h3 className="cfg-title">Rating History</h3>
        <div className="cfg-badges">
          <span className="cfg-badge cfg-badge-peak">Peak: {peak}</span>
          <span className="cfg-badge cfg-badge-current">Current: {current}</span>
          <span className="cfg-badge">{shown.length} contests</span>
        </div>
      </div>

      <div className="cfg-range-btns">
        {RANGE_OPTIONS.map((r) => (
          <button
            key={r}
            className={`cfg-range-btn ${range === r ? "cfg-range-btn-active" : ""}`}
            onClick={() => setRange(r)}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="cfg-svg-wrap">
        <svg viewBox={`0 0 ${W} ${H}`} className="cfg-svg" preserveAspectRatio="none">
          {[...Array(gridLines + 1)].map((_, i) => {
            const v = Math.round(minV + gridStep * i);
            const y = yFor(v);
            return (
              <g key={i}>
                <line
                  x1={PAD_L} x2={W - PAD_R} y1={y} y2={y}
                  className="cfg-grid-line"
                />
                <text x={PAD_L - 10} y={y + 4} textAnchor="end" className="cfg-axis-text">
                  {v}
                </text>
              </g>
            );
          })}

          <path d={linePath} className="cfg-line" fill="none" />

          {shown.map((d, i) => (
            <circle
              key={d.ratingUpdateTimeSeconds ?? i}
              cx={xFor(i)}
              cy={yFor(d.newRating)}
              r={i === shown.length - 1 ? 6 : 4}
              fill={getRatingColor(d.newRating)}
              stroke="var(--bg-white)"
              strokeWidth="1.5"
            >
              <title>
                {d.contestName}: {d.newRating} ({formatDate(d.ratingUpdateTimeSeconds)})
              </title>
            </circle>
          ))}

          {shown.map((d, i) =>
            i % xLabelEvery === 0 ? (
              <text
                key={`lbl-${i}`}
                x={xFor(i)}
                y={H - PAD_B + 20}
                textAnchor="middle"
                className="cfg-axis-text"
              >
                {formatDate(d.ratingUpdateTimeSeconds).replace(/ \d{4}$/, "")}
              </text>
            ) : null
          )}
        </svg>
      </div>
    </div>
  );
}