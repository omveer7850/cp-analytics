import { useState, useCallback, useEffect } from 'react';
import {
  fetchAtCoderProfile,
  fetchAtCoderHistory,
  fetchAtCoderSubmissions,
  getRankInfo,
} from '../../services/atcoder';
import { useAuth } from '../../context/AuthContext';

import AtCoderProfileCard  from '../../components/atcoder/ProfileCard/AtCoderProfileCard';
import AtCoderStatsCards   from '../../components/atcoder/StatsCards/AtCoderStatsCards';
import AtCoderRatingGraph  from '../../components/atcoder/RatingGraph/AtCoderRatingGraph';
import AtCoderContestHistory from '../../components/atcoder/ContestHistory/AtCoderContestHistory';
import LoadingState        from '../../components/leetcode/LoadingState/LoadingState';
import EmptyState          from '../../components/leetcode/EmptyState/EmptyState';

import './AtCoderPage.css';

// scoped per logged-in user, so one account's last-searched username
// never leaks into another account on the same browser
const lsKeyFor = (uid) => `ac_last_username_${uid}`;

export default function AtCoderPage() {
  const { user } = useAuth();
  const [input,    setInput]    = useState('');
  const [username, setUsername] = useState('');
  const [data,     setData]     = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [searchErr, setSearchErr] = useState('');

  const loadUser = useCallback(async (uname) => {
    if (!uname.trim()) return;
    setLoading(true);
    setError('');
    setData(null);

    try {
      const profile = await fetchAtCoderProfile(uname);

      const history = await fetchAtCoderHistory(uname).catch(() => []);
      const submissions = await fetchAtCoderSubmissions(uname).catch(() => ({ stats: {}, recent: [] }));

      setData({ profile, history, submissions });
      if (user) localStorage.setItem(lsKeyFor(user.id), uname);
    } catch {
      setError(`Could not find AtCoder user "${uname}". Please check the username.`);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  function handleSearch() {
    const t = input.trim();
    if (!t) { setSearchErr('Please enter a username.'); return; }
    setSearchErr('');
    setUsername(t);
    loadUser(t);
  }

  const { profile, history, submissions } = data ?? {};
  const rankInfo = profile ? getRankInfo(profile.rating) : null;

  const RESULT_COLORS = {
    AC: '#22c55e', WA: '#ef4444', TLE: '#f59e0b',
    RE: '#8b5cf6', CE: '#6366f1', MLE: '#06b6d4',
  };

  return (
    <div className="acp-page">

      {/* Search */}
      <div className="acp-search-wrap">
        <div className="acp-search-inner">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="acp-search-icon">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            className="acp-search-input"
            type="text"
            placeholder="Enter AtCoder username... (e.g. tourist, Benq, radewoosh)"
            value={input}
            onChange={(e) => { setInput(e.target.value); setSearchErr(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            disabled={loading}
          />
          <button className="acp-search-btn" onClick={handleSearch} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        {searchErr && <p className="acp-search-err">{searchErr}</p>}
      </div>

      {/* Empty prompt */}
      {!loading && !data && !error && (
        <div className="acp-empty-prompt">
          <span className="acp-empty-icon">🎯</span>
          <p className="acp-empty-title">Search an AtCoder username</p>
          <p className="acp-empty-sub">Try: tourist · Benq · radewoosh · Um_nik · ecnerwala</p>
        </div>
      )}

      {loading && <LoadingState />}

      {error && !loading && (
        <EmptyState onRetry={() => loadUser(username)} errorMsg={error} />
      )}

      {!loading && !error && data && (
        <>
          {/* Page header */}
          <div className="acp-page-header">
            <div>
              <h1 className="acp-page-title">
                <span className="acp-dot" style={{ background: rankInfo?.color ?? '#4f46e5' }} />
                AtCoder Analytics
              </h1>
              <p className="acp-page-sub">Showing data for <b style={{ color: rankInfo?.color }}>{profile.username}</b></p>
            </div>
            <button className="acp-refresh-btn" onClick={() => loadUser(username)}>↻ Refresh</button>
          </div>

          {/* Profile */}
          <AtCoderProfileCard profile={profile} />

          {/* Stats */}
          <AtCoderStatsCards profile={profile} submissions={submissions} />

          {/* Rating Graph */}
          {history.length > 0
            ? <AtCoderRatingGraph history={history} />
            : (
              <div className="acp-card">
                <div className="acp-section-title">Rating History</div>
                <p className="acp-na">No rating history available</p>
              </div>
            )
          }

          {(Object.keys(submissions.stats).length > 0 || submissions.recent.length > 0) && (
            <div className="acp-subs-row">
              {Object.keys(submissions.stats).length > 0 && (
                <div className="acp-card acp-sub-stats-card">
                  <div className="acp-section-title">Submission Statistics</div>
                  <div className="acp-sub-stats">
                    {Object.entries(submissions.stats).map(([result, count]) => (
                      <div key={result} className="acp-sub-stat-card">
                        <span className="acp-sub-result"
                          style={{ color: RESULT_COLORS[result] ?? '#666', background: (RESULT_COLORS[result] ?? '#666') + '18', border: `1px solid ${(RESULT_COLORS[result] ?? '#666')}40` }}>
                          {result}
                        </span>
                        <span className="acp-sub-count">{count}</span>
                        <span className="acp-sub-lbl">submissions</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {submissions.recent.length > 0 && (
                <div className="acp-card acp-recent-card">
                  <div className="acp-section-title">Recent Accepted Submissions</div>
                  <div className="acp-recent-list">
                    {submissions.recent.map((s, i) => (
                      <div key={i} className="acp-recent-item">
                        <span className="acp-recent-badge acp-badge--ac">AC</span>
                        <span className="acp-recent-problem">
                          <a href={`https://atcoder.jp/contests/${s.contest}/tasks/${s.problemId}`}
                            target="_blank" rel="noopener noreferrer" className="acp-recent-link">
                            {s.problemId}
                          </a>
                        </span>
                        <div className="acp-recent-meta">
                          <span className="acp-recent-lang">{s.language}</span>
                          <span className="acp-meta-sep">·</span>
                          <span>⏱ {s.time}ms</span>
                          <span className="acp-meta-sep">·</span>
                          <span>💾 {s.memory}KB</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {}
          {history.length > 0
            ? <AtCoderContestHistory history={history} />
            : (
              <div className="acp-card">
                <div className="acp-section-title">Contest History</div>
                <p className="acp-na">No contest history available</p>
              </div>
            )
          }
        </>
      )}
    </div>
  );
}