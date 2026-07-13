import { useEffect, useState } from 'react';
import './CircularSolved.css';

function Ring({ radius, stroke, color, percent, delay = 0 }) {
  const [progress, setProgress] = useState(0);
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const t = setTimeout(() => setProgress(percent), delay);
    return () => clearTimeout(t);
  }, [percent, delay]);

  return (
    <circle
      cx="100" cy="100" r={radius}
      fill="none"
      stroke={color}
      strokeWidth={stroke}
      strokeDasharray={circumference}
      strokeDashoffset={circumference * (1 - progress / 100)}
      strokeLinecap="round"
      style={{ transition: 'stroke-dashoffset 1.2s ease', transform: 'rotate(-90deg)', transformOrigin: '100px 100px' }}
    />
  );
}

export default function CircularSolved({ solved }) {
  const easyPct   = (solved.easySolved   / solved.easyTotal)   * 100;
  const mediumPct = (solved.mediumSolved / solved.mediumTotal) * 100;
  const hardPct   = (solved.hardSolved   / solved.hardTotal)   * 100;

  return (
    <div className="cs-card">
      <div className="cs-title">Problems Solved</div>
      <div className="cs-body">
        <div className="cs-svg-wrap">
          <svg width="200" height="200" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="78" fill="none" stroke="#f0f0f0" strokeWidth="10" />
            <circle cx="100" cy="100" r="62" fill="none" stroke="#f0f0f0" strokeWidth="10" />
            <circle cx="100" cy="100" r="46" fill="none" stroke="#f0f0f0" strokeWidth="10" />
            <Ring radius={78} stroke={10} color="#22c55e" percent={easyPct}   delay={100} />
            <Ring radius={62} stroke={10} color="#f59e0b" percent={mediumPct} delay={300} />
            <Ring radius={46} stroke={10} color="#ef4444" percent={hardPct}   delay={500} />
          </svg>
          <div className="cs-center">
            <span className="cs-total">{solved.totalSolved}</span>
            <span className="cs-total-lbl">/ {solved.totalQuestions.toLocaleString()}</span>
          </div>
        </div>
        <div className="cs-legend">
          <div className="cs-leg-item">
            <span className="cs-leg-dot" style={{ background: '#22c55e' }} />
            <div className="cs-leg-text">
              <span className="cs-leg-label">Easy</span>
              <span className="cs-leg-val">{solved.easySolved}<span className="cs-leg-total">/{solved.easyTotal}</span></span>
            </div>
          </div>
          <div className="cs-leg-item">
            <span className="cs-leg-dot" style={{ background: '#f59e0b' }} />
            <div className="cs-leg-text">
              <span className="cs-leg-label">Medium</span>
              <span className="cs-leg-val">{solved.mediumSolved}<span className="cs-leg-total">/{solved.mediumTotal}</span></span>
            </div>
          </div>
          <div className="cs-leg-item">
            <span className="cs-leg-dot" style={{ background: '#ef4444' }} />
            <div className="cs-leg-text">
              <span className="cs-leg-label">Hard</span>
              <span className="cs-leg-val">{solved.hardSolved}<span className="cs-leg-total">/{solved.hardTotal}</span></span>
            </div>
          </div>
          <div className="cs-acceptance">
            <span className="cs-acc-val">{solved.acceptanceRate}%</span>
            <span className="cs-acc-lbl">Acceptance Rate</span>
          </div>
        </div>
      </div>
    </div>
  );
}