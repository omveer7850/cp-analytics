import './CompareProfileCards.css';

const PLATFORM_COLORS = {
  LeetCode:   '#f89a1c',
  Codeforces: '#4a90d9',
  AtCoder:    '#e53935',
  GitHub:     '#24292e',
};

export default function CompareProfileCards({ results }) {
  return (
    <div className="cpc-grid">
      {results.map((r, i) => {
        if (!r.ok) {
          return (
            <div key={i} className="cpc-card cpc-card--error">
              <div className="cpc-error-icon">⚠️</div>
              <p className="cpc-error-name">{r.username}</p>
              <p className="cpc-error-msg">{r.error}</p>
            </div>
          );
        }

        const { data } = r;
        const color = data.ratingColor ?? PLATFORM_COLORS[data.platform] ?? '#4f46e5';

        return (
          <div key={i} className="cpc-card" style={{ borderTop: `3px solid ${color}` }}>
            <div className="cpc-card-top">
              {data.avatar
                ? <img src={data.avatar} alt={data.username} className="cpc-avatar" />
                : (
                  <div className="cpc-avatar-placeholder" style={{ background: color + '22', color }}>
                    {data.username?.[0]?.toUpperCase()}
                  </div>
                )
              }
              <div className="cpc-platform-badge" style={{ background: color + '18', color, border: `1px solid ${color}40` }}>
                {data.platform}
              </div>
            </div>

            <div className="cpc-card-body">
              <a href={data.profileUrl} target="_blank" rel="noopener noreferrer"
                className="cpc-username" style={{ color }}>
                {data.username}
              </a>
              {data.country && <p className="cpc-country">🌍 {data.country}</p>}

              <div className="cpc-rating-row">
                <div className="cpc-rating-item">
                  <span className="cpc-rating-val" style={{ color }}>{data.displayRating}</span>
                  <span className="cpc-rating-lbl">Rating</span>
                </div>
                <div className="cpc-rating-div" />
                <div className="cpc-rating-item">
                  <span className="cpc-rating-val">{data.displayRank}</span>
                  <span className="cpc-rating-lbl">Rank</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}