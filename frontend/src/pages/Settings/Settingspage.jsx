import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  getPlatforms,
  savePlatformData,
  resetAllSheetsProgress,
  clearAllAppData,
} from '../../services/supabaseService';
import { fetchLeetCodeProfile, fetchLeetCodeSolved } from '../../services/leetcode';
import { fetchCFUser } from '../../services/codeforces';
import { fetchGithubProfile } from '../../services/github';
import { fetchAllCodechefData } from '../../services/codechef';
import { fetchAtCoderProfile } from '../../services/atcoder';
import './SettingsPage.css';

async function fetchLeetCodeCombined(username) {
  const [profile, solved] = await Promise.all([
    fetchLeetCodeProfile(username),
    fetchLeetCodeSolved(username),
  ]);
  return { ...profile, ...solved };
}

const FETCHERS = {
  leetcode: fetchLeetCodeCombined,
  codeforces: fetchCFUser,
  github: fetchGithubProfile,
  codechef: fetchAllCodechefData,
  atcoder: fetchAtCoderProfile,
};

export const NOTIF_LEAD_KEY = 'cpt_notify_lead_ms';
export const NOTIF_ENABLED_KEY = 'cpt_notify_enabled';

const LEAD_OPTIONS = [
  { label: '15 min before', value: 15 * 60 * 1000 },
  { label: '1 hour before', value: 60 * 60 * 1000 },
  { label: '3 hours before', value: 3 * 60 * 60 * 1000 },
  { label: '1 day before', value: 24 * 60 * 60 * 1000 },
];

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const provider = user?.app_metadata?.provider || 'unknown';

  
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const applyTheme = (next) => {
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    setTheme(next);
  };

  
  const [leadMs, setLeadMs] = useState(() =>
    Number(localStorage.getItem(NOTIF_LEAD_KEY)) || LEAD_OPTIONS[1].value
  );
  const [notifEnabled, setNotifEnabled] = useState(
    () => localStorage.getItem(NOTIF_ENABLED_KEY) === 'true'
  );
  const [notifPermission, setNotifPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  );

  useEffect(() => {
    localStorage.setItem(NOTIF_LEAD_KEY, String(leadMs));
  }, [leadMs]);

  const toggleNotifications = async () => {
    if (notifEnabled) {
      setNotifEnabled(false);
      localStorage.setItem(NOTIF_ENABLED_KEY, 'false');
      return;
    }
    if (typeof Notification === 'undefined') return;
    const permission = await Notification.requestPermission();
    setNotifPermission(permission);
    if (permission === 'granted') {
      setNotifEnabled(true);
      localStorage.setItem(NOTIF_ENABLED_KEY, 'true');
    }
  };

  
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState('');
  const [resetting, setResetting] = useState(false);

  const syncAllPlatforms = async () => {
    if (!user) return;
    setSyncing(true);
    setSyncMsg('');
    try {
      const connections = await getPlatforms(user.id);
      const keys = Object.keys(connections).filter((k) => connections[k]?.username);
      if (keys.length === 0) {
        setSyncMsg('No platforms connected yet.');
        return;
      }
      let succeeded = 0;
      for (const key of keys) {
        try {
          const fresh = await FETCHERS[key](connections[key].username);
          await savePlatformData(user.id, key, fresh);
          succeeded++;
        } catch (err) {
          console.error(`Sync failed for ${key}:`, err.message);
        }
      }
      setSyncMsg(`Synced ${succeeded}/${keys.length} platforms.`);
    } finally {
      setSyncing(false);
    }
  };

  const resetProgress = async () => {
    if (!user) return;
    const ok = window.confirm('Reset progress on all DSA sheets? This cannot be undone.');
    if (!ok) return;
    setResetting(true);
    try {
      await resetAllSheetsProgress(user.id);
      setSyncMsg('DSA progress reset.');
    } finally {
      setResetting(false);
    }
  };

 
  const [clearing, setClearing] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const handleClearData = async () => {
    if (!user) return;
    const ok = window.confirm(
      'Delete all your platform connections, DSA progress and profile details, then log out? Your login itself stays intact.'
    );
    if (!ok) return;
    setClearing(true);
    try {
      await clearAllAppData(user.id);
      await logout();
      navigate('/login', { replace: true });
    } finally {
      setClearing(false);
    }
  };

  if (!user) return null;

  return (
    <div className="stg-page">
      <div className="stg-panel">
        <div className="stg-panel__header">
          <span>⚙ Settings</span>
        </div>

        <div className="stg-list">
          {/* Account — single line */}
          <div className="stg-item">
            <span className="stg-item__icon">📧</span>
            <span className="stg-item__label stg-item__label--grow" title={`Signed in with ${provider}`}>
              {user.email}
            </span>
            <span className="stg-chip">{provider}</span>
          </div>

          {}
          <div className="stg-item">
            <span className="stg-item__icon">🔔</span>
            <span className="stg-item__label" title="Get a system notification when a contest is about to start">
              Notifications
            </span>
            <div className="stg-item__controls">
              <select
                className="stg-select"
                value={leadMs}
                onChange={(e) => setLeadMs(Number(e.target.value))}
                disabled={!notifEnabled}
              >
                {LEAD_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <button
                className={`stg-toggle ${notifEnabled ? 'stg-toggle--on' : ''}`}
                onClick={toggleNotifications}
                disabled={notifPermission === 'denied'}
                title={notifPermission === 'denied' ? 'Blocked in browser settings' : 'Toggle notifications'}
              >
                <span className="stg-toggle__knob" />
              </button>
            </div>
          </div>

          {}
          <div className="stg-item">
            <span className="stg-item__icon">🎨</span>
            <span className="stg-item__label">Theme</span>
            <div className="stg-segment">
              <button
                className={`stg-segment__btn ${theme === 'light' ? 'active' : ''}`}
                onClick={() => applyTheme('light')}
              >
                ☀️
              </button>
              <button
                className={`stg-segment__btn ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => applyTheme('dark')}
              >
                🌙
              </button>
            </div>
          </div>

          {}
          <div className="stg-item">
            <span className="stg-item__icon">🔄</span>
            <span className="stg-item__label">Data</span>
            <div className="stg-item__controls">
              <button className="stg-btn stg-btn--sync" onClick={syncAllPlatforms} disabled={syncing}>
                {syncing ? 'Syncing…' : 'Sync Now'}
              </button>
              <button className="stg-btn stg-btn--reset" onClick={resetProgress} disabled={resetting}>
                {resetting ? '…' : 'Reset'}
              </button>
            </div>
          </div>

          {}
          <div className="stg-item">
            <span className="stg-item__icon">⚠️</span>
            <span className="stg-item__label">Account</span>
            <div className="stg-item__controls">
              <button className="stg-btn stg-btn--logout" onClick={handleLogout}>
                Logout
              </button>
              <button className="stg-btn stg-btn--danger" onClick={handleClearData} disabled={clearing}>
                {clearing ? '…' : 'Clear Data'}
              </button>
            </div>
          </div>
        </div>

        {syncMsg && <div className="stg-status">{syncMsg}</div>}
      </div>
    </div>
  );
}