import { getLangColor } from '../../../services/github';
import './GithubLanguageChart.css';

export default function GithubLanguageChart({ languages }) {
  if (!languages.length) return null;
  const top = languages.slice(0, 10);

  return (
    <div className="ghlc-card">
      <div className="ghlc-title">Language Distribution</div>

      {/* Bar chart */}
      <div className="ghlc-bar-wrap">
        {top.map((l) => (
          <div
            key={l.language}
            className="ghlc-bar-seg"
            style={{
              width:      `${l.percentage}%`,
              background: getLangColor(l.language),
            }}
            title={`${l.language}: ${l.percentage}%`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="ghlc-legend">
        {top.map((l) => (
          <div key={l.language} className="ghlc-leg-item">
            <span className="ghlc-leg-dot" style={{ background: getLangColor(l.language) }} />
            <span className="ghlc-leg-name">{l.language}</span>
            <span className="ghlc-leg-pct">{l.percentage}%</span>
            <div className="ghlc-progress-bg">
              <div
                className="ghlc-progress-fill"
                style={{
                  width:      `${l.percentage}%`,
                  background: getLangColor(l.language),
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}