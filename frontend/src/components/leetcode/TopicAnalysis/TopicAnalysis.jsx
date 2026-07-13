import { useState, useMemo } from 'react';
import './TopicAnalysis.css';

export default function TopicAnalysis({ topics }) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('solved');

  // Check if topics exists and is an array
  const safeTopics = Array.isArray(topics) ? topics : [];

  const filtered = useMemo(() => {
    return safeTopics
      .filter((t) => t?.topic?.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => sortBy === 'solved' ? (b.solved || 0) - (a.solved || 0) : (a.topic || '').localeCompare(b.topic || ''));
  }, [safeTopics, search, sortBy]);

  if (safeTopics.length === 0) {
    return (
      <div className="ta-card">
        <span className="ta-title">Topic Analysis</span>
        <p className="ta-na">No topic data available</p>
      </div>
    );
  }

  return (
    <div className="ta-card">
      <div className="ta-header">
        <span className="ta-title">Topic Analysis</span>
        <div className="ta-controls">
          <input className="ta-search" placeholder="Search topics..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="ta-sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="solved">Sort: Solved</option>
            <option value="name">Sort: Name</option>
          </select>
        </div>
      </div>
      <div className="ta-grid">
        {filtered.map((t) => {
          const pct = t.total > 0 ? Math.round((t.solved / t.total) * 100) : 0;
          return (
            <div key={t.topic} className="ta-item">
              <div className="ta-item-top">
                <span className="ta-topic">{t.topic}</span>
                <span className="ta-solved">{t.solved}<span className="ta-total">/{t.total}</span></span>
              </div>
              <div className="ta-bar-bg">
                <div className="ta-bar-fill" style={{ width: `${pct}%` }} />
              </div>
              <span className="ta-pct">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}