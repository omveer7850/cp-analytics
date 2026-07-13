import { useState } from 'react';
import './CodechefRatingGraph.css';

const RATING_BANDS = [
  { min: 0,    max: 1400, color: '#80808018', label: '1★' },
  { min: 1400, max: 1600, color: '#00800018', label: '2★' },
  { min: 1600, max: 1800, color: '#00C0C018', label: '3★' },
  { min: 1800, max: 2000, color: '#0000FF18', label: '4★' },
  { min: 2000, max: 2200, color: '#FFD70018', label: '5★' },
  { min: 2200, max: 2500, color: '#FF800018', label: '6★' },
  { min: 2500, max: 4000, color: '#FF000018', label: '7★' },
];

function getColor(rating) {
  if (rating >= 2500) return '#FF0000';
  if (rating >= 2200) return '#FF8000';
  if (rating >= 2000) return '#FFD700';
  if (rating >= 1800) return '#0000FF';
  if (rating >= 1600) return '#00C0C0';
  if (rating >= 1400) return '#008000';
  return '#808080';
}

export default function CodechefRatingGraph({ history }) {
  const [tooltip, setTooltip] = useState(null);

  const rated = history.filter((h) => h.rating > 0);
  if (rated.length < 2) return null;

  const reversed = [...rated].reverse();

  const W = 640, H = 240;
  const PAD = { top: 20, right: 20, bottom: 40, left: 52 };
  const iW  = W - PAD.left - PAD.right;
  const iH  = H - PAD.top  - PAD.bottom;

  const ratings  = reversed.map((h) => h.rating);
  const minR     = Math.max(0,    Math.min(...ratings) - 100);
  const maxR     = Math.min(4000, Math.max(...ratings) + 100);

  const xScale = (i) => PAD.left + (i / (reversed.length - 1)) * iW;
  const yScale = (r) => PAD.top  + iH - ((r - minR) / (maxR - minR)) * iH;

  const points   = reversed.map((h, i) => ({ x: xScale(i), y: yScale(h.rating), ...h }));
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaPath = `${linePath} L${points[points.length-1].x},${PAD.top+iH} L${PAD.left},${PAD.top+iH} Z`;

  const yTicks = [1400, 1600, 1800, 2000, 2200, 2500]
    .filter((t) => t >= minR && t <= maxR);

  const maxRating  = Math.max(...ratings);
  const currRating = ratings[ratings.length - 1];

  return (
    <div className="ccrg-card">
      <div className="ccrg-header">
        <span className="ccrg-title">Rating History</span>
        <div className="ccrg-badges">
          <span className="ccrg-badge" style={{ color: getColor(maxRating), background: getColor(maxRating) + '18', border: `1px solid ${getColor(maxRating)}40` }}>
            Peak: {maxRating}
          </span>
          <span className="ccrg-badge" style={{ color: getColor(currRating), background: getColor(currRating) + '18', border: `1px solid ${getColor(currRating)}40` }}>
            Current: {currRating}
          </span>
          <span className="ccrg-badge ccrg-badge--neutral">{reversed.length} contests</span>
        </div>
      </div>

      <div className="ccrg-svg-wrap">
        <svg viewBox={`0 0 ${W} ${H}`} className="ccrg-svg" preserveAspectRatio="xMidYMid meet">
          {RATING_BANDS.map((band) => {
            if (band.min > maxR || band.max < minR) return null;
            const y1 = yScale(Math.min(band.max, maxR));
            const y2 = yScale(Math.max(band.min, minR));
            return (
              <rect key={band.label} x={PAD.left} y={y1} width={iW} height={y2 - y1} fill={band.color} />
            );
          })}

          {yTicks.map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={PAD.left+iW} y1={yScale(t)} y2={yScale(t)}
                stroke="var(--border)" strokeWidth="0.5" strokeDasharray="3,3" />
              <text x={PAD.left - 6} y={yScale(t) + 4}
                textAnchor="end" fontSize="10" fill="var(--text-muted)">{t}</text>
            </g>
          ))}

          <defs>
            <linearGradient id="ccGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#5b4638" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#5b4638" stopOpacity="0"   />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#ccGrad)" />
          <path d={linePath} fill="none" stroke="#5b4638" strokeWidth="2" strokeLinejoin="round" />

          {points.map((p, i) => (
            <circle key={i}
              cx={p.x} cy={p.y}
              r={i === points.length - 1 ? 5 : 3}
              fill={getColor(p.rating)}
              stroke="#fff" strokeWidth="1.5"
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setTooltip({ ...p, i })}
              onMouseLeave={() => setTooltip(null)}
            />
          ))}

          {points.filter((_, i) => i % Math.ceil(points.length / 8) === 0).map((p, i) => (
            <text key={i} x={p.x} y={H - 8}
              textAnchor="middle" fontSize="9" fill="var(--text-muted)">
              {p.date?.slice(0, 7)}
            </text>
          ))}
        </svg>

        {tooltip && (
          <div className="ccrg-tooltip">
            <div className="ccrg-tip-title">{tooltip.contestName}</div>
            <div className="ccrg-tip-row">
              <span>Rating</span>
              <span style={{ color: getColor(tooltip.rating), fontWeight: 700 }}>{tooltip.rating}</span>
            </div>
            <div className="ccrg-tip-row">
              <span>Change</span>
              <span style={{ color: tooltip.change >= 0 ? '#22c55e' : '#ef4444', fontWeight: 600 }}>
                {tooltip.change >= 0 ? `+${tooltip.change}` : tooltip.change}
              </span>
            </div>
            <div className="ccrg-tip-row"><span>Rank</span><span>#{tooltip.rank}</span></div>
            <div className="ccrg-tip-date">{tooltip.date}</div>
          </div>
        )}
      </div>
    </div>
  );
}