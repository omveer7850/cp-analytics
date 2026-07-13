import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { sheetData } from '../../data/sheetData';
import { neetcode150 } from '../../data/sheets/neetcode150';
import { useAuth } from '../../context/AuthContext';
import { getSheetProgress, saveSheetProgress } from '../../services/supabaseService';
import '../../styles/dsa-module.css';

const ACCENT = '#4f46e5';

const DIFFICULTY_META = [
  { key: 'Easy', color: '#16a34a' },
  { key: 'Medium', color: '#d97706' },
  { key: 'Hard', color: '#dc2626' },
];

function BookmarkIcon({ filled }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? '#d97706' : 'none'} stroke={filled ? '#d97706' : '#9ca3af'} strokeWidth="2">
      <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" strokeLinejoin="round" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 3h7v7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 14 21 3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 14v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DifficultyRing({ stats, total, solvedTotal }) {
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
    <div className="ring-card">
      <div className="ring-wrap">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#eef0f3" strokeWidth={stroke} />
          {arcs.map((arc) => (
            <circle
              key={arc.key} cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={arc.color}
              strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${arc.len} ${circumference - arc.len}`}
              strokeDashoffset={arc.offset} transform={`rotate(-90 ${size / 2} ${size / 2})`} className="ring-arc"
            />
          ))}
        </svg>
        <div className="ring-center">
          <span className="ring-solved">{solvedTotal}</span>
          <span className="ring-divider">/{total}</span>
          <span className="ring-caption">Solved</span>
        </div>
      </div>
      <div className="ring-legend">
        {DIFFICULTY_META.map(({ key, color }) => (
          <div className="legend-row" key={key}>
            <span className="legend-dot" style={{ background: color }} />
            <span className="legend-label">{key}</span>
            <span className="legend-frac">
              {stats[key]?.solved || 0}<span className="legend-frac-max">/{stats[key]?.total || 0}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DSASheetPage() {
  const { sheetId } = useParams();
  const { user } = useAuth();

  const problems = useMemo(() => {
    if (sheetId === 'neetcode150') return neetcode150;
    return sheetData[sheetId]?.chunks?.[0]?.problems || [];
  }, [sheetId]);

  const sheetName = sheetId === 'neetcode150' ? "NeetCode 150" : (sheetData[sheetId]?.sheetName || "Sheet Not Found");

  const [openTopic, setOpenTopic] = useState(null);
  const [showRevisit, setShowRevisit] = useState(true);

  const [solved, setSolved] = useState([]);
  const [revisit, setRevisit] = useState([]);
  const [progressLoading, setProgressLoading] = useState(true);

  
  const [loadedKey, setLoadedKey] = useState(null);
  const currentKey = user ? `${user.id}:${sheetId}` : null;

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    (async () => {
      setProgressLoading(true);
      const remote = await getSheetProgress(user.id, sheetId);

      let nextSolved = remote.solved;
      let nextRevisit = remote.revisit;

     
      if (nextSolved.length === 0 && nextRevisit.length === 0) {
        const legacySolved = JSON.parse(localStorage.getItem(`solved-${sheetId}`)) || [];
        const legacyRevisit = JSON.parse(localStorage.getItem(`revisit-${sheetId}`)) || [];
        if (legacySolved.length > 0 || legacyRevisit.length > 0) {
          nextSolved = legacySolved;
          nextRevisit = legacyRevisit;
          await saveSheetProgress(user.id, sheetId, { solved: legacySolved, revisit: legacyRevisit });
        }
      }

      if (cancelled) return;
      setSolved(nextSolved);
      setRevisit(nextRevisit);
      setLoadedKey(`${user.id}:${sheetId}`);
      setProgressLoading(false);
    })();

    return () => { cancelled = true; };
  }, [user, sheetId]);

  
  useEffect(() => {
    if (!user || loadedKey !== currentKey) return;
    saveSheetProgress(user.id, sheetId, { solved, revisit });
  }, [solved, revisit, user, sheetId, loadedKey, currentKey]);

  const total = problems.length;
  const progress = solved.length;

  const toggleSolved = (probId) => {
    setSolved(prev => prev.includes(probId) ? prev.filter(id => id !== probId) : [...prev, probId]);
  };

  const toggleRevisit = (probId) => {
    setRevisit(prev => prev.includes(probId) ? prev.filter(id => id !== probId) : [...prev, probId]);
  };

  const groupedData = useMemo(() => problems.reduce((acc, prob) => {
    const topic = prob.topic || "General";
    if (!acc[topic]) acc[topic] = [];
    acc[topic].push(prob);
    return acc;
  }, {}), [problems]);

  const revisitProblems = useMemo(() => problems.filter(p => revisit.includes(p.id)), [problems, revisit]);

  const difficultyStats = useMemo(() => {
    const stats = {};
    DIFFICULTY_META.forEach(({ key }) => { stats[key] = { solved: 0, total: 0 }; });
    problems.forEach((p) => {
      const d = p.difficulty;
      if (!stats[d]) stats[d] = { solved: 0, total: 0 };
      stats[d].total += 1;
      if (solved.includes(p.id)) stats[d].solved += 1;
    });
    return stats;
  }, [problems, solved]);

  if (sheetId !== 'neetcode150' && !sheetData[sheetId]) return <div>Sheet not found!</div>;

  if (progressLoading) {
    return <div className="dsa-module-container">Loading your progress…</div>;
  }

  return (
    <div className="dsa-module-container">
      <header className="dsa-header">
        <div className="dsa-header-top">
          <div className="dsa-header-titles">
            <span className="dsa-eyebrow">DSA Sheet</span>
            <h1 className="dsa-title">{sheetName}</h1>
            <p className="dsa-subtext">{progress} of {total} problems completed</p>
          </div>
          <DifficultyRing stats={difficultyStats} total={total} solvedTotal={progress} />
        </div>
      </header>

      {revisitProblems.length > 0 && (
        <div className="revisit-section">
          <div className="revisit-header" onClick={() => setShowRevisit(!showRevisit)}>
            <div className="revisit-title-group">
              <BookmarkIcon filled />
              <h2 className="revisit-title">Revisit Later</h2>
              <span className="revisit-count">{revisitProblems.length}</span>
            </div>
            <span className="chevron">{showRevisit ? '▲' : '▼'}</span>
          </div>
          {showRevisit && (
            <table className="dsa-table">
              <tbody>
                {revisitProblems.map((prob) => (
                  <tr key={prob.id} className={solved.includes(prob.id) ? 'row-done' : ''}>
                    <td className="cell-center"><input type="checkbox" checked={solved.includes(prob.id)} onChange={() => toggleSolved(prob.id)} /></td>
                    <td className="cell-center col-num-text">{prob.number}</td>
                    <td><a href={prob.link} target="_blank" rel="noreferrer" className="dsa-problem-link">{prob.name}</a></td>
                    <td className="cell-center"><span className={`dsa-badge dsa-badge-${prob.difficulty?.toLowerCase()}`}>{prob.difficulty}</span></td>
                    <td className="cell-center"><button className="icon-btn" onClick={() => toggleRevisit(prob.id)}><BookmarkIcon filled /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {Object.keys(groupedData).map((topic) => {
        const topicProblems = groupedData[topic];
        const topicSolved = topicProblems.filter(p => solved.includes(p.id)).length;
        const topicPct = topicProblems.length > 0 ? (topicSolved / topicProblems.length) * 100 : 0;
        const isOpen = openTopic === topic;

        return (
          <div key={topic} className="topic-section">
            <div className="topic-header" onClick={() => setOpenTopic(isOpen ? null : topic)}>
              <div className="topic-header-left">
                <span className="topic-dot" style={{ background: ACCENT }} />
                <h2 className="topic-title">{topic}</h2>
                <span className="topic-count">{topicSolved}/{topicProblems.length}</span>
              </div>
              <span className="chevron">{isOpen ? '▲' : '▼'}</span>
            </div>
            <div className="topic-progress-track"><div className="topic-progress-fill" style={{ width: `${topicPct}%`, background: ACCENT }} /></div>
            {isOpen && (
              <table className="dsa-table">
                <thead><tr><th>Done</th><th>#</th><th>Problem</th><th>Difficulty</th><th>Revisit</th><th>Open</th></tr></thead>
                <tbody>
                  {topicProblems.map((prob) => (
                    <tr key={prob.id} className={solved.includes(prob.id) ? 'row-done' : ''}>
                      <td className="cell-center"><input type="checkbox" checked={solved.includes(prob.id)} onChange={() => toggleSolved(prob.id)} /></td>
                      <td className="cell-center col-num-text">{prob.number}</td>
                      <td><a href={prob.link} target="_blank" rel="noreferrer" className="dsa-problem-link">{prob.name}</a></td>
                      <td className="cell-center"><span className={`dsa-badge dsa-badge-${prob.difficulty?.toLowerCase()}`}>{prob.difficulty}</span></td>
                      <td className="cell-center"><button className="icon-btn" onClick={() => toggleRevisit(prob.id)}><BookmarkIcon filled={revisit.includes(prob.id)} /></button></td>
                      <td className="cell-center"><a href={prob.link} target="_blank" rel="noreferrer" className="dsa-btn-open"><ExternalLinkIcon /></a></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      })}
    </div>
  );
}