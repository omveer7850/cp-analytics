import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllContests } from '../../services/contests';
import { NOTIF_LEAD_KEY, NOTIF_ENABLED_KEY } from '../../pages/Settings/SettingsPage';
import './NotificationDropdown.css';

const MAX_SHOWN = 4;
const REFETCH_MS = 10 * 60 * 1000; // pull a fresh contest list every 10 min
const TICK_MS = 30 * 1000;         // re-check "has it started yet" every 30s
const DEFAULT_LEAD_MS = 60 * 60 * 1000; // matches the default option in Settings

const PLATFORM_COLORS = {
  Codeforces: '#4a90d9',
  LeetCode: '#f89a1c',
  CodeChef: '#5b4638',
  AtCoder: '#e53935',
};

function platformColor(platform) {
  return PLATFORM_COLORS[platform] || '#6b7280';
}

function formatCountdown(startTime, now) {
  const diffMs = new Date(startTime) - now;
  if (diffMs <= 0) return 'Starting now';
  const diffMin = Math.floor(diffMs / 60000);
  const days = Math.floor(diffMin / 1440);
  const hours = Math.floor((diffMin % 1440) / 60);
  const mins = diffMin % 60;
  if (days > 0) return `in ${days}d ${hours}h`;
  if (hours > 0) return `in ${hours}h ${mins}m`;
  return `in ${mins}m`;
}

function formatWhen(startTime) {
  return new Date(startTime).toLocaleString('en-US', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function NotificationDropdown() {
  const navigate = useNavigate();
  const [contests, setContests] = useState([]);
  const [now, setNow] = useState(() => new Date());
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const notifiedRef = useRef(new Set());

  // Pull the same contest list the Contests page uses, refreshed periodically
  // so newly-announced contests eventually show up here too.
  useEffect(() => {
    let cancelled = false;
    const load = () => {
      fetchAllContests().then((data) => {
        if (!cancelled) setContests(data);
      });
    };
    load();
    const refetchId = setInterval(load, REFETCH_MS);
    return () => {
      cancelled = true;
      clearInterval(refetchId);
    };
  }, []);

  // Ticks the clock so contests that have started drop out of the list
  // automatically — no manual refresh needed.
  useEffect(() => {
    const tickId = setInterval(() => setNow(new Date()), TICK_MS);
    return () => clearInterval(tickId);
  }, []);

  // Fires a one-time browser notification per contest once it enters the
  // lead-time window configured on the Settings page.
  useEffect(() => {
    const enabled = localStorage.getItem(NOTIF_ENABLED_KEY) === 'true';
    if (!enabled || typeof Notification === 'undefined' || Notification.permission !== 'granted') return;

    const leadMs = Number(localStorage.getItem(NOTIF_LEAD_KEY)) || DEFAULT_LEAD_MS;

    for (const c of contests) {
      const msUntilStart = new Date(c.startTime) - now;
      if (msUntilStart > 0 && msUntilStart <= leadMs && !notifiedRef.current.has(c.id)) {
        notifiedRef.current.add(c.id);
        new Notification(`${c.title} starts soon`, {
          body: `${c.platform} · ${formatWhen(c.startTime)}`,
        });
      }
    }
  }, [contests, now]);

  // Close the dropdown on outside click.
  useEffect(() => {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const upcoming = useMemo(() => {
    return contests
      .filter((c) => new Date(c.startTime) > now)
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
      .slice(0, MAX_SHOWN);
  }, [contests, now]);

  return (
    <div className="notif" ref={wrapRef}>
      <button
        className="navbar__icon-btn"
        aria-label="Notifications"
        onClick={() => setOpen((v) => !v)}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {upcoming.length > 0 && <span className="navbar__badge" />}
      </button>

      {open && (
        <div className="notif__panel">
          <div className="notif__panel-header">
            <span>Upcoming Contests</span>
            <button className="notif__view-all" onClick={() => { setOpen(false); navigate('/contests'); }}>
              View all
            </button>
          </div>

          <div className="notif__list">
            {upcoming.length === 0 ? (
              <p className="notif__empty">No upcoming contests right now.</p>
            ) : (
              upcoming.map((c) => (
                <div className="notif__item" key={c.id}>
                  <span className="notif__dot" style={{ background: platformColor(c.platform) }} />
                  <div className="notif__item-body">
                    <span className="notif__item-title">{c.title}</span>
                    <span className="notif__item-meta">
                      {c.platform} &middot; {formatWhen(c.startTime)}
                    </span>
                  </div>
                  <span className="notif__countdown">{formatCountdown(c.startTime, now)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}