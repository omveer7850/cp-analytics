import './GithubStatsCards.css';

export default function GithubStatsCards({ profile, stats }) {
  const cards = [
    { label: 'Total Stars',    value: stats.totalStars?.toLocaleString(),   color: '#f59e0b' },
    { label: 'Total Forks',    value: stats.totalForks?.toLocaleString(),   color: '#4f46e5' },
    { label: 'Followers',      value: profile.followers?.toLocaleString(),  color: '#22c55e' },
    { label: 'Following',      value: profile.following?.toLocaleString(),  color: '#06b6d4' },
    { label: 'Repositories',   value: profile.public_repos?.toLocaleString(), color: '#8b5cf6' },
    { label: 'Gists',          value: profile.public_gists?.toLocaleString(), color: '#ec4899' },
    { label: 'Top Language',   value: stats.mostUsedLang,                  color: '#f89a1c' },
    { label: 'Account Age',    value: stats.accountAge !== 'N/A' ? `${stats.accountAge}y` : 'N/A', color: '#64748b' },
  ].filter((c) => c.value !== undefined && c.value !== null && c.value !== '0' && c.value !== 0);

  return (
    <div className="ghsc-grid">
      {cards.map((c) => (
        <div key={c.label} className="ghsc-card" style={{ '--card-color': c.color }}>
          <span className="ghsc-dot" style={{ background: c.color }} />
          <span className="ghsc-val" style={{ color: c.color }}>{c.value}</span>
          <span className="ghsc-lbl">{c.label}</span>
        </div>
      ))}
    </div>
  );
}