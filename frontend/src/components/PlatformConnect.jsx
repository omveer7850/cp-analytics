import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getPlatforms, savePlatformUsername, savePlatformData, logActivity } from '../services/supabaseService';
import './PlatformConnect.css';

/**
 * Handles the connect / edit / refresh UI for a single platform, and keeps
 * the saved username + fetched data in sync with Firestore.
 *
 * Usage (inside e.g. LeetCodePage.jsx):
 *
 *   <PlatformConnect
 *     platform="leetcode"
 *     label="LeetCode"
 *     fetchProfile={(username) => fetchLeetCodeProfile(username)}
 *     onData={(data) => setProfileData(data)}
 *   />
 *
 * `fetchProfile` is whatever function your existing API module already
 * exports (e.g. atcoder.js's fetchAtCoderProfile) — this component doesn't
 * know or care how the request is made, it just calls it and caches the
 * result in Firestore.
 */
export default function PlatformConnect({ platform, label, fetchProfile, onData }) {
  const { user } = useAuth();
  const [username, setUsername] = useState('');
  const [connectedUsername, setConnectedUsername] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState('');

  // load the saved username (and trigger an initial fetch) on mount / user change
  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      const platforms = await getPlatforms(user.id);
      const saved = platforms?.[platform];
      if (cancelled) return;

      if (saved?.username) {
        setConnectedUsername(saved.username);
        if (saved.data) onData?.(saved.data); // show cached data immediately
        await syncData(saved.username, cancelled);
      }
      setLoading(false);
    })();

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, platform]);

  const syncData = async (usernameToFetch, cancelledRef = false) => {
    if (!usernameToFetch) return;
    setSyncing(true);
    setError('');
    try {
      const data = await fetchProfile(usernameToFetch);
      if (cancelledRef) return;
      onData?.(data);
      await savePlatformData(user.id, platform, data);
      logActivity(user.id, 'platform_sync', { type: 'single', platform, username: usernameToFetch });
    } catch (err) {
      if (!cancelledRef) setError('Failed to fetch latest data.');
    } finally {
      if (!cancelledRef) setSyncing(false);
    }
  };

  const handleConnect = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    setError('');
    setSyncing(true);
    try {
      await savePlatformUsername(user.id, platform, username.trim());
      setConnectedUsername(username.trim());
      setEditing(false);
      await syncData(username.trim());
    } catch (err) {
      setError('Could not connect. Please try again.');
      setSyncing(false);
    }
  };

  const handleRefresh = () => syncData(connectedUsername);

  if (loading) {
    return <div className="platform-connect platform-connect--loading">Checking connection…</div>;
  }

  if (!connectedUsername || editing) {
    return (
      <form className="platform-connect" onSubmit={handleConnect}>
        <input
          type="text"
          className="platform-connect__input"
          placeholder={`${label} username`}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoFocus={editing}
        />
        <button type="submit" className="platform-connect__btn" disabled={syncing}>
          {syncing ? 'Connecting…' : 'Connect'}
        </button>
        {editing && (
          <button
            type="button"
            className="platform-connect__btn platform-connect__btn--ghost"
            onClick={() => setEditing(false)}
          >
            Cancel
          </button>
        )}
        {error && <p className="platform-connect__error">{error}</p>}
      </form>
    );
  }

  return (
    <div className="platform-connect platform-connect--connected">
      <div>
        <span className="platform-connect__label">Connected as</span>
        <span className="platform-connect__username">{connectedUsername}</span>
      </div>
      <div className="platform-connect__actions">
        <button
          type="button"
          className="platform-connect__btn platform-connect__btn--ghost"
          onClick={() => { setUsername(connectedUsername); setEditing(true); }}
        >
          Edit Username
        </button>
        <button
          type="button"
          className="platform-connect__btn"
          onClick={handleRefresh}
          disabled={syncing}
        >
          {syncing ? 'Refreshing…' : 'Refresh Data'}
        </button>
      </div>
      {error && <p className="platform-connect__error">{error}</p>}
    </div>
  );
}