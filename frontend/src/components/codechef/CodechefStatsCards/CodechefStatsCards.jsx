import './CodechefStatsCards.css';

function getStarColor(stars) {
  if (!stars) return '#5b4638';
  const n = parseInt(stars);
  if (n >= 7) return '#FF0000';
  if (n >= 6) return '#FF8000';
  if (n >= 5) return '#FFD700';
  if (n >= 4) return '#0000FF';
  if (n >= 3) return '#00C0C0';
  if (n >= 2) return '#008000';
  return '#808080';
}

export default function CodechefStatsCards({ profile, stats }) {
  const starColor = getStarColor(profile.stars);

  const cards = [
    { label: 'Current Rating', value: profile.currentRating, color: starColor  },
    { label: 'Highest Rating', value: profile.highestRating, color: '#f59e0b'  },
    { label: 'Stars',          value: profile.stars ?? 'N/A', color: starColor },
    { label: 'Global Rank',    value: profile.globalRank !== 'N/A' ? `#${profile.globalRank}` : 'N/A', color: '#8b5cf6' },
    { label: 'Country Rank',   value: profile.countryRank !== 'N/A' ? `#${profile.countryRank}` : 'N/A', color: '#06b6d4' },
    { label: 'Contests',       value: stats.contestCount ?? 0, color: '#4f46e5' },
    { label: 'Best Rank',      value: stats.bestRank !== 'N/A' && stats.bestRank !== Infinity ? `#${stats.bestRank}` : 'N/A', color: '#22c55e' },
  ].filter((c) => c.value !== 'N/A' && c.value !== 0 && c.value !== '#N/A');

  return (
    <div className="ccsc-grid">
      {cards.map((c) => (
        <div key={c.label} className="ccsc-card" style={{ '--card-color': c.color }}>
          <span className="ccsc-dot" style={{ background: c.color }} />
          <span className="ccsc-val" style={{ color: c.color }}>{c.value}</span>
          <span className="ccsc-lbl">{c.label}</span>
        </div>
      ))}
    </div>
  );
}