import { useState, useEffect } from 'react';
import { PLATFORM_CONFIG } from '../../../services/contests';
import './ContestCard.css';

function useCountdown(startTime) {
  const [timeLeft, setTimeLeft] = useState('');
  const [urgency, setUrgency] = useState('normal');

  useEffect(() => {
    function calculate() {
      const diff = new Date(startTime) - new Date();

      if (diff <= 0) {
        setTimeLeft('Live Now');
        setUrgency('started');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (diff % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor(
        (diff % (1000 * 60)) / 1000
      );

      if (diff < 60 * 60 * 1000) {
        setUrgency('critical');
      } else if (diff < 24 * 60 * 60 * 1000) {
        setUrgency('soon');
      } else {
        setUrgency('normal');
      }

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft(`${minutes}m ${seconds}s`);
      }
    }

    calculate();

    const id = setInterval(calculate, 1000);

    return () => clearInterval(id);
  }, [startTime]);

  return { timeLeft, urgency };
}

function formatIST(date) {
  return new Date(date).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function formatDuration(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;

  return `${h}h ${m}m`;
}

export default function ContestCard({ contest }) {
  const { platform, title, startTime, duration, url } = contest;

  const config = PLATFORM_CONFIG[platform] || {};
  const { timeLeft, urgency } = useCountdown(startTime);

  return (
    <div className="cc-card">
      {/* Left dot accent */}
      <span
        className="cc-dot"
        style={{ background: config.color }}
      />

      {/* Platform badge */}
      <span
        className="cc-badge"
        style={{
          color: config.color,
          background: config.bg,
          border: `1px solid ${config.border}`,
        }}
      >
        {platform}
      </span>

      {/* Title + meta */}
      <div className="cc-body">
        <span className="cc-title">{title}</span>

        <div className="cc-meta">
          <span className="cc-meta-item">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>

            {formatIST(startTime)} IST
          </span>

          <span className="cc-divider-dot" />

          <span className="cc-meta-item">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>

            {formatDuration(duration)}
          </span>
        </div>
      </div>

      {/* Right — countdown + link */}
      <div className="cc-right">
        <span className={`cc-countdown cc-countdown--${urgency}`}>
          {urgency === 'critical' && <span className="cc-pulse" />}
          {timeLeft}
        </span>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="cc-link"
          style={{ color: config.color }}
        >
          Register →
        </a>
      </div>
    </div>
  );
}