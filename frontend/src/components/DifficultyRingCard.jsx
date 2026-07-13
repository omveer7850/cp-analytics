import { useEffect, useState } from 'react';
import { SHEET_LIST, getDifficultyStats } from '../utils/dsaProgress';
import { useAuth } from '../context/AuthContext';

const DIFFICULTY_META = [
  { key: 'Easy', color: '#0ea86c' },
  { key: 'Medium', color: '#d97a06' },
  { key: 'Hard', color: '#e4423f' },
];

const OPTIONS = [{ id: 'all', label: 'All Sheets' }, ...SHEET_LIST];

const EMPTY_STATS = { Easy: { solved: 0, total: 0 }, Medium: { solved: 0, total: 0 }, Hard: { solved: 0, total: 0 } };

export default function DifficultyRingCard() {
  const { user } = useAuth();
  const [selected, setSelected] = useState('all');
  const [stats, setStats] = useState(EMPTY_STATS);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    getDifficultyStats(user.id, selected).then((data) => {
      if (!cancelled) setStats(data);
    });
    return () => { cancelled = true; };
  }, [user, selected]);

  const total = DIFFICULTY_META.reduce((sum, { key }) => sum + (stats[key]?.total || 0), 0);
  const solvedTotal = DIFFICULTY_META.reduce((sum, { key }) => sum + (stats[key]?.solved || 0), 0);

  const size = 128;
  const stroke = 7;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const gap = 3;

  let cumulative = 0;
  const arcs = DIFFICULTY_META.map(({ key, color }) => {
    const solvedCount = stats[key]?.solved || 0;
    const rawLen = total > 0 ? (solvedCount / total) * circumference : 0;
    const len = Math.max(rawLen - gap, 0);
    const arc = { key, color, len, offset: -cumulative };
    cumulative += rawLen;
    return arc;
  }).filter((arc) => arc.len > 0);

  return (
    <div className="diff-ring-card">
      <div className="diff-ring-card__selector">
        {OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`diff-ring-card__chip ${selected === opt.id ? 'active' : ''}`}
            onClick={() => setSelected(opt.id)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="diff-ring-card__body">
        <div className="diff-ring-wrap">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--border)" strokeWidth={stroke} />
            {arcs.map((arc) => (
              <circle
                key={arc.key}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={arc.color}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={`${arc.len} ${circumference - arc.len}`}
                strokeDashoffset={arc.offset}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                style={{ transition: 'stroke-dasharray 0.5s ease, stroke-dashoffset 0.5s ease' }}
              />
            ))}
          </svg>
          <div className="diff-ring-center">
            <span className="diff-ring-solved">{solvedTotal}</span>
            <span className="diff-ring-divider">/{total}</span>
            <span className="diff-ring-caption">Solved</span>
          </div>
        </div>

        <div className="diff-ring-legend">
          {DIFFICULTY_META.map(({ key, color }) => (
            <div className="diff-legend-row" key={key}>
              <span className="diff-legend-dot" style={{ background: color }} />
              <span className="diff-legend-label">{key}</span>
              <span className="diff-legend-frac">
                {stats[key]?.solved || 0}
                <span className="diff-legend-frac-max">/{stats[key]?.total || 0}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}