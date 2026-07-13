import { useState } from 'react';
import { compareUsers, getWinners, generateInsights, PLATFORMS } from './CompareService';
import CompareProfileCards from './components/CompareProfileCards';
import CompareTable        from './components/CompareTable';
import CompareInsights     from './components/CompareInsights';
import './ComparePage.css';

const PLATFORM_COLORS = {
  LeetCode:   '#f89a1c',
  Codeforces: '#4a90d9',
  AtCoder:    '#e53935',
  GitHub:     '#24292e',
};

function SkeletonCard() {
  return (
    <div className="cp-skeleton-card">
      <div className="cp-shimmer cp-shimmer--circle" />
      <div className="cp-shimmer cp-shimmer--line" />
      <div className="cp-shimmer cp-shimmer--line cp-shimmer--short" />
    </div>
  );
}

export default function ComparePage() {
  const [platform,  setPlatform]  = useState('LeetCode');
  const [usernames, setUsernames] = useState(['', '']);
  const [results,   setResults]   = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');

  function handlePlatformChange(p) {
    setPlatform(p);
    setUsernames(['', '']);
    setResults(null);
    setError('');
  }

  function handleAddUser() {
    if (usernames.length < 4) setUsernames([...usernames, '']);
  }

  function handleRemoveUser(i) {
    if (usernames.length <= 2) return;
    setUsernames(usernames.filter((_, idx) => idx !== i));
  }

  function handleUsernameChange(i, val) {
    const updated = [...usernames];
    updated[i] = val;
    setUsernames(updated);
  }

  async function handleCompare() {
    const filled = usernames.map((u) => u.trim()).filter(Boolean);
    if (filled.length < 2) { setError('Please enter at least 2 usernames.'); return; }
    setError('');
    setLoading(true);
    setResults(null);
    try {
      const res = await compareUsers(platform, filled);
      setResults(res);
    } catch (e) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const validResults = results?.filter((r) => r.ok) ?? [];
  const winners  = validResults.length >= 2 ? getWinners(results) : {};
  const insights = validResults.length >= 2 ? generateInsights(results) : [];
  const color    = PLATFORM_COLORS[platform];

  return (
    <div className="cp-page">

      {/* Header */}
      <div className="cp-page-header">
        <div>
          <h1 className="cp-page-title">
            <span className="cp-title-dot" style={{ background: color }} />
            Compare
          </h1>
          <p className="cp-page-sub">Compare multiple users on the same platform</p>
        </div>
      </div>

      {/* Setup Card */}
      <div className="cp-setup-card">

        {/* Platform Selector */}
        <div className="cp-field-group">
          <label className="cp-label">Platform</label>
          <div className="cp-platform-pills">
            {PLATFORMS.map((p) => (
              <button
                key={p}
                className={`cp-platform-pill ${platform === p ? 'active' : ''}`}
                style={platform === p ? {
                  background:   PLATFORM_COLORS[p] + '18',
                  borderColor:  PLATFORM_COLORS[p],
                  color:        PLATFORM_COLORS[p],
                } : {}}
                onClick={() => handlePlatformChange(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Username Inputs */}
        <div className="cp-field-group">
          <label className="cp-label">Users to Compare</label>
          <div className="cp-inputs">
            {usernames.map((u, i) => (
              <div key={i} className="cp-input-row">
                <span className="cp-input-num" style={{ color }}>
                  {i + 1}
                </span>
                <input
                  className="cp-input"
                  type="text"
                  placeholder={`Enter ${platform} username...`}
                  value={u}
                  onChange={(e) => handleUsernameChange(i, e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCompare()}
                />
                {usernames.length > 2 && (
                  <button className="cp-remove-btn" onClick={() => handleRemoveUser(i)}>✕</button>
                )}
              </div>
            ))}
          </div>

          {usernames.length < 4 && (
            <button className="cp-add-btn" onClick={handleAddUser}>
              + Add User
            </button>
          )}
        </div>

        {error && <p className="cp-error">{error}</p>}

        <button
          className="cp-compare-btn"
          style={{ background: color }}
          onClick={handleCompare}
          disabled={loading}
        >
          {loading ? 'Comparing...' : `Compare on ${platform}`}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="cp-skeleton-grid">
          {usernames.filter(Boolean).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Empty state */}
      {!loading && !results && (
        <div className="cp-empty">
          <span className="cp-empty-icon">⚖️</span>
          <p className="cp-empty-title">Select a platform and enter usernames</p>
          <p className="cp-empty-sub">You can compare 2 to 4 users at once</p>
        </div>
      )}

      {/* Results */}
      {!loading && results && (
        <div className="cp-results">
          <CompareProfileCards results={results} />
          {validResults.length >= 2 && (
            <>
              <CompareTable   results={results} winners={winners} />
              <CompareInsights insights={insights} />
            </>
          )}
        </div>
      )}
    </div>
  );
}