import { useState, useCallback, useEffect } from 'react';
import { fetchAllCodechefData } from '../../services/codechef';
import { useAuth } from '../../context/AuthContext';

import CodechefProfileCard   from '../../components/codechef/CodechefProfileCard/CodechefProfileCard';
import CodechefStatsCards    from '../../components/codechef/CodechefStatsCards/CodechefStatsCards';
import CodechefRatingGraph   from '../../components/codechef/CodechefRatingGraph/CodechefRatingGraph';
import CodechefContestHistory from '../../components/codechef/CodechefContestHistory/CodechefContestHistory';

import './CodechefPage.css';

const lsKeyFor = (uid) => `cc_last_username_${uid}`;

function LoadingSkeleton() {
  return (
    <div className="ccp-skeleton">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="ccp-skel-card">
          <div className="ccp-shimmer ccp-shimmer--line" />
          <div className="ccp-shimmer ccp-shimmer--line ccp-shimmer--short" />
          <div className="ccp-shimmer ccp-shimmer--line ccp-shimmer--shorter" />
        </div>
      ))}
    </div>
  );
}

export default function CodechefPage() {
  const { user } = useAuth();
  const [input,     setInput]     = useState('');
  const [username, setUsername] = useState('');
  const [data,      setData]      = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [searchErr, setSearchErr] = useState('');
  const [contestFilter, setContestFilter] = useState(25);

  const loadUser = useCallback(async (uname) => {
    if (!uname.trim()) return;
    setLoading(true);
    setError('');
    setData(null);
    try {
      const result = await fetchAllCodechefData(uname.trim());
      setData(result);
      if (user) localStorage.setItem(lsKeyFor(user.id), uname.trim());
    } catch (e) {
      setError(e.message?.includes('404')
        ? `User "${uname}" not found on CodeChef.`
        : e.message ?? 'Failed to load CodeChef data.'
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const saved = localStorage.getItem(lsKeyFor(user.id));
    if (saved) {
      setInput(saved);
      setUsername(saved);
      loadUser(saved);
    } else {
      setInput('');
      setUsername('');
      setData(null);
    }
    
  }, [user]);

  function handleSearch() {
    const t = input.trim();
    if (!t) { setSearchErr('Please enter a CodeChef username.'); return; }
    setSearchErr('');
    setUsername(t);
    loadUser(t);
  }

  const { profile, history, stats } = data ?? {};

  const filteredHistory = contestFilter === 'All'
    ? history
    : (history ?? []).slice(-contestFilter);

  return (
    <div className="ccp-page">
      <div className="ccp-search-wrap">
        <div className="ccp-search-inner">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            className="ccp-search-icon">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            className="ccp-search-input"
            type="text"
            placeholder="Enter CodeChef username..."
            value={input}
            onChange={(e) => { setInput(e.target.value); setSearchErr(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            disabled={loading}
          />
          <button className="ccp-search-btn" onClick={handleSearch} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        {searchErr && <p className="ccp-search-err">{searchErr}</p>}
      </div>

      {!loading && !data && !error && (
        <div className="ccp-empty">
          <span className="ccp-empty-icon">👨‍🍳</span>
          <p className="ccp-empty-title">Search a CodeChef username</p>
          <p className="ccp-empty-sub">Try: tourist · gennady.korotkevich · uwi</p>
        </div>
      )}

      {loading && <LoadingSkeleton />}

      {error && !loading && (
        <div className="ccp-error-wrap">
          <span className="ccp-error-icon">⚠️</span>
          <p className="ccp-error-title">Failed to load</p>
          <p className="ccp-error-msg">{error}</p>
          <button className="ccp-retry-btn" onClick={() => loadUser(username)}>
            ↻ Try Again
          </button>
        </div>
      )}

      {!loading && !error && data && (
        <>
          <div className="ccp-page-header">
            <div>
              <h1 className="ccp-page-title">
                <span className="ccp-title-dot" />
                CodeChef Analytics
              </h1>
              <p className="ccp-page-sub">
                Showing data for <b>{profile.username}</b>
              </p>
            </div>
            <button className="ccp-refresh-btn" onClick={() => loadUser(username)}>
              ↻ Refresh
            </button>
          </div>

          <CodechefProfileCard profile={profile} />
          <CodechefStatsCards  profile={profile} stats={stats} />

         {history?.length >= 2 && (
  <div className="ccp-graph-section">
    <div className="ccp-graph-controls" style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
      {[10, 25, 50, 'All'].map((num) => (
        <button 
          key={num} 
          className={`arg-range-btn ${contestFilter === num ? 'arg-range-btn-active' : ''}`} 
          onClick={() => setContestFilter(num)}
        >
          {num}
        </button>
      ))}
    </div>
    
    <CodechefRatingGraph history={filteredHistory} />
  </div>
)}

          {history?.length > 0 && (
            <CodechefContestHistory history={history} />
          )}
        </>
      )}
    </div>
  );
}