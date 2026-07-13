import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SiLeetcode, SiCodeforces, SiGithub, SiCodechef } from 'react-icons/si';
import './Dashboard.css';
import './dashboard-additions.css';
import DifficultyRingCard from '../../components/DifficultyRingCard';
import { getAllSheetsProgress, getOverallProgress, getDifficultyStats } from '../../utils/dsaProgress';
import { useAuth } from '../../context/AuthContext';
import { getPlatforms } from '../../services/supabaseService';

function AtCoderIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2 L22 20 L2 20 Z" />
    </svg>
  );
}

const PLATFORM_META = [
  { key: 'leetcode', name: 'LeetCode', metric: 'problems solved', color: '#f89a1c', Icon: SiLeetcode },
  { key: 'codeforces', name: 'Codeforces', metric: 'current rating', color: '#4a90d9', Icon: SiCodeforces },
  { key: 'github', name: 'GitHub', metric: 'repositories', color: '#24292e', Icon: SiGithub },
  { key: 'codechef', name: 'CodeChef', metric: 'current rating', color: '#5b4638', Icon: SiCodechef },
  { key: 'atcoder', name: 'AtCoder', metric: 'contest rating', color: '#e53935', Icon: AtCoderIcon },
];

function extractMetricValue(platformKey, data) {
  if (!data) return null;
  switch (platformKey) {
    case 'leetcode':
      return data.totalSolved ?? null;
    case 'codeforces': {
      const entry = Array.isArray(data) ? data[0] : data;
      return entry?.rating ?? null;
    }
    case 'github':
      return data.public_repos ?? null;
    case 'codechef':
      return data.profile?.currentRating ?? null;
    case 'atcoder':
      return data.rating ?? null;
    default:
      return null;
  }
}

export default function Dashboard() {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good day' : 'Good evening';

  const [sheets, setSheets] = useState([]);
  const [overall, setOverall] = useState({ total: 0, solved: 0, percent: 0 });
  const [sheetsLoading, setSheetsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    Promise.all([getAllSheetsProgress(user.id), getOverallProgress(user.id)]).then(
      async ([sheetsData, overallData]) => {
        if (cancelled) return;
        const withDifficulty = await Promise.all(
          sheetsData.map(async (s) => ({
            ...s,
            difficulty: await getDifficultyStats(user.id, s.id),
          }))
        );
        if (cancelled) return;
        setSheets(withDifficulty);
        setOverall(overallData);
        setSheetsLoading(false);
      }
    );
    return () => { cancelled = true; };
  }, [user]);

  const [platformsByKey, setPlatformsByKey] = useState({});
  const [platformsLoading, setPlatformsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    getPlatforms(user.id).then((data) => {
      if (!cancelled) {
        setPlatformsByKey(data);
        setPlatformsLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [user]);

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard__header">
        <h1 className="dashboard__greeting">{greeting}! 👋</h1>
        <p className="dashboard__subtitle">Here's your competitive programming summary</p>
      </div>

      {}
      <section className="dashboard__section">
        <h2 className="dashboard__section-title">Platform Overview</h2>
        <div className="platform-grid">
          {PLATFORM_META.map((p) => {
            const connection = platformsByKey[p.key];
            const isConnected = Boolean(connection?.username);
            const value = extractMetricValue(p.key, connection?.data);
            const Icon = p.Icon;

            return (
              <Link to={`/platforms/${p.key}`} key={p.key} className="platform-card">
                <div className="platform-card__header">
                  <span className="platform-card__icon" style={{ color: p.color }}>
                    <Icon size={16} />
                  </span>
                  <span className="platform-card__name">{p.name}</span>
                </div>
                <div className="platform-card__value">{value ?? '—'}</div>
                <div className="platform-card__metric">{p.metric}</div>
                {platformsLoading ? (
                  <span className="platform-card__badge">Checking…</span>
                ) : isConnected ? (
                  <span className="platform-card__badge platform-card__badge--connected">
                    {connection.username}
                  </span>
                ) : (
                  <span className="platform-card__badge">Connect Platform</span>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {}
      <div className="dashboard__row">
        <section className="dashboard__section dashboard__section--grow">
          <h2 className="dashboard__section-title">DSA Sheets Progress</h2>
          <div className="sheets-card">
            {sheetsLoading ? (
              <div className="sheet-row__top" style={{ padding: '14px 0' }}>Loading…</div>
            ) : sheets.map((s) => {
              const d = s.difficulty || {};
              const easy = d.Easy || { solved: 0, total: 0 };
              const medium = d.Medium || { solved: 0, total: 0 };
              const hard = d.Hard || { solved: 0, total: 0 };
              const pct = (n) => (s.total > 0 ? (n / s.total) * 100 : 0);

              return (
                <Link to={`/dsa/${s.id}`} key={s.id} className="sheet-row">
                  <div className="sheet-row__top">
                    <span className="sheet-row__name">{s.label}</span>
                    <span className="sheet-row__frac">
                      {s.solved}/{s.total} <span className="sheet-row__pct">({s.percent}%)</span>
                    </span>
                  </div>
                  <div className="sheet-row__track sheet-row__track--stacked">
                    <div className="sheet-row__fill sheet-row__fill--easy" style={{ width: `${pct(easy.solved)}%` }} />
                    <div className="sheet-row__fill sheet-row__fill--medium" style={{ width: `${pct(medium.solved)}%` }} />
                    <div className="sheet-row__fill sheet-row__fill--hard" style={{ width: `${pct(hard.solved)}%` }} />
                  </div>
                  <div className="sheet-row__breakdown">
                    <span className="sheet-row__diff-item"><span className="sheet-row__dot sheet-row__dot--easy" />Easy {easy.solved}/{easy.total}</span>
                    <span className="sheet-row__diff-item"><span className="sheet-row__dot sheet-row__dot--medium" />Medium {medium.solved}/{medium.total}</span>
                    <span className="sheet-row__diff-item"><span className="sheet-row__dot sheet-row__dot--hard" />Hard {hard.solved}/{hard.total}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <div className="dashboard__col">
          <section className="dashboard__section">
            <h2 className="dashboard__section-title">Difficulty Breakdown</h2>
            <DifficultyRingCard />
          </section>

          <section className="dashboard__section">
            <h2 className="dashboard__section-title">Overall Progress</h2>
            <div className="overall-card">
              <div className="overall-card__pct">{overall.percent}%</div>
              <div className="overall-card__label">problems completed</div>
              <div className="overall-card__track">
                <div
                  className="overall-card__fill"
                  style={{ width: `${overall.percent}%` }}
                />
              </div>
              <div className="overall-card__frac">
                {overall.solved} of {overall.total} tracked problems solved
              </div>
            </div>
          </section>
        </div>
      </div>

      {}
      <section className="dashboard__section">
        <h2 className="dashboard__section-title">Quick Actions</h2>
        <div className="quick-actions">
          <Link to="/dsa/grind169" className="quick-action-btn">Continue Grind169</Link>
          <Link to="/dsa/striverA2Z" className="quick-action-btn">Continue Striver A2Z</Link>
          <Link to="/dsa/blind75" className="quick-action-btn">Continue Blind75</Link>
          <Link to="/dsa/neetcode150" className="quick-action-btn">Continue NeetCode150</Link>
          <Link to="/contests" className="quick-action-btn">Open Contests</Link>
          <Link to="/compare" className="quick-action-btn">Compare Users</Link>
          <button className="quick-action-btn" onClick={() => window.location.reload()}>
            Refresh Data
          </button>
        </div>
      </section>
    </div>
  );
}