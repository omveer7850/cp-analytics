import { useState, useCallback, useEffect } from 'react';
import { fetchAllGithubData } from '../../services/github';
import { useAuth } from '../../context/AuthContext';

import GithubProfileCard    from '../../components/github/GithubProfileCard/GithubProfileCard';
import GithubStatsCards     from '../../components/github/GithubStatsCards/GithubStatsCards';
import GithubRepoTable      from '../../components/github/GithubRepoTable/GithubRepoTable';
import GithubLanguageChart  from '../../components/github/GithubLanguageChart/GithubLanguageChart';
import GithubActivity       from '../../components/github/GithubActivity/GithubActivity';
import GithubOrgs           from '../../components/github/GithubOrgs/GithubOrgs';

import './GithubPage.css';


const lsKeyFor = (uid) => `gh_last_username_${uid}`;

function LoadingSkeleton() {
  return (
    <div className="ghp-skeleton">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="ghp-skel-card">
          <div className="ghp-shimmer ghp-shimmer--line" />
          <div className="ghp-shimmer ghp-shimmer--line ghp-shimmer--short" />
          <div className="ghp-shimmer ghp-shimmer--line ghp-shimmer--shorter" />
        </div>
      ))}
    </div>
  );
}

export default function GithubPage() {
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
      const result = await fetchAllGithubData(uname.trim());
      setData(result);
      if (user) localStorage.setItem(lsKeyFor(user.id), uname.trim());
    } catch (e) {
      setError(e.message ?? 'Failed to load GitHub data.');
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
    if (!t) { setSearchErr('Please enter a GitHub username.'); return; }
    setSearchErr('');
    setUsername(t);
    loadUser(t);
  }

  const { profile, repos, orgs, events, languages, stats } = data ?? {};

  return (
    <div className="ghp-page">

      {}
      <div className="ghp-search-wrap">
        <div className="ghp-search-inner">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            className="ghp-search-icon">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            className="ghp-search-input"
            type="text"
            placeholder="Enter GitHub username... (e.g. torvalds, gaearon, sindresorhus)"
            value={input}
            onChange={(e) => { setInput(e.target.value); setSearchErr(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            disabled={loading}
          />
          <button
            className="ghp-search-btn"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        {searchErr && <p className="ghp-search-err">{searchErr}</p>}
      </div>

      {}
      {!loading && !data && !error && (
        <div className="ghp-empty">
          <span className="ghp-empty-icon">🐙</span>
          <p className="ghp-empty-title">Search a GitHub username</p>
          <p className="ghp-empty-sub">Try: torvalds · gaearon · sindresorhus · ThePrimeagen</p>
        </div>
      )}

      {loading && <LoadingSkeleton />}

      {error && !loading && (
        <div className="ghp-error-wrap">
          <span className="ghp-error-icon">⚠️</span>
          <p className="ghp-error-title">Failed to load</p>
          <p className="ghp-error-msg">{error}</p>
          <button className="ghp-retry-btn" onClick={() => loadUser(username)}>
            ↻ Try Again
          </button>
        </div>
      )}

      {!loading && !error && data && (
        <>
          {}
          <div className="ghp-page-header">
            <div>
              <h1 className="ghp-page-title">
                <span className="ghp-title-dot" />
                GitHub Analytics
              </h1>
              <p className="ghp-page-sub">
                Showing data for <b>{profile.login}</b>
              </p>
            </div>
            <button className="ghp-refresh-btn" onClick={() => loadUser(username)}>
              ↻ Refresh
            </button>
          </div>

          {}
          <GithubProfileCard profile={profile} />

          {}
          <GithubStatsCards profile={profile} stats={stats} />

          {}
          {languages.length > 0 && (
            <GithubLanguageChart languages={languages} />
          )}

          {}
          {repos.length > 0 && (
            <GithubRepoTable repos={repos} />
          )}

          {}
          {events.length > 0 && (
            <GithubActivity events={events} />
          )}

          {}
          {orgs.length > 0 && (
            <GithubOrgs orgs={orgs} />
          )}
        </>
      )}
    </div>
  );
}