import { useEffect, useState, useCallback } from 'react';
import {
  fetchLeetCodeProfile,
  fetchLeetCodeSolved,
  fetchLeetCodeContestHistory,
  fetchLeetCodeCalendar,
  fetchRecentSubmissions,
} from '../../services/leetcode';
import { useAuth } from '../../context/AuthContext';

import ProfileCard     from '../../components/leetcode/ProfileCard/ProfileCard';
import CircularSolved  from '../../components/leetcode/CircularSolved/CircularSolved';
import StatsCards      from '../../components/leetcode/StatsCards/StatsCards';
import RecentContests  from '../../components/leetcode/RecentContests/RecentContests';
import ActivityHeatmap from '../../components/leetcode/ActivityHeatmap/ActivityHeatmap';
import LoadingState    from '../../components/leetcode/LoadingState/LoadingState';
import EmptyState      from '../../components/leetcode/EmptyState/EmptyState';

import './LeetCodePage.css';

const DIFFICULTY = { Easy: '#22c55e', Medium: '#f59e0b', Hard: '#ef4444' };
const LANG_COLOR  = { 'cpp': '#00599c', 'python': '#3572a5', 'python3': '#3572a5', 'java': '#b07219', 'javascript': '#f1e05a' };

const lsKeyFor = (uid) => `lc_last_username_${uid}`;

// LeetCode's public API/proxy is easily tripped by simultaneous requests
// for the same user. Firing all 5 calls in the same instant (the old
// Promise.all) is what was causing the 429s / JSON parse errors. This
// helper runs a list of fetchers one at a time with a stagger between
// each — cleaner and less error-prone than repeating `await delay(...)`
// five times by hand.
const SUB_CALL_STAGGER_MS = 300;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runStaggered(tasks, staggerMs) {
  const results = [];
  for (let i = 0; i < tasks.length; i++) {
    if (i > 0) await delay(staggerMs);
    results.push(await tasks[i]());
  }
  return results;
}

export default function LeetCodePage() {
  const { user } = useAuth();
  const [input,   setInput]   = useState('');
  const [username, setUsername] = useState('');
  const [data,     setData]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [searchErr, setSearchErr] = useState('');

  const loadUser = useCallback(async (uname) => {
    if (!uname.trim()) return;
    setLoading(true);
    setError('');
    setData(null);
    try {
      const [profile, solved, contest, calendar, recent] = await runStaggered([
        () => fetchLeetCodeProfile(uname),
        () => fetchLeetCodeSolved(uname),
        () => fetchLeetCodeContestHistory(uname),
        () => fetchLeetCodeCalendar(uname),
        () => fetchRecentSubmissions(uname),
      ], SUB_CALL_STAGGER_MS);

      setData({ profile, solved, contest, calendar, recent });
      if (user) localStorage.setItem(lsKeyFor(user.id), uname);
    } catch {
      setError(`Could not find LeetCode user "${uname}". Please check the username.`);
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
    const trimmed = input.trim();
    if (!trimmed) { setSearchErr('Please enter a username.'); return; }
    setSearchErr('');
    setUsername(trimmed);
    loadUser(trimmed);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSearch();
  }

  const { profile, solved, contest, calendar, recent } = data ?? {};

  return (
    <div className="lcp-page">
      <div className="lcp-search-wrap">
        <div className="lcp-search-inner">
          <div className="lcp-search-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
          <input
            className="lcp-search-input"
            type="text"
            placeholder="Enter LeetCode username..."
            value={input}
            onChange={(e) => { setInput(e.target.value); setSearchErr(''); }}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button
            className="lcp-search-btn"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        {searchErr && <p className="lcp-search-err">{searchErr}</p>}
      </div>

      {!loading && !data && !error && (
        <div className="lcp-empty-prompt">
          <span className="lcp-empty-icon">🔍</span>
          <p className="lcp-empty-title">Search a LeetCode username</p>
          <p className="lcp-empty-sub">Try: tourist, Benq, lee215, omveer_01</p>
        </div>
      )}

      {loading && <LoadingState />}

      {error && !loading && (
        <EmptyState onRetry={() => loadUser(username)} errorMsg={error} />
      )}

      {!loading && !error && data && (
        <>
          <div className="lcp-page-header">
            <div>
              <h1 className="lcp-page-title">
                <span className="lcp-lc-dot" />
                LeetCode Analytics
              </h1>
              <p className="lcp-page-sub">
                Showing data for <b>{profile.username}</b>
              </p>
            </div>
            <button className="lcp-refresh-btn" onClick={() => loadUser(username)}>
              ↻ Refresh
            </button>
          </div>

          <div className="lcp-row lcp-row--top">
            <div className="lcp-col lcp-col--grow">
              <ProfileCard profile={profile} contestData={contest} />
            </div>
            <div className="lcp-col lcp-col--auto">
              <CircularSolved solved={solved} />
            </div>
          </div>

          <StatsCards solved={solved} contest={contest} calendar={calendar} />

          <ActivityHeatmap calendar={calendar} />

          {contest.history.length > 0
            ? <RecentContests data={contest} />
            : <div className="lcp-card"><p className="lcp-na">No contest data available</p></div>
          }

          <div className="lcp-card">
            <div className="lcp-section-title">Recent Accepted Submissions</div>
            {recent.length === 0
              ? <p className="lcp-na">No recent submissions available</p>
              : (
                <div className="lcp-sub-list">
                  {recent.map((s) => (
                    <div key={s.id} className="lcp-sub-item">
                      <span
                        className="lcp-diff-badge"
                        style={{
                          color: DIFFICULTY[s.difficulty] ?? '#666',
                          background: (DIFFICULTY[s.difficulty] ?? '#666') + '18',
                          border: `1px solid ${(DIFFICULTY[s.difficulty] ?? '#666')}40`,
                        }}
                      >
                        {s.difficulty}
                      </span>
                      <span className="lcp-sub-title">{s.title}</span>
                      <div className="lcp-sub-meta">
                        <span className="lcp-lang" style={{ color: LANG_COLOR[s.lang] ?? '#666' }}>
                          {s.lang}
                        </span>
                        <span className="lcp-meta-sep">·</span>
                        <span className="lcp-meta-txt">⏱ {s.runtime}</span>
                        <span className="lcp-meta-sep">·</span>
                        <span className="lcp-meta-txt">💾 {s.memory}</span>
                        <span className="lcp-meta-sep">·</span>
                        <span className="lcp-meta-time">{s.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )
            }
          </div>
        </>
      )}
    </div>
  );
}