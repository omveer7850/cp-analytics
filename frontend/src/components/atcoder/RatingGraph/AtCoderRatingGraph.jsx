import { useState, useMemo } from "react";
import "./AtCoderRatingGraph.css";
import { getRankInfo } from "../../../services/atcoder";

const RATING_BANDS = [
  { min: 0, max: 400, color: "#80808022", label: "Gray" },
  { min: 400, max: 800, color: "#80400022", label: "Brown" },
  { min: 800, max: 1200, color: "#00800022", label: "Green" },
  { min: 1200, max: 1600, color: "#00C0C022", label: "Cyan" },
  { min: 1600, max: 2000, color: "#0000FF22", label: "Blue" },
  { min: 2000, max: 2400, color: "#C0C00022", label: "Yellow" },
  { min: 2400, max: 2800, color: "#FF800022", label: "Orange" },
  { min: 2800, max: 5000, color: "#FF000022", label: "Red" },
];

export default function AtCoderRatingGraph({ history }) {
  const [tooltip, setTooltip] = useState(null);
  const [range, setRange] = useState(25);

  if (!history.length) return null;

  const filteredHistory = useMemo(() => {
    if (range === "all") return history;
    return history.slice(-range);
  }, [history, range]);

  const W = 640;
  const H = 240;
  const PAD = { top: 20, right: 20, bottom: 40, left: 52 };

  const iW = W - PAD.left - PAD.right;
  const iH = H - PAD.top - PAD.bottom;

  const ratings = filteredHistory.map((h) => h.newRating);

  const minR = Math.max(0, Math.min(...ratings) - 100);
  const maxR = Math.min(5000, Math.max(...ratings) + 100);

  const xScale = (i) =>
    PAD.left + (i / Math.max(filteredHistory.length - 1, 1)) * iW;

  const yScale = (r) =>
    PAD.top + iH - ((r - minR) / (maxR - minR)) * iH;

  const points = filteredHistory.map((h, i) => ({
    x: xScale(i),
    y: yScale(h.newRating),
    ...h,
  }));

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`)
    .join(" ");

  const areaPath = `${linePath} L${points[points.length - 1].x},${
    PAD.top + iH
  } L${PAD.left},${PAD.top + iH} Z`;

  const yTicks = [0, 400, 800, 1200, 1600, 2000, 2400, 2800, 3200, 3600, 4000]
    .filter((t) => t >= minR && t <= maxR);

  return (
    <div className="arg-card">
      <div className="arg-header">
        <span className="arg-title">Rating History</span>

        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {[10, 25, 50, "all"].map((r) => (
            <button
              key={r}
              className={`arg-range-btn ${
                range === r ? "arg-range-btn-active" : ""
              }`}
              onClick={() => setRange(r)}
            >
              {r === "all" ? "All" : r}
            </button>
          ))}

          <span
            className="arg-badge"
            style={{
              color: getRankInfo(Math.max(...ratings)).color,
              background:
                getRankInfo(Math.max(...ratings)).color + "18",
              border: `1px solid ${
                getRankInfo(Math.max(...ratings)).color
              }40`,
            }}
          >
            Peak: {Math.max(...ratings)}
          </span>

          <span
            className="arg-badge"
            style={{
              color: getRankInfo(ratings[ratings.length - 1]).color,
              background:
                getRankInfo(ratings[ratings.length - 1]).color +
                "18",
              border: `1px solid ${
                getRankInfo(ratings[ratings.length - 1]).color
              }40`,
            }}
          >
            Current: {ratings[ratings.length - 1]}
          </span>

          <span className="arg-badge arg-badge--neutral">
            {range === "all"
              ? `${history.length} contests`
              : `Last ${filteredHistory.length} contests`}
          </span>
        </div>
      </div>

      <div className="arg-svg-wrap">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="arg-svg"
          preserveAspectRatio="xMidYMid meet"
        >
          {RATING_BANDS.map((band) => {
            const y1 = yScale(Math.min(band.max, maxR));
            const y2 = yScale(Math.max(band.min, minR));

            if (band.min > maxR || band.max < minR) return null;

            return (
              <rect
                key={band.label}
                x={PAD.left}
                y={y1}
                width={iW}
                height={y2 - y1}
                fill={band.color}
              />
            );
          })}

          {yTicks.map((t) => (
            <g key={t}>
              <line
                x1={PAD.left}
                x2={PAD.left + iW}
                y1={yScale(t)}
                y2={yScale(t)}
                stroke="var(--border)"
                strokeWidth="0.5"
                strokeDasharray="3,3"
              />

              <text
                x={PAD.left - 6}
                y={yScale(t) + 4}
                textAnchor="end"
                fontSize="10"
                fill="var(--text-muted)"
              >
                {t}
              </text>
            </g>
          ))}

          <defs>
            <linearGradient id="acGrad" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="#4f46e5"
                stopOpacity="0.18"
              />
              <stop
                offset="100%"
                stopColor="#4f46e5"
                stopOpacity="0"
              />
            </linearGradient>
          </defs>

          <path d={areaPath} fill="url(#acGrad)" />

          <path
            d={linePath}
            fill="none"
            stroke="#4f46e5"
            strokeWidth="2"
          />

          {points.map((p, i) => {
            const info = getRankInfo(p.newRating);

            return (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={i === points.length - 1 ? 5 : 4}
                fill={info.color}
                stroke="#fff"
                strokeWidth="1.5"
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setTooltip(p)}
                onMouseLeave={() => setTooltip(null)}
              />
            );
          })}

          {points
            .filter(
              (_, i) =>
                i %
                  Math.max(
                    1,
                    Math.floor(points.length / 8)
                  ) ===
                0
            )
            .map((p, i) => (
              <text
                key={i}
                x={p.x}
                y={H - 8}
                textAnchor="middle"
                fontSize="9"
                fill="var(--text-muted)"
              >
                {p.date?.slice(0, 7)}
              </text>
            ))}
        </svg>

        {tooltip && (
          <div className="arg-tooltip">
            <div className="arg-tip-title">
              {tooltip.contestName}
            </div>

            <div className="arg-tip-row">
              <span>Rating</span>
              <span
                style={{
                  color: getRankInfo(tooltip.newRating).color,
                  fontWeight: 700,
                }}
              >
                {tooltip.newRating}
              </span>
            </div>

            <div className="arg-tip-row">
              <span>Change</span>
              <span
                style={{
                  color:
                    tooltip.change >= 0
                      ? "#22c55e"
                      : "#ef4444",
                }}
              >
                {tooltip.change >= 0
                  ? `+${tooltip.change}`
                  : tooltip.change}
              </span>
            </div>

            <div className="arg-tip-row">
              <span>Rank</span>
              <span>#{tooltip.rank}</span>
            </div>

            <div className="arg-tip-row">
              <span>Performance</span>
              <span>{tooltip.performance}</span>
            </div>

            <div className="arg-tip-date">
              {tooltip.date}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}